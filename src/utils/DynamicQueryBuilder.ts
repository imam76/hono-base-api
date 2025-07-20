/* eslint-disable @typescript-eslint/no-explicit-any */
import { database } from "@/config/database";
import {
  eq,
  like,
  ilike,
  gt,
  lt,
  gte,
  lte,
  and,
  or,
  asc,
  desc,
  count,
} from "drizzle-orm";
import type { PgTable, PgColumn } from "drizzle-orm/pg-core";

export type SortOrder = "asc" | "desc";
export type FilterOperator =
  | "eq"
  | "like"
  | "ilike"
  | "gt"
  | "lt"
  | "gte"
  | "lte";

export interface IFilter {
  field: string;
  operator: FilterOperator;
  value: string | number | boolean;
}

export interface IQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  search?: string;
  searchFields?: string[];
  filters?: IFilter[];
}

export interface IPaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class QueryBuilder<T extends PgTable> {
  constructor(private table: T) {}

  async findMany(params: IQueryParams = {}) {
    const {
      page = 1,
      limit = 10,
      sortBy,
      sortOrder = "asc",
      search,
      searchFields = [],
      filters = [],
    } = params;

    const whereConditions = this.buildWhereConditions(
      search,
      searchFields,
      filters,
    );

    let query = database.select().from(this.table);
    let countQuery = database.select({ count: count() }).from(this.table);

    if (whereConditions.length > 0) {
      const whereClause =
        whereConditions.length === 1
          ? whereConditions[0]
          : and(...whereConditions);
      query = (query as any).where(whereClause);
      countQuery = (countQuery as any).where(whereClause);
    }

    if (sortBy && this.hasColumn(sortBy)) {
      const column = this.getColumn(sortBy);
      query = (query as any).orderBy(
        sortOrder === "desc" ? desc(column) : asc(column),
      );
    }

    const offset = (page - 1) * limit;
    query = (query as any).limit(limit).offset(offset);

    const [data, totalResult] = await Promise.all([query, countQuery]);

    const total = totalResult[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findById(id: string | number) {
    const result = await database
      .select()
      .from(this.table)
      .where(eq(this.getColumn("id"), id))
      .limit(1);

    return result[0] || null;
  }

  async create(data: Record<string, unknown>) {
    const result = await database
      .insert(this.table)
      .values(data as any)
      .returning();

    return result[0];
  }

  async update(id: string | number, data: Record<string, unknown>) {
    const result = await database
      .update(this.table)
      .set(data as any)
      .where(eq(this.getColumn("id"), id))
      .returning();

    return result[0] || null;
  }

  async delete(id: string | number) {
    const result = await database
      .delete(this.table)
      .where(eq(this.getColumn("id"), id))
      .returning();

    return result[0] || null;
  }

  private buildWhereConditions(
    search?: string,
    searchFields: string[] = [],
    filters: IFilter[] = [],
  ) {
    const conditions = [];

    if (search && searchFields.length > 0) {
      const searchConditions = searchFields
        .filter((field) => this.hasColumn(field))
        .map((field) => ilike(this.getColumn(field), `%${search}%`));

      if (searchConditions.length > 0) {
        conditions.push(or(...searchConditions));
      }
    }

    if (filters.length > 0) {
      const filterConditions = filters
        .filter((filter) => this.hasColumn(filter.field))
        .map((filter) => this.buildFilterCondition(filter));

      conditions.push(...filterConditions);
    }

    return conditions;
  }

  private buildFilterCondition(filter: IFilter) {
    const column = this.getColumn(filter.field);

    switch (filter.operator) {
      case "eq":
        return eq(column, filter.value);
      case "like":
        return like(column, `%${filter.value}%`);
      case "ilike":
        return ilike(column, `%${filter.value}%`);
      case "gt":
        return gt(column, filter.value);
      case "lt":
        return lt(column, filter.value);
      case "gte":
        return gte(column, filter.value);
      case "lte":
        return lte(column, filter.value);
      default:
        return eq(column, filter.value);
    }
  }

  private hasColumn(columnName: string): boolean {
    return columnName in this.table;
  }

  private getColumn(columnName: string): PgColumn {
    return (this.table as any)[columnName];
  }
}
