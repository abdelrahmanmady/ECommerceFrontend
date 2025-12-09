import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, effect, inject, Input, input, signal, Signal } from '@angular/core';
import { IProduct } from '../../../features/shop/shop/shop';
import { CategoryService } from '../../../serices/category-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, NgClass, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  productData = input.required<any>();
  viewType = input.required<string>();
  categoryService = inject(CategoryService);
  categoryName = signal<string>('');
  router = inject(Router);

  constructor() {
    effect(() => {
      this.loadCategoryName();
    });
  }
  loadCategoryName() {
    const categoryId = this.productData().categoryId;
    if (!categoryId) return;

    this.categoryService.getCategoryById(categoryId).subscribe({
      next: (res) => this.categoryName.set(res.name),
      error: (err) => console.log(err),
    });
  }
}
