import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoryService } from '../../../../core/services/category.service';
import { AdminCategoryDetailsResponse, CategorySummaryDto } from '../../../../core/models';

// Flattened category for dropdown display
interface DropdownCategory {
  id: number;
  name: string;
  depth: number;
  fullPath: string;
  isCurrentCategory: boolean;
  isCurrentParent: boolean;
  isDescendant: boolean;
}

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './edit.html',
  styleUrls: ['../style.css', './edit.css'],
})
export class Edit implements OnInit {
  // Services
  private readonly route = inject(ActivatedRoute);
  private readonly categoryService = inject(CategoryService);

  // State
  category = signal<AdminCategoryDetailsResponse | null>(null);
  showMoveModal = false;

  // Tree Dropdown State
  isDropdownOpen = false;
  selectedParentId: number | null = null;
  selectedParentName: string | null = null;
  dropdownCategories: DropdownCategory[] = [];

  // ==================== LIFECYCLE ====================

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const categoryId = Number(params.get('id'));
      if (categoryId) {
        this.loadCategoryDetails(categoryId);
      }
    });
  }

  // ==================== HELPER METHODS ====================

  private loadCategoryDetails(categoryId: number): void {
    // Reset to null to trigger view re-render and animations
    this.category.set(null);

    this.categoryService.getAdminCategoryDetails(categoryId).subscribe({
      next: (response) => {
        this.category.set(response);
      },
      error: (error) => {
        console.error('Error loading category details:', error);
      },
    });
  }

  openMoveModal(): void {
    this.showMoveModal = true;
    this.isDropdownOpen = false;

    // Initialize with current parent selected
    const cat = this.category();
    if (cat) {
      this.selectedParentId = cat.parentId ?? null;
      this.selectedParentName = cat.parentName;
      this.loadDropdownCategories();
    }
  }

  closeMoveModal(): void {
    this.showMoveModal = false;
    this.resetMoveModal();
  }

  private loadDropdownCategories(): void {
    const cat = this.category();
    if (!cat) return;

    this.categoryService.getAllStoreCategories().subscribe({
      next: (categories) => {
        this.dropdownCategories = this.flattenCategories(categories, 0, cat.id, cat.parentId);
      },
      error: (error) => {
        console.error('Error loading categories for dropdown:', error);
      },
    });
  }

  private flattenCategories(
    categories: CategorySummaryDto[],
    depth: number,
    currentCategoryId: number,
    currentParentId?: number,
    isUnderCurrent: boolean = false,
    parentPath: string = 'Root',
  ): DropdownCategory[] {
    const result: DropdownCategory[] = [];

    for (const category of categories) {
      const isCurrent = category.id === currentCategoryId;
      const isDescendant = isUnderCurrent;
      const fullPath = parentPath + ' › ' + category.name;

      result.push({
        id: category.id,
        name: category.name,
        depth,
        fullPath,
        isCurrentCategory: isCurrent,
        isCurrentParent: category.id === currentParentId,
        isDescendant,
      });

      if (category.subcategories && category.subcategories.length > 0) {
        result.push(
          ...this.flattenCategories(
            category.subcategories,
            depth + 1,
            currentCategoryId,
            currentParentId,
            isUnderCurrent || isCurrent,
            fullPath,
          ),
        );
      }
    }

    return result;
  }

  // ==================== TREE DROPDOWN METHODS ====================

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  selectParent(id: number, name: string, fullPath: string): void {
    this.selectedParentId = id;
    this.selectedParentName = fullPath;
    this.isDropdownOpen = false;
  }

  getDepthArray(depth: number): number[] {
    return Array(depth).fill(0);
  }

  getSelectedParentName(): string {
    return this.selectedParentName || 'Choose a parent category...';
  }

  private resetMoveModal(): void {
    this.isDropdownOpen = false;
    this.selectedParentId = null;
    this.selectedParentName = null;
    this.dropdownCategories = [];
  }
}
