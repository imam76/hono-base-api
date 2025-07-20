/** @notice library imports */
import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";

/// Local imports
import { TodoServices } from "./TodoServices";
import { PathRoutes } from "@/constants/routes";
import { Variables } from "./todoDependencyMiddleware";
import { QueryParamsHelper } from "@/utils/QueryParamsHelper";
import { SuccessResponse, ErrorResponse } from "@/types/responses";

export class TodoController {
  constructor(private todoService: TodoServices) {}

  async createTodo(c: Context<{ Variables: Variables }, PathRoutes.CREATE>) {
    const { description } = await c.req.json();
    const result = await this.todoService.create({ description });

    return c.json<SuccessResponse<typeof result>>(
      { success: true, data: result },
      StatusCodes.CREATED,
    );
  }

  async getAllTodos(c: Context<{ Variables: Variables }, PathRoutes.GET_ALL>) {
    const queryOptions = QueryParamsHelper.parseFromContext(c);
    const result = await this.todoService.getAll(queryOptions);

    return c.json<SuccessResponse<typeof result>>(
      { success: true, data: result },
      StatusCodes.OK,
    );
  }

  async getTodoById(
    c: Context<{ Variables: Variables }, PathRoutes.GET_BY_ID>,
  ) {
    const { id } = c.req.param();
    const todo = await this.todoService.getById(id);

    if (!todo) {
      return c.json<ErrorResponse>(
        {
          success: false,
          error: "Todo not found",
          code: "NOT_FOUND",
        },
        StatusCodes.NOT_FOUND,
      );
    }

    return c.json<SuccessResponse<typeof todo>>(
      { success: true, data: todo },
      StatusCodes.OK,
    );
  }

  async updateTodo(c: Context<{ Variables: Variables }, PathRoutes.GET_BY_ID>) {
    const { id } = c.req.param();
    const params = await c.req.json();
    const todo = await this.todoService.update(id, params);

    if (!todo) {
      return c.json<ErrorResponse>(
        {
          success: false,
          error: "Todo not found",
          code: "NOT_FOUND",
        },
        StatusCodes.NOT_FOUND,
      );
    }

    return c.json<SuccessResponse<typeof todo>>(
      { success: true, data: todo },
      StatusCodes.OK,
    );
  }

  async deleteTodo(c: Context<{ Variables: Variables }, PathRoutes.GET_BY_ID>) {
    const { id } = c.req.param();
    const todo = await this.todoService.delete(id);

    if (!todo) {
      return c.json<ErrorResponse>(
        {
          success: false,
          error: "Todo not found",
          code: "NOT_FOUND",
        },
        StatusCodes.NOT_FOUND,
      );
    }

    return c.json<SuccessResponse<typeof todo>>(
      { success: true, data: todo },
      StatusCodes.OK,
    );
  }
}
