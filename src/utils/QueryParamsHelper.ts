/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Context } from "hono";
import type { QueryOptions } from "./QueryBuilder";

export class QueryParamsHelper {
  static parseFromContext(c: Context): QueryOptions {
    const page = Number(c.req.query("page")) || 1;
    const limit = Math.min(Number(c.req.query("limit")) || 10, 100);
    const sortBy = c.req.query("sortBy");
    const sortOrder = c.req.query("sortOrder") === "desc" ? "desc" : "asc";
    const search = c.req.query("search");
    const searchBy = c.req.query("searchBy");

    const filters: Record<string, any> = {};
    const filterQueries = c.req.queries("filter") || [];

    for (const filterQuery of filterQueries) {
      const [field, value] = filterQuery.split(":");
      if (field && value) {
        filters[field] = this.parseValue(value);
      }
    }

    return {
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      searchBy,
      filters,
    };
  }

  private static parseValue(value: string): string | number | boolean {
    if (value === "true") return true;
    if (value === "false") return false;
    if (!isNaN(Number(value))) return Number(value);
    return value;
  }
}
