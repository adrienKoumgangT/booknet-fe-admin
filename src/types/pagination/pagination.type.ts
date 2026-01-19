export interface PaginationType<T> {
    content: T[];
    currentPage: number;
    pageSize: number;
    totalElements?: number;
    totalPages?: number;
}
