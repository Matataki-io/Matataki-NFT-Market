export interface GeneralResponse<T = Record<string, any>> {
  code: number;
  data: T;
  message?: string;
}

export interface PaginationProps {
  page: number;
  limit: number;
}
