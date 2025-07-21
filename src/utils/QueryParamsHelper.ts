import type { Context } from "hono";

export interface QueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  searchBy?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, string | number | boolean>;
}

export class QueryParamsHelper {
  static parseFromContext(c: Context): QueryOptions {
    const params = new URL(c.req.url).searchParams;

    const page = Math.max(parseInt(params.get("page") || "1"), 1);
    const limit = Math.min(parseInt(params.get("limit") || "10"), 100);
    const search = params.get("search") || undefined;
    const searchBy = params.get("searchBy") || undefined;
    const sortBy = params.get("sortBy") || undefined;
    const sortOrder = params.get("sortOrder") === "desc" ? "desc" : "asc";

    // Parse filters dengan type conversion
    const filters: Record<string, string | number | boolean> = {};
    const reserved = [
      "page",
      "limit",
      "search",
      "searchBy",
      "sortBy",
      "sortOrder",
    ];

    // Iterate through all params and convert types
    for (const [key, value] of params.entries()) {
      if (!reserved.includes(key) && value) {
        // Convert boolean dan number
        if (value === "true") filters[key] = true;
        else if (value === "false") filters[key] = false;
        else if (!isNaN(Number(value))) filters[key] = Number(value);
        else filters[key] = value;
      }
    }

    return {
      page,
      limit,
      search,
      searchBy,
      sortBy,
      sortOrder,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
    };
  }
}
