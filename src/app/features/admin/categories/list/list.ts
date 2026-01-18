import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
// Libraries
import { NgxPaginationModule } from 'ngx-pagination';
import { Subject, debounceTime, distinctUntilChanged, forkJoin, timer } from 'rxjs';
// Services
import { CategoryService } from '../../../../core/services/category.service';
// Models
import { AdminCategoryQueryParams, AdminCategorySummaryDto } from '../../../../core/models';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterLink, NgxPaginationModule],
  templateUrl: './list.html',
  styleUrls: ['../../users/style.css', './list.css'],
})
export class List implements OnInit {
  // Services
  private readonly categoryService = inject(CategoryService);

  // State
  categories = signal<AdminCategorySummaryDto[]>([]);
  totalCount = signal(0);
  globalTotalCount = signal(0); // Total without filters
  isLoading = signal(false);

  // Filters
  selectedType = signal<'all' | 'node' | 'leaf'>('all');

  // Pagination
  pageIndex = 1;
  pageSize = 10;

  // Search
  private searchTerms = new Subject<string>();
  searchTerm = signal('');

  // ==================== Computed Properties ====================
  hasActiveFilters = computed(() => {
    return this.selectedType() !== 'all' || !!this.searchTerm();
  });

  // ==================== Lifecycle ====================
  ngOnInit(): void {
    this.setupSearchDebounce();
    this.loadCategories();
  }

  private setupSearchDebounce(): void {
    this.searchTerms.pipe(debounceTime(500), distinctUntilChanged()).subscribe((term) => {
      this.searchTerm.set(term);
      this.pageIndex = 1;
      this.loadCategories();
    });
  }

  // ==================== Filter Handlers ====================
  onTypeChange(type: 'all' | 'node' | 'leaf'): void {
    if (this.selectedType() === type) return;
    this.selectedType.set(type);
    this.pageIndex = 1;
    this.loadCategories();
  }

  onSearch(term: string): void {
    this.isLoading.set(true);
    this.searchTerms.next(term);
  }

  clearFilters(): void {
    this.selectedType.set('all');
    this.searchTerm.set('');
    this.pageIndex = 1;
    this.loadCategories();
  }

  getTypeLabel(): string {
    switch (this.selectedType()) {
      case 'node':
        return 'Node';
      case 'leaf':
        return 'Leaf';
      default:
        return 'All Types';
    }
  }

  formatHierarchyPath(path: string | null | undefined): string {
    if (!path) {
      return 'Root';
    }
    // Remove leading slash and replace slashes with chevron separator
    return path.replace(/^\//, '').replace(/\//g, ' › ');
  }

  // ==================== Pagination ====================
  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadCategories(true);
  }

  private scrollToTableIfNeeded(): void {
    setTimeout(() => {
      const anchor = document.getElementById('categoriesTableAnchor');
      if (anchor) {
        const rect = anchor.getBoundingClientRect();
        if (rect.top < 0) {
          anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 50);
  }

  // ==================== Data Loading ====================
  loadCategories(scrollToTable = false): void {
    this.isLoading.set(true);
    const params = this.buildQueryParams();

    forkJoin([this.categoryService.getAdminCategories(params), timer(300)]).subscribe({
      next: ([response]) => {
        const formattedItems = response.items.map((item) => ({
          ...item,
          hierarchyPath: this.formatHierarchyPath(item.hierarchyPath),
        }));
        this.categories.set(formattedItems);
        this.totalCount.set(response.totalCount);

        // Store global total on first load (when no filters)
        if (!this.hasActiveFilters() && this.globalTotalCount() === 0) {
          this.globalTotalCount.set(response.totalCount);
        }

        this.isLoading.set(false);
        console.log('Categories API Response:', response);

        if (scrollToTable) {
          this.scrollToTableIfNeeded();
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.isLoading.set(false);
      },
    });
  }

  private buildQueryParams(): AdminCategoryQueryParams {
    const params: AdminCategoryQueryParams = {};

    if (this.pageIndex > 1) {
      params.pageIndex = this.pageIndex;
    }
    if (this.selectedType() !== 'all') {
      params.type = this.selectedType() as 'node' | 'leaf';
    }
    if (this.searchTerm()) {
      params.search = this.searchTerm();
    }

    return params;
  }
}
