import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

interface ParentCategory {
  id: number;
  name: string;
}

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './add.html',
  styleUrls: ['../style.css']
})
export class Add {
  categoryForm: FormGroup;
  
  // Mock parent categories using signal
  parentCategories = signal<ParentCategory[]>([
    { id: 1, name: 'Electronics' },
    { id: 3, name: 'Fashion' },
    { id: 6, name: 'Home & Kitchen' },
    { id: 7, name: 'Sports & Fitness' },
    { id: 8, name: 'Books & Media' },
    { id: 10, name: 'Beauty & Personal Care' }
  ]);

  descriptionLength = signal(0);
  
  // Computed signal for category path preview
  categoryPath = computed(() => {
    const parentId = this.categoryForm?.get('parentCategoryId')?.value;
    const categoryName = this.categoryForm?.get('name')?.value || 'Your New Category';
    
    if (parentId) {
      const parent = this.parentCategories().find(p => p.id === +parentId);
      return parent ? `Root → ${parent.name} → ${categoryName}` : `Root → ${categoryName}`;
    }
    return `Root → ${categoryName}`;
  });

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', Validators.maxLength(1000)],
      parentCategoryId: ['']
    });

    // Track description length using effect
    effect(() => {
      const desc = this.categoryForm.get('description')?.value || '';
      this.descriptionLength.set(desc.length);
    });
  }

  onDescriptionChange(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.descriptionLength.set(textarea.value.length);
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      console.log('Category Data:', this.categoryForm.value);
      // Here you would call your API service
      alert('Category added successfully!');
      this.router.navigate(['/admin/categories']);
    } else {
      alert('Please fill in all required fields');
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/categories']);
  }
}
