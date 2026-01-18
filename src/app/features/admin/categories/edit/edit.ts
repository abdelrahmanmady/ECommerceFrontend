import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoryService } from '../../../../core/services/category.service';

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
  isNodeCategory = true;
  showMoveModal = false;

  // Tree Dropdown State
  isDropdownOpen = false;
  selectedParentId: string | null = null;
  selectedParentName: string | null = null;

  // ==================== LIFECYCLE ====================

  ngOnInit(): void {
    const categoryId = Number(this.route.snapshot.paramMap.get('id'));
    if (categoryId) {
      this.categoryService.getAdminCategoryDetails(categoryId).subscribe({
        next: (response) => {
          console.log('Category Details API Response:', response);
        },
        error: (error) => {
          console.error('Error loading category details:', error);
        },
      });
    }
  }

  // ==================== HELPER METHODS ====================

  toggleCategoryType(): void {
    this.isNodeCategory = !this.isNodeCategory;
  }

  openMoveModal(): void {
    this.showMoveModal = true;
    this.resetMoveModal();
  }

  closeMoveModal(): void {
    this.showMoveModal = false;
    this.resetMoveModal();
  }

  // ==================== TREE DROPDOWN METHODS ====================

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectParent(id: string, name: string): void {
    this.selectedParentId = id;
    this.selectedParentName = name;
    this.isDropdownOpen = false;
  }

  getSelectedParentName(): string {
    return this.selectedParentName || 'Choose a parent category...';
  }

  private resetMoveModal(): void {
    this.isDropdownOpen = false;
    this.selectedParentId = null;
    this.selectedParentName = null;
  }
}
