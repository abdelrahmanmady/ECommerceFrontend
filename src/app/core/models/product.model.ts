export interface BreadcrumbLink {
  id: number;
  name: string;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  isMain: boolean;
}

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

export interface Product {
  id: number;
  thumbnailUrl: string;
  brandedName: string;
  price: number;
  categoryId: number;
  categoryBreadcrumbLinks: BreadcrumbLink[];
}

export interface ProductsResponse {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  items: Product[];
}

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
