import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductService } from '../../../core/services/product-service';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs';
import { CategoryService } from '../../../core/services/category-service';

export interface IProduct {
  new?: boolean;
  sale?: number;
  image: string;
  category: string;
  title: string;
  rating: number;
  price: number;
  delPrice?: number;
}
@Component({
  selector: 'app-shop',
  imports: [FormsModule, CommonModule, ProductCard, NgxPaginationModule],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop {
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  allProducts = signal<any[]>([]);
  allCategories = signal<any[]>([]);
  parentCategoryId = signal<any[]>([]);
  minValue: number = 0;
  maxValue: number = 500;
  minPercent: number = 0;
  maxPercent: number = 50;
  viewType = signal<'grid' | 'list'>('grid');
  pageNum = signal(1);
  pageSize = 2;
  totalPages = signal(0);
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  search = signal('');
  activeFilters = signal<string[]>([]);
  categorySort = signal('');

  search$ = toObservable(this.search).pipe(debounceTime(3000), distinctUntilChanged());

  categoryTree = computed(() => {
    const cats = this.allCategories();
    return cats
      .filter((c) => c.parentCategoryId === null)
      .map((parent) => ({
        ...parent,
        children: cats.filter((c) => c.parentCategoryId === parent.id),
      }));
  });

  constructor() {
    this.search$.subscribe((search) => {
      this.loadProducts(this.pageNum(), this.pageSize,undefined, undefined, search);
    });
    this.activeFilters.set([]);
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(pageNum?: number, pageSize?: number,minPrice?: number, maxPrice?: number, search?: string, categoryId?: string) {
    this.productService
      .getAllProducts({
        pageNum: pageNum ?? this.pageNum(),
        pageSize: pageSize ?? this.pageSize,
        minPrice: minPrice ?? null,
        maxPrice: maxPrice ?? null,
        search: search ?? null,
        categoryId: categoryId ?? null,
      })
      .subscribe((data) => {
        this.allProducts.set(data.products);
        this.totalPages.set(data.totalCount);
      });
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe((data) => {
      this.allCategories.set(data);
    });
  }

  setView(type: 'grid' | 'list') {
    this.viewType.set(type);
  }

  sortByCategory(cat: any) {
    this.pageNum.set(1);
    this.activeFilters.set([cat.name]);
    this.loadProducts(undefined, undefined, undefined, cat.name);
  }
  updateSlider() {
    if (this.minValue > this.maxValue) {
      this.minValue = this.maxValue;
    }
    // Convert values to %
    this.minPercent = (this.minValue / 1000) * 100;
    this.maxPercent = (this.maxValue / 1000) * 100;
  }

  //sort products by price asc or dsc
  sortProducts(event: any) {
    const value = event.target.value;
    this.pageNum.set(1);
    this.allProducts.set(
      [...this.allProducts()].sort((a, b) => {
        if (value === 'asc') return a.price - b.price;
        if (value === 'dsc') return b.price - a.price;
        return 0;
      })
    );
    this.activeFilters.set([value]);
  }
  //filter products by price as under $25, $25 to $50, $50 to $100, $100 to $200
  filterProductsPrice(event: any) {
    const value = event.target.value;
    this.pageNum.set(1);
    switch (value) {
      case 'Under $25':
        this.minPrice = 0;
        this.maxPrice = 25;
        break;
      case '$25 to $50':
        this.minPrice = 25;
        this.maxPrice = 50;
        break;
      case '$50 to $100':
        this.minPrice = 50;
        this.maxPrice = 100;
        break;
      case '$100 to $200':
        this.minPrice = 100;
        this.maxPrice = 200;
        break;
      case '$200':
        this.minPrice = 200;
        this.maxPrice = undefined;
        break;
      default:
        this.minPrice = undefined;
        this.maxPrice = undefined;
    }
    this.activeFilters.set([value]);
    this.loadProducts(this.minPrice!, this.maxPrice!);
  }
  //filter products by price slider
  priceFilter() {
    this.allProducts.set(
      this.allProducts().filter(
        (p) => Number(p.price) >= this.minValue && Number(p.price) <= this.maxValue
      )
    );
  }

  clearAllFilters() {
    this.activeFilters.set([]);
    this.minPrice = undefined;
    this.maxPrice = undefined;
    this.search.set('');

    // Reset slider to default values
    this.minValue = 0;
    this.maxValue = 500;
    this.minPercent = 0;
    this.maxPercent = 50;

    // Reset sorting dropdown (optional, if using a select element)
    const sortSelect = document.getElementById('sortBy') as HTMLSelectElement;
    if (sortSelect) sortSelect.value = 'default';

    const priceRange = document.getElementById('priceRange') as HTMLSelectElement;
    if (priceRange) priceRange.value = 'default';

    this.loadProducts();
  }
}
