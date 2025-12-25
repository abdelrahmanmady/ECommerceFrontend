export interface ProductQueryParams { //Output : GET /api/products QueryParams
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  categoryId?: number;
  brandsIds?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'featured' | 'priceAsc' | 'priceDesc' | 'newest';
}
export interface ProductsResponse { //Input : PagedResponseDto<ProductDto>
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  items: Product[];
}
export interface Product { //Input : ProductDto
  id: number;
  thumbnailUrl: string;
  brandedName: string;
  price: number;
  categoryId: number;
  categoryBreadcrumbLinks: BreadcrumbLink[];
}

export interface BreadcrumbLink { //Input : BreadcumbLink
  id: number;
  name: string;
}

export interface ProductDetails { //Input : ProductDetailsDto
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

export interface ProductImage { // Input : ProductImageDto
  id: number;
  imageUrl: string;
  isMain: boolean;
}




