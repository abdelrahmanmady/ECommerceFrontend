import { Component, signal, computed, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

interface ParentCategory {
  id: number;
  name: string;
}

interface Subcategory {
  icon: string;
  name: string;
}

interface CategoryData {
  id: number;
  name: string;
  description: string;
  parentCategoryId: number | null;
  subcategories: Subcategory[];
  createdDate: string;
  updatedDate: string;
}

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './edit.html',
  styleUrls: ['../style.css']
})
export class Edit implements OnInit {
  categoryForm: FormGroup;
  categoryId = signal<number>(0);
  
  // Mock data using signals
  currentCategory = signal<CategoryData>({
    id: 1,
    name: 'Electronics',
    description: 'All electronic devices and gadgets including computers, smartphones, tablets, and accessories',
    parentCategoryId: null,
    subcategories: [
      { icon: 'fa-mobile-alt', name: 'Smartphones' },
      { icon: 'fa-laptop', name: 'Computers' },
      { icon: 'fa-gamepad', name: 'Gaming' }
    ],
    createdDate: 'January 10, 2024',
    updatedDate: 'November 28, 2024'
  });

  parentCategories = signal<ParentCategory[]>([
    { id: 3, name: 'Fashion' },
    { id: 6, name: 'Home & Kitchen' },
    { id: 7, name: 'Sports & Fitness' },
    { id: 8, name: 'Books & Media' },
    { id: 10, name: 'Beauty & Personal Care' }
  ]);

  descriptionLength = signal(0);

  // Computed signals
  categoryPath = computed(() => {
    const parentId = this.categoryForm?.get('parentCategoryId')?.value;
    const categoryName = this.categoryForm?.get('name')?.value || 'Category';
    
    if (parentId) {
      const parent = this.parentCategories().find(p => p.id === +parentId);
      return parent ? `Root → ${parent.name} → ${categoryName}` : `Root → ${categoryName}`;
    }
    return `Root → ${categoryName}`;
  });

  subcategoryCount = computed(() => this.currentCategory().subcategories.length);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', Validators.maxLength(1000)],
      parentCategoryId: ['']
    });
  }

  ngOnInit(): void {
    // Get category ID from route
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.categoryId.set(id);
      this.loadCategory(id);
    });
  }

  loadCategory(id: number): void {
    // In a real application, you would fetch from API
    const category = this.currentCategory();
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description,
      parentCategoryId: category.parentCategoryId || ''
    });
    this.descriptionLength.set(category.description.length);
  }

  onDescriptionChange(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.descriptionLength.set(textarea.value.length);
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      console.log('Updated Category Data:', this.categoryForm.value);
      // Here you would call your API service
      alert('Category updated successfully!');
      this.router.navigate(['/admin/categories']);
    } else {
      alert('Please fill in all required fields');
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/categories']);
  }
}
