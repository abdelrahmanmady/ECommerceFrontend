import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductService } from '../../../core/services/product.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import { RouterLink, ActivatedRoute } from "@angular/router";

export interface IProduct {
  id: number;
  thumbnailUrl: string;
  categoryBreadcrumb: string;
  brandedName: string;
  price: number;
  breadcrumbLinks?: { name: string; id: number }[];
}

const DUMMY_PRODUCTS = [
  {
    id: 1,
    brandedName: 'Sony - Premium Wireless Headphones',
    price: 149.99,
    thumbnailUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    categoryBreadcrumb: 'Electronics \\ Audio \\ Headphones',
    breadcrumbLinks: [
      { name: 'Electronics', id: 1 },
      { name: 'Audio', id: 11 },
      { name: 'Headphones', id: 111 }
    ]
  },
  {
    id: 2,
    brandedName: 'Coach - Leather Crossbody Bag',
    price: 89.99,
    thumbnailUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    categoryBreadcrumb: 'Fashion \\ Accessories \\ Bags',
    breadcrumbLinks: [
      { name: 'Fashion', id: 2 },
      { name: 'Accessories', id: 21 },
      { name: 'Bags', id: 211 }
    ]
  },
  {
    id: 3,
    brandedName: 'Fitbit - Smart Fitness Watch',
    price: 199.99,
    thumbnailUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    categoryBreadcrumb: 'Electronics \\ Wearables \\ Watches',
    breadcrumbLinks: [
      { name: 'Electronics', id: 1 },
      { name: 'Wearables', id: 12 },
      { name: 'Watches', id: 121 }
    ]
  },
  {
    id: 4,
    brandedName: 'Ikea - Minimalist Desk Lamp',
    price: 59.99,
    thumbnailUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
    categoryBreadcrumb: 'Home & Living \\ Lighting \\ Lamps',
    breadcrumbLinks: [
      { name: 'Home & Living', id: 3 },
      { name: 'Lighting', id: 31 },
      { name: 'Lamps', id: 311 }
    ]
  },
  {
    id: 5,
    brandedName: 'H&M - Organic Cotton T-Shirt',
    price: 34.99,
    thumbnailUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    categoryBreadcrumb: 'Fashion \\ Clothing \\ Tops',
    breadcrumbLinks: [
      { name: 'Fashion', id: 2 },
      { name: 'Clothing', id: 22 },
      { name: 'Tops', id: 221 }
    ]
  },
  {
    id: 6,
    brandedName: 'Hydro Flask - Stainless Steel Water Bottle',
    price: 24.99,
    thumbnailUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    categoryBreadcrumb: 'Sports \\ Accessories \\ Hydration',
    breadcrumbLinks: [
      { name: 'Sports', id: 4 },
      { name: 'Accessories', id: 41 },
      { name: 'Hydration', id: 411 }
    ]
  },
  {
    id: 7,
    brandedName: 'JBL - Bluetooth Portable Speaker',
    price: 79.99,
    thumbnailUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    categoryBreadcrumb: 'Electronics \\ Audio \\ Speakers',
    breadcrumbLinks: [
      { name: 'Electronics', id: 1 },
      { name: 'Audio', id: 11 },
      { name: 'Speakers', id: 112 }
    ]
  },
  {
    id: 8,
    brandedName: 'West Elm - Ceramic Plant Pot Set',
    price: 45.99,
    thumbnailUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400',
    categoryBreadcrumb: 'Home & Living \\ Decor \\ Pots',
    breadcrumbLinks: [
      { name: 'Home & Living', id: 3 },
      { name: 'Decor', id: 32 },
      { name: 'Pots', id: 321 }
    ]
  },
  {
    id: 9,
    brandedName: 'Nike - Running Sneakers',
    price: 129.99,
    thumbnailUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    categoryBreadcrumb: 'Sports \\ Footwear \\ Running',
    breadcrumbLinks: [
      { name: 'Sports', id: 4 },
      { name: 'Footwear', id: 42 },
      { name: 'Running', id: 421 }
    ]
  },
];

const DUMMY_BRANDS = [
  { id: '1', name: 'Nike', count: 24 },
  { id: '2', name: 'Adidas', count: 18 },
  { id: '3', name: 'Puma', count: 12 },
  { id: '4', name: 'Reebok', count: 9 },
  { id: '5', name: 'Under Armour', count: 7 },
  { id: '6', name: 'New Balance', count: 6 },
  { id: '7', name: 'Converse', count: 5 },
  { id: '8', name: 'Vans', count: 4 },
];

@Component({
  selector: 'app-shop',
  imports: [FormsModule, CommonModule, ProductCard, NgxPaginationModule, RouterLink],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop {
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  activatedRoute = inject(ActivatedRoute);
  allProducts = signal<any[]>([]);
  allCategories = signal<Category[]>([]);
  allBrands = signal<any[]>([]);
  parentCategoryId = signal<any[]>([]);
  selectedCategory = signal<number | null>(null);
  minValue: number = 0;
  maxValue: number = 5000;
  minPercent: number = 0;
  maxPercent: number = 100;
  viewType = signal<'grid' | 'list'>('grid');
  pageIndex = signal(1);
  pageSize = 10;
  totalPages = signal(0);
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  search = signal('');
  categorySort = signal('');


  selectedSort = signal('Sort By');
  selectedSortKey = signal<string | null>(null);
  selectedBrands = signal<string[]>([]);
  pendingSelectedBrands = signal<string[]>([]);
  brandSearch = signal('');
  appliedPriceRange = signal({ min: 0, max: 5000 });

  filteredBrands = computed(() => {
    const search = this.brandSearch().toLowerCase();
    if (!search) return this.allBrands();
    return this.allBrands().filter(b => b.name.toLowerCase().includes(search));
  });


  activeFilters = computed(() => {
    const filters: { type: string; label: string; value: string; id?: string }[] = [];

    if (this.search() && this.search().trim() !== '') {
      filters.push({ type: 'search', label: 'Search', value: this.search() });
    }

    if (this.selectedCategory()) {
      const cat = this.findCategoryById(this.selectedCategory()!);
      if (cat) {
        filters.push({ type: 'category', label: 'Category', value: cat.name });
      }
    }

    const price = this.appliedPriceRange();
    if (price.min > 0 || price.max < 5000) {
      const maxDisplay = price.max >= 5000 ? '5000+' : price.max.toString();
      filters.push({ type: 'price', label: 'Price', value: `${price.min}-${maxDisplay} EGP` });
    }

    this.selectedBrands().forEach(brandId => {
      const brand = this.allBrands().find(b => b.id === brandId);
      if (brand) {
        filters.push({ type: 'brand', label: 'Brand', value: brand.name, id: brandId });
      }
    });

    return filters;
  });

  search$ = toObservable(this.search).pipe(debounceTime(3000), distinctUntilChanged());


  categoryTree = computed(() => this.allCategories());


  hasChildSelected(category: Category): boolean {
    const selected = this.selectedCategory();
    if (!selected || category.subcategories.length === 0) return false;

    const checkChildren = (subcategories: Category[]): boolean => {
      for (const child of subcategories) {
        if (child.id === selected) return true;
        if (child.subcategories.length > 0 && checkChildren(child.subcategories)) return true;
      }
      return false;
    };

    return checkChildren(category.subcategories);
  }

  constructor() {
    this.activatedRoute.queryParams.subscribe(params => {
      const catId = params['categoryId'];
      if (catId) {
        this.selectedCategory.set(Number(catId));
        this.pageIndex.set(1);
        this.loadProducts();
      }
    });

    this.search$.subscribe(() => {
      this.loadProducts();
    });
    this.loadProducts();
    this.loadCategories();
    this.loadBrands();
  }

  loadProducts() {
    this.allProducts.set(DUMMY_PRODUCTS);
    this.totalPages.set(DUMMY_PRODUCTS.length);
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.allCategories.set(categories);
      },
      error: () => {
        this.allCategories.set([]);
      }
    });
  }

  loadBrands() {
    this.allBrands.set(DUMMY_BRANDS);
  }

  setView(type: 'grid' | 'list') {
    this.viewType.set(type);
  }

  selectCategory(cat: any) {
    if (this.selectedCategory() === cat.id) {
      this.selectedCategory.set(null);
    } else {
      this.selectedCategory.set(cat.id);
      this.pageIndex.set(1);
    }
    this.loadProducts();
  }

  sortByCategory(cat: any) {
    this.selectCategory(cat);
  }
  updateMinSlider() {
    if (this.minValue > this.maxValue) {
      this.maxValue = this.minValue;
    }
    this.updateSliderPercents();
  }

  updateMaxSlider() {
    if (this.maxValue < this.minValue) {
      this.minValue = this.maxValue;
    }
    this.updateSliderPercents();
  }

  updateSliderPercents() {
    this.minPercent = (this.minValue / 5000) * 100;
    this.maxPercent = (this.maxValue / 5000) * 100;
  }

  priceFilter() {
    this.pageIndex.set(1);
    this.appliedPriceRange.set({ min: this.minValue, max: this.maxValue });
    this.loadProducts();
  }

  clearAllFilters() {
    this.minPrice = undefined;
    this.maxPrice = undefined;
    this.search.set('');
    this.selectedCategory.set(null);
    this.selectedBrands.set([]);
    this.pendingSelectedBrands.set([]);

    this.minValue = 0;
    this.maxValue = 5000;
    this.minPercent = 0;
    this.maxPercent = 100;
    this.appliedPriceRange.set({ min: 0, max: 5000 });

    this.loadProducts();
  }

  removeFilter(type: string, id?: string) {
    switch (type) {
      case 'search':
        this.search.set('');
        break;
      case 'category':
        this.selectedCategory.set(null);
        break;
      case 'price':
        this.minValue = 0;
        this.maxValue = 5000;
        this.minPercent = 0;
        this.maxPercent = 100;
        this.appliedPriceRange.set({ min: 0, max: 5000 });
        break;
      case 'brand':
        let newBrands: string[] = [];
        if (id) {
          newBrands = this.selectedBrands().filter(b => b !== id);
        }
        this.selectedBrands.set(newBrands);
        this.pendingSelectedBrands.set(newBrands);
        break;
    }
    this.loadProducts();
  }

  toggleBrand(brandId: string) {
    const current = this.pendingSelectedBrands();
    if (current.includes(brandId)) {
      this.pendingSelectedBrands.set(current.filter(id => id !== brandId));
    } else {
      this.pendingSelectedBrands.set([...current, brandId]);
    }
  }

  applyBrandFilter() {
    this.selectedBrands.set(this.pendingSelectedBrands());
    this.pageIndex.set(1);
    this.loadProducts();
  }

  findCategoryById(id: number): Category | null {
    const searchInCategories = (categories: Category[]): Category | null => {
      for (const cat of categories) {
        if (cat.id === id) return cat;
        if (cat.subcategories?.length) {
          const found = searchInCategories(cat.subcategories);
          if (found) return found;
        }
      }
      return null;
    };
    return searchInCategories(this.allCategories());
  }

  setSort(sortKey: string, label: string) {
    this.selectedSort.set(label);
    this.selectedSortKey.set(sortKey === 'default' ? null : sortKey);
    this.pageIndex.set(1);
    this.loadProducts();
  }


}
