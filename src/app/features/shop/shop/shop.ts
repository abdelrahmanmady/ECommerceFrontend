import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductService } from '../../../core/services/product.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs';
import { CategoryService } from '../../../core/services/category.service';
import { RouterLink } from "@angular/router";

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

// ============================================
// DESIGN MODE: Placeholder Dummy Data
// ============================================
const DUMMY_PRODUCTS = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 149.99,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    categoryName: 'Electronics',
    rating: 4.5,
    new: true,
    sale: 0,
  },
  {
    id: '2',
    name: 'Leather Crossbody Bag',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    categoryName: 'Fashion',
    rating: 4.8,
    new: false,
    sale: 15,
    delPrice: 105.99,
  },
  {
    id: '3',
    name: 'Smart Fitness Watch',
    price: 199.99,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    categoryName: 'Electronics',
    rating: 4.2,
    new: true,
    sale: 0,
  },
  {
    id: '4',
    name: 'Minimalist Desk Lamp',
    price: 59.99,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
    categoryName: 'Home & Living',
    rating: 4.6,
    new: false,
    sale: 20,
    delPrice: 74.99,
  },
  {
    id: '5',
    name: 'Organic Cotton T-Shirt',
    price: 34.99,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    categoryName: 'Fashion',
    rating: 4.4,
    new: false,
    sale: 0,
  },
  {
    id: '6',
    name: 'Stainless Steel Water Bottle',
    price: 24.99,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    categoryName: 'Sports',
    rating: 4.7,
    new: true,
    sale: 10,
    delPrice: 27.99,
  },
  {
    id: '7',
    name: 'Bluetooth Portable Speaker',
    price: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    categoryName: 'Electronics',
    rating: 4.3,
    new: false,
    sale: 0,
  },
  {
    id: '8',
    name: 'Ceramic Plant Pot Set',
    price: 45.99,
    imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400',
    categoryName: 'Home & Living',
    rating: 4.9,
    new: true,
    sale: 0,
  },
  {
    id: '9',
    name: 'Running Sneakers',
    price: 129.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    categoryName: 'Sports',
    rating: 4.6,
    new: false,
    sale: 25,
    delPrice: 159.99,
  },
];

const DUMMY_CATEGORIES = [
  {
    id: 1,
    name: 'Electronics',
    description: 'All electronic gadgets',
    hierarchyPath: 'Electronics',
    parentId: null,
    children: [
      {
        id: 2,
        name: 'Computers',
        description: 'Desktops and Laptops',
        hierarchyPath: 'Electronics\\Computers',
        parentId: 1,
        children: [
          {
            id: 3,
            name: 'Laptops',
            description: 'Portable computers',
            hierarchyPath: 'Electronics\\Computers\\Laptops',
            parentId: 2,
            children: []
          },
          {
            id: 4,
            name: 'Desktops',
            description: 'Workstations',
            hierarchyPath: 'Electronics\\Computers\\Desktops',
            parentId: 2,
            children: []
          }
        ]
      },
      {
        id: 5,
        name: 'Smartphones',
        description: 'Mobile phones',
        hierarchyPath: 'Electronics\\Smartphones',
        parentId: 1,
        children: []
      },
      {
        id: 6,
        name: 'Audio',
        description: 'Speakers and headphones',
        hierarchyPath: 'Electronics\\Audio',
        parentId: 1,
        children: []
      }
    ]
  },
  {
    id: 7,
    name: 'Fashion',
    description: 'Clothing and Apparel',
    hierarchyPath: 'Fashion',
    parentId: null,
    children: [
      {
        id: 8,
        name: 'Men',
        description: "Men's clothing",
        hierarchyPath: 'Fashion\\Men',
        parentId: 7,
        children: []
      },
      {
        id: 9,
        name: 'Women',
        description: "Women's clothing",
        hierarchyPath: 'Fashion\\Women',
        parentId: 7,
        children: []
      },
      {
        id: 10,
        name: 'Accessories',
        description: 'Bags, belts, etc.',
        hierarchyPath: 'Fashion\\Accessories',
        parentId: 7,
        children: []
      }
    ]
  },
  {
    id: 11,
    name: 'Home & Living',
    description: 'Furniture and decor',
    hierarchyPath: 'Home & Living',
    parentId: null,
    children: []
  },
  {
    id: 12,
    name: 'Sports',
    description: 'Sports and fitness',
    hierarchyPath: 'Sports',
    parentId: null,
    children: []
  }
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
// ============================================

@Component({
  selector: 'app-shop',
  imports: [FormsModule, CommonModule, ProductCard, NgxPaginationModule, RouterLink],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop {
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  allProducts = signal<any[]>([]);
  allCategories = signal<any[]>([]);
  allBrands = signal<any[]>([]);
  parentCategoryId = signal<any[]>([]);
  selectedCategory = signal<string | null>(null);
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

  // Active Filters System
  selectedSort = signal('Sort By');
  selectedSortKey = signal<string | null>(null);  // Sort key for API (asc, dsc, rating, new)
  selectedBrands = signal<string[]>([]); // Multi-select brands (IDs) - COMMITTED
  pendingSelectedBrands = signal<string[]>([]); // Multi-select brands (IDs) - PENDING
  brandSearch = signal(''); // Local search for brand list
  // Signal to track applied price range for reactivity
  appliedPriceRange = signal({ min: 0, max: 5000 });

  filteredBrands = computed(() => {
    const search = this.brandSearch().toLowerCase();
    if (!search) return this.allBrands();
    return this.allBrands().filter(b => b.name.toLowerCase().includes(search));
  });

  // Computed active filters for display
  activeFilters = computed(() => {
    const filters: { type: string; label: string; value: string; id?: string }[] = [];

    // Search filter
    if (this.search() && this.search().trim() !== '') {
      filters.push({ type: 'search', label: 'Search', value: this.search() });
    }

    // Category filter
    if (this.selectedCategory()) {
      const cat = this.findCategoryById(this.selectedCategory()!);
      if (cat) {
        filters.push({ type: 'category', label: 'Category', value: cat.name });
      }
    }

    // Price range filter (only if not full range)
    const price = this.appliedPriceRange();
    if (price.min > 0 || price.max < 5000) {
      const maxDisplay = price.max >= 5000 ? '5000+' : price.max.toString();
      filters.push({ type: 'price', label: 'Price', value: `${price.min}-${maxDisplay} EGP` });
    }

    // Brand filter (multi-select)
    this.selectedBrands().forEach(brandId => {
      const brand = this.allBrands().find(b => b.id === brandId);
      if (brand) {
        // Use brandId as value to uniquely identify for removal
        filters.push({ type: 'brand', label: 'Brand', value: brand.name, id: brandId });
      }
    });

    return filters;
  });

  search$ = toObservable(this.search).pipe(debounceTime(3000), distinctUntilChanged());

  // API already returns nested structure, just use it directly
  categoryTree = computed(() => this.allCategories());

  // Recursively check if any descendant is selected
  hasChildSelected(category: any): boolean {
    const selected = this.selectedCategory();
    if (!selected || !category.children?.length) return false;

    const checkChildren = (children: any[]): boolean => {
      for (const child of children) {
        if (child.id === selected) return true;
        if (child.children?.length && checkChildren(child.children)) return true;
      }
      return false;
    };

    return checkChildren(category.children);
  }

  constructor() {
    // When search changes, reload products
    this.search$.subscribe(() => {
      this.loadProducts();
    });
    this.loadProducts();
    this.loadCategories();
    this.loadBrands();
  }

  loadProducts() {
    // DESIGN MODE: Using placeholder data instead of API
    // In production, API handles filtering/sorting based on query params
    this.allProducts.set(DUMMY_PRODUCTS);
    this.totalPages.set(DUMMY_PRODUCTS.length);

    /* ORIGINAL API CALL - Uncomment when ready for integration
    this.productService
      .getAllProducts({
        pageIndex: this.pageIndex(),
        pageSize: this.pageSize,
        minPrice: this.appliedPriceRange().min > 0 ? this.appliedPriceRange().min : null,
        maxPrice: this.appliedPriceRange().max < 5000 ? this.appliedPriceRange().max : null,
        search: this.search() || null,
        categoryId: this.selectedCategory() || null,
        brandIds: this.selectedBrands().length ? this.selectedBrands().join(',') : null,
        sortBy: this.selectedSortKey() || null,
      })
      .subscribe((data) => {
        console.log("products data", data);
        this.allProducts.set(data.items);
        this.totalPages.set(data.totalCount);
      });
    */
  }

  loadCategories() {
    // DESIGN MODE: Using placeholder data instead of API
    this.allCategories.set(DUMMY_CATEGORIES);

    /* ORIGINAL API CALL - Uncomment when ready for integration
    this.categoryService.getAllCategories().subscribe((data) => {
      this.allCategories.set(data);

      console.log("sssssss", this.allCategories());
    });
    */
  }

  loadBrands() {
    // DESIGN MODE: Using placeholder data instead of API
    this.allBrands.set(DUMMY_BRANDS);
  }

  setView(type: 'grid' | 'list') {
    this.viewType.set(type);
  }

  selectCategory(cat: any) {
    // Toggle: if already selected, deselect; otherwise select
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
  updateSlider() {
    if (this.minValue > this.maxValue) {
      this.minValue = this.maxValue;
    }
    // Convert values to % (max is 5000)
    this.minPercent = (this.minValue / 5000) * 100;
    this.maxPercent = (this.maxValue / 5000) * 100;
  }

  // NOTE: sortProducts and filterProductsPrice removed - API handles sorting/filtering
  // These methods are no longer needed as loadProducts() sends all filter state to API
  //filter products by price slider - just updates state and calls loadProducts
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

    // Reset slider to default values
    this.minValue = 0;
    this.maxValue = 5000;
    this.minPercent = 0;
    this.maxPercent = 100;
    this.appliedPriceRange.set({ min: 0, max: 5000 });

    this.loadProducts();
  }

  // Remove individual filter by type
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
        this.pendingSelectedBrands.set(newBrands); // Sync pending
        break;
    }
    this.loadProducts();
  }

  // Toggle brand selection (pending state)
  toggleBrand(brandId: string) {
    const current = this.pendingSelectedBrands();
    if (current.includes(brandId)) {
      this.pendingSelectedBrands.set(current.filter(id => id !== brandId));
    } else {
      this.pendingSelectedBrands.set([...current, brandId]);
    }
  }

  // Apply pending brand filters
  applyBrandFilter() {
    this.selectedBrands.set(this.pendingSelectedBrands());
    this.pageIndex.set(1);
    this.loadProducts();
  }

  // Helper to find category by ID
  findCategoryById(id: string): any {
    const searchInChildren = (categories: any[]): any => {
      for (const cat of categories) {
        if (cat.id === id || cat.id.toString() === id) return cat;
        if (cat.children?.length) {
          const found = searchInChildren(cat.children);
          if (found) return found;
        }
      }
      return null;
    };
    return searchInChildren(this.allCategories());
  }

  // Set sort option - just updates state and calls loadProducts
  setSort(sortKey: string, label: string) {
    this.selectedSort.set(label);
    this.selectedSortKey.set(sortKey === 'default' ? null : sortKey);
    this.pageIndex.set(1);
    this.loadProducts();
  }


}
