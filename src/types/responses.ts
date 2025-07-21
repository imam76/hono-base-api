export type SuccessResponse<T> = {
  data: T;
  success: true;
  message?: string;
};

export type SuccessPaginatedResponse<T> = {
  success: true;
  message?: string;
} & T;

export type ErrorResponse = {
  error: string;
  success: false;
  details?: string;
  code:
    | "VALIDATION_ERROR"
    | "NOT_FOUND"
    | "SERVER_ERROR"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "CONFLICT"
    | "BAD_REQUEST"
    | "INTERNAL_ERROR";
};
