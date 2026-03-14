//Angular Imports
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
//Services
import { CategoryService } from '../../../../core/services/category.service';
//Models
import { CategorySummaryDto } from '../../../../core/models';

interface DropdownCategory {
  id: number;
  name: string;
  depth: number;
  fullPath: string;
}

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './add.html',
  styleUrls: ['../../users/style.css', './add.css'],
})
export class Add implements OnInit {
  // Services
  private readonly categoryService = inject(CategoryService);

  // State
  isDropdownOpen = signal(false);
  dropdownCategories = signal<DropdownCategory[]>([]);
  selectedParentId = signal<number | null>(null);
  selectedParentLabel = signal<string | null>(null);
  selectedParentPath = signal<string | null>(null);

  ngOnInit(): void {
    this.loadParentCategories();
  }

  toggleDropdown(): void {
    this.isDropdownOpen.update((isOpen) => !isOpen);
  }

  closeDropdown(): void {
    this.isDropdownOpen.set(false);
  }

  selectParent(id: number, label: string, fullPath: string): void {
    this.selectedParentId.set(id);
    this.selectedParentLabel.set(label);
    this.selectedParentPath.set(fullPath);
    this.isDropdownOpen.set(false);
  }

  private loadParentCategories(): void {
    this.categoryService.getAllStoreCategories().subscribe({
      next: (categories) => {
        this.dropdownCategories.set(this.flattenCategories(categories, 0, 'Root'));
      },
      error: (error) => {
        console.error('Error loading categories for dropdown:', error);
      },
    });
  }

  private flattenCategories(
    categories: CategorySummaryDto[],
    depth: number,
    parentPath: string,
  ): DropdownCategory[] {
    const result: DropdownCategory[] = [];

    for (const category of categories) {
      const fullPath = `${parentPath} › ${category.name}`;
      result.push({
        id: category.id,
        name: category.name,
        depth,
        fullPath,
      });

      if (category.subcategories?.length) {
        result.push(...this.flattenCategories(category.subcategories, depth + 1, fullPath));
      }
    }

    return result;
  }
}
