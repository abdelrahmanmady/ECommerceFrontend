export interface AdminProductSummaryDto {
  id: number;
  thumbnailUrl: string;
  name: string;
  description?: string;
  categoryName: string;
  brandName: string;
  price: number;
  inStock: boolean;
  isFeatured: boolean;
  created: string;
  updated: string;
}

export interface AdminProductDetailsResponse {
  id: number;
  name: string;
  description?: string;
  categoryId: number;
  brandId: number;
  price: number;
  stockQuantity: number;
  isFeatured: boolean;
  images: ProductImageDto[];
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  categoryId: number;
  brandId: number;
  price: number;
  stockQuantity: number;
  isFeatured: boolean;
}

export interface UpdateProductRequest {
  name: string;
  description?: string;
  categoryId: number;
  brandId: number;
  price: number;
  stockQuantity: number;
  isFeatured: boolean;
}

export interface ProductSummaryDto {
  id: number;
  thumbnailUrl: string;
  brandedName: string;
  price: number;
  categoryId: number;
  categoryBreadcrumbLinks: BreadcrumbLink[];
}

export interface ProductDetailsResponse {
  id: number;
  images: ProductImageDto[];
  name: string;
  brandId: number;
  brandName: string;
  price: number;
  stockQuantity: number;
  overviewHeadline?: string;
  overviewDescription: string;
  compositionText: string;
  isSustainable: boolean;
  careInstructions: ('machineWashCold' | 'machineWashWarm' | 'handWash' | 'doNotWash'
    | 'doNotBleach' | 'bleachAny' | 'tumbleDryLow' | 'tumbleDryHigh'
    | 'doNotTumbleDry' | 'dryFlat' | 'ironLow' | 'ironMedium' | 'ironHigh'
    | 'doNotIron' | 'dryCleanOnly' | 'doNotDryClean')[];
  features: string[];
  attributes: { key: string, value: string }[];
}

export interface BreadcrumbLink {
  id: number;
  name: string;
}

export interface ProductImageDto {
  id: number;
  imageUrl: string;
  isMain: boolean;
}

export interface AdminProductQueryParams {
  status?: string;
  search?: string;
  pageIndex?: number;
  pageSize?: number;
}

export interface ProductQueryParams {
  brandsIds?: number[];
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: 'featured' | 'priceAsc' | 'priceDesc' | 'newest';
  pageIndex?: number;
  pageSize?: number;
}

export type Product = AdminProductSummaryDto;

export type ProductDetails = ProductDetailsResponse;
