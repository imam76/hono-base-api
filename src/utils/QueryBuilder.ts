/* eslint-disable @typescript-eslint/no-explicit-any */
import { database } from "@/config/database";
import { eq, like, and, asc, desc, count } from "drizzle-orm";

export interface QueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  searchBy?: string;
  filters?: Record<string, any>;
}

export class QueryBuilder {
  static async findMany(table: any, options: QueryOptions = {}) {
    const {
      page = 1,
      limit = 10,
      sortBy,
      sortOrder = "asc",
      search,
      searchBy,
      filters = {},
    } = options;

    let query = database.select().from(table);
    let countQuery = database.select({ count: count() }).from(table);

    const conditions = [];

    // Search
    if (search && searchBy && table[searchBy]) {
      conditions.push(like(table[searchBy], `%${search}%`));
    }

    // Filters
    Object.entries(filters).forEach(([field, value]) => {
      if (value !== undefined && value !== null) {
        conditions.push(eq(table[field], value));
      }
    });

    // Apply conditions
    if (conditions.length > 0) {
      const whereClause = and(...conditions);
      query = query.where(whereClause) as any;
      countQuery = countQuery.where(whereClause) as any;
    }

    // Sorting
    if (sortBy && table[sortBy]) {
      const orderFn = sortOrder === "desc" ? desc : asc;
      query = query.orderBy(orderFn(table[sortBy])) as any;
    }

    // Pagination
    const offset = (page - 1) * limit;
    query = query.limit(limit).offset(offset) as any;

    const [data, totalResult] = await Promise.all([query, countQuery]);
    const total = totalResult[0]?.["count"] || 0;

    return {
      list: data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  static async findById(table: any, id: string | number) {
    const result = await database
      .select()
      .from(table)
      .where(eq(table.id, id))
      .limit(1);

    return result[0] || null;
  }

  static async create(table: any, data: any) {
    const result = await database.insert(table).values(data).returning();

    return result[0];
  }

  static async update(table: any, id: string | number, data: any) {
    const result = await database
      .update(table)
      .set(data)
      .where(eq(table.id, id))
      .returning();

    return result[0] || null;
  }

  static async deleteById(table: any, id: string | number) {
    const result = await database
      .delete(table)
      .where(eq(table.id, id))
      .returning();

    return result[0] || null;
  }
}
