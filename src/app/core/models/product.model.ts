/**
 * Link in the category breadcrumb navigation
 */
export interface BreadcrumbLink {
  id: number;
  name: string;
}

/**
 * Represents a product image
 */
export interface ProductImage {
  id: number;
  imageUrl: string;
  isMain: boolean;
}

/**
 * Detailed product information for the product details page
 */
export interface ProductDetails {
  id: number;
  images: ProductImage[];
  name: string;
  brandId: number;
  brandName: string;
  categoryId: number;
  categoryName: string;
  price: number;
  stockQuantity: number;
  description: string;
}

/**
 * Product summary for listings and cards
 */
export interface Product {
  id: number;
  thumbnailUrl: string;
  brandedName: string;
  price: number;
  categoryId: number;
  categoryBreadcrumbLinks: BreadcrumbLink[];
}

/**
 * Paginated products response from the API
 */
export interface ProductsResponse {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  items: Product[];
}

/**
 * Query parameters for filtering and paginating products
 */
export interface ProductQueryParams {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  categoryId?: number;
  brandsIds?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'featured' | 'priceAsc' | 'priceDesc' | 'newest';
}
