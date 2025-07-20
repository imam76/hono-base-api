export type SuccessResponse<T> = {
  data: T;
  success: true;
  message?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  success: true;
  message?: string;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    nextPage?: number | null;
    previousPage?: number | null;
  };
};

export type ErrorResponse = {
  error: string;
  success: false;
  details?: string;
  code: "VALIDATION_ERROR" | "NOT_FOUND" | "SERVER_ERROR";
};
