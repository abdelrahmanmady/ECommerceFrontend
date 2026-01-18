import { AdminProductSummaryDto, BreadcrumbLink } from './product.model';

export interface AdminCategorySummaryDto {
  id: number;
  name: string;
  description?: string;
  hierarchyPath?: string;
  isLeaf: boolean;
  childrenCount: number;
  created: string;
}

export interface AdminCategoryDetailsResponse {
  id: number;
  isLeaf: boolean;
  hierarchyBreadcrumb: BreadcrumbLink[];
  name: string;
  description?: string;
  parentId?: number;
  parentName: string;
  created: string;
  updated?: string;
  subcategories: AdminCategorySummaryDto[];
  productsCount: number;
  recentProducts: AdminProductSummaryDto[];
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parentId?: number;
}

export interface UpdateCategoryRequest {
  name: string;
  description?: string;
  parentId?: number;
}

export interface CategorySummaryDto {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  subcategories: CategorySummaryDto[];
}

export interface AdminCategoryQueryParams {
  type?: 'node' | 'leaf';
  search?: string;
  pageIndex?: number;
  pageSize?: number;
}
