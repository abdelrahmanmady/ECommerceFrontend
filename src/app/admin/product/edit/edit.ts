import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

interface Category {
  id: number;
  name: string;
}

interface ExistingImage {
  id: number;
  url: string;
  isExisting: true;
}

interface NewImage {
  url: string;
  file: File;
  isExisting: false;
}

type ImagePreview = ExistingImage | NewImage;

interface Product {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  price: number;
  stock: number;
  images: string[];
}

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './edit.html',
  styleUrls: ['../style.css']
})
export class ProductEditComponent implements OnInit {
  // Reactive form
  productForm: FormGroup;
  
  // Product signals
  productId = signal<number>(0);
  productName = signal<string>('');

  // Mock categories data
  categories = signal<Category[]>([
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Fashion' },
    { id: 3, name: 'Clothing' },
    { id: 4, name: 'Accessories' },
    { id: 5, name: 'Home & Kitchen' },
    { id: 6, name: 'Footwear' },
    { id: 7, name: 'Sports' },
    { id: 8, name: 'Beauty' }
  ]);

  // Mock product data (simulating fetched data)
  private mockProduct = signal<Product>({
    id: 1,
    name: 'Premium Wireless Headphones',
    description: 'High-quality noise-cancelling headphones with superior sound quality and long battery life. Features include 40-hour battery, premium comfort ear cushions, and wireless Bluetooth 5.0 connectivity.',
    categoryId: 1,
    price: 299.99,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300'
    ]
  });

  // Image previews signal
  imagePreviews = signal<ImagePreview[]>([]);

  // Description tracking
  descriptionLength = signal<number>(0);
  maxDescriptionLength = 2000;

  // Computed character count display
  characterCountDisplay = computed(() => 
    `${this.descriptionLength()} / ${this.maxDescriptionLength} characters`
  );

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initialize reactive form with validators
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(this.maxDescriptionLength)]],
      categoryId: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01), Validators.max(999999)]],
      stock: ['', [Validators.required, Validators.min(0), Validators.max(999999)]]
    });

    // Subscribe to description changes
    this.productForm.get('description')?.valueChanges.subscribe(value => {
      this.descriptionLength.set(value?.length || 0);
    });
  }

  ngOnInit(): void {
    // Get product ID from route parameters
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.productId.set(parseInt(id, 10));
      this.loadProduct();
    } else {
      // Handle case where no ID is provided
      alert('Invalid product ID');
      this.router.navigate(['/admin/products']);
    }
  }

  // Load product data (simulating API call)
  private loadProduct(): void {
    const product = this.mockProduct();
    
    // Update form with product data
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      price: product.price,
      stock: product.stock
    });

    // Set product name for display
    this.productName.set(product.name);
    
    // Set description length
    this.descriptionLength.set(product.description.length);

    // Load existing images
    const existingImages: ExistingImage[] = product.images.map((url, index) => ({
      id: index + 1,
      url,
      isExisting: true as const
    }));
    
    this.imagePreviews.set(existingImages);
  }

  // Handle new file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (!input.files || input.files.length === 0) {
      return;
    }

    const files = Array.from(input.files);
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    
    files.forEach(file => {
      // Validate file size and type
      if (file.size > maxFileSize) {
        alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert(`File "${file.name}" is not a valid image.`);
        return;
      }

      // Read and preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const newImage: NewImage = {
          url,
          file,
          isExisting: false as const
        };
        
        this.imagePreviews.update(previews => [...previews, newImage]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    input.value = '';
  }

  // Remove image (existing or new)
  removeImage(index: number): void {
    const image = this.imagePreviews()[index];
    const imageType = image.isExisting ? 'existing' : 'new';
    const confirmMessage = `Are you sure you want to remove this ${imageType} image?`;
    
    if (confirm(confirmMessage)) {
      this.imagePreviews.update(previews => 
        previews.filter((_, i) => i !== index)
      );
    }
  }

  // Submit form
  onSubmit(): void {
    if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      alert('Please fill in all required fields correctly.');
      return;
    }

    const formData = {
      id: this.productId(),
      ...this.productForm.value,
      existingImages: this.imagePreviews()
        .filter((img): img is ExistingImage => img.isExisting)
        .map(img => img.url),
      newImages: this.imagePreviews()
        .filter((img): img is NewImage => !img.isExisting)
        .map(img => img.file)
    };

    console.log('Updated Product Data:', formData);
    
    // Simulate successful update
    alert('Product updated successfully!');
    this.router.navigate(['/admin/products']);
  }

  // Cancel editing
  onCancel(): void {
    const hasUnsavedChanges = this.productForm.dirty;
    
    if (hasUnsavedChanges) {
      if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
        this.router.navigate(['/admin/products']);
      }
    } else {
      this.router.navigate(['/admin/products']);
    }
  }

  // Mark all form fields as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Check if field has validation errors
  hasError(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Get error message for field
  getErrorMessage(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    
    if (!field || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return 'This field is required';
    }
    
    if (field.errors['minlength']) {
      const requiredLength = field.errors['minlength'].requiredLength;
      return `Minimum ${requiredLength} characters required`;
    }
    
    if (field.errors['maxlength']) {
      const requiredLength = field.errors['maxlength'].requiredLength;
      return `Maximum ${requiredLength} characters allowed`;
    }
    
    if (field.errors['min']) {
      return 'Value must be greater than 0';
    }
    
    if (field.errors['max']) {
      return 'Value exceeds maximum allowed';
    }

    return 'Invalid value';
  }

  // Check if image is an existing image (for template)
  isExistingImage(image: ImagePreview): boolean {
    return image.isExisting;
  }
}
