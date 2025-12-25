
export interface PagedResponse<T> { //Input : PagedResponseDto<T>
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    items: T[];
}