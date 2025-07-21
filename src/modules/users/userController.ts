/** @notice library imports */
import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";

/// Local imports
import { UserServices } from "./UserServices";
import { PathRoutes } from "@/constants/routes";
import { Variables } from "./userDependencyMiddleware";
import { Users } from "@/schemas";
import { QueryParamsHelper } from "@/utils/QueryParamsHelper";
import {
  ErrorResponse,
  SuccessPaginatedResponse,
  SuccessResponse,
} from "@/types/responses";

export class UserController {
  constructor(private userService: UserServices) {}

  async createUser(c: Context<{ Variables: Variables }, PathRoutes.CREATE>) {
    const body = await c.req.json();
    const user = await this.userService.create(body);

    return c.json<SuccessResponse<typeof user>>(
      { success: true, data: user },
      StatusCodes.CREATED,
    );
  }

  async getUserById(
    c: Context<{ Variables: Variables }, PathRoutes.GET_BY_ID>,
  ) {
    const { id } = c.req.param();
    const user = await this.userService.getById(id);

    if (!user) {
      return c.json<ErrorResponse>(
        {
          success: false,
          error: "user not found",
          code: "NOT_FOUND",
        },
        StatusCodes.NOT_FOUND,
      );
    }

    return c.json<SuccessResponse<typeof user>>(
      { success: true, data: user },
      StatusCodes.OK,
    );
  }

  async getAllUsers(c: Context<{ Variables: Variables }, PathRoutes.GET_ALL>) {
    const queryOptions = QueryParamsHelper.parseFromContext(c);
    const result = await this.userService.getAll(queryOptions);

    return c.json<SuccessPaginatedResponse<typeof result>>(
      { success: true, ...result },
      StatusCodes.OK,
    );
  }

  async updateUser(c: Context<{ Variables: Variables }, PathRoutes.GET_BY_ID>) {
    const { id } = c.req.param();
    const params = await c.req.json<Partial<Users>>();

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== null),
    );

    const updatedUser = await this.userService.update(id, filteredParams);

    if (!updatedUser) {
      return c.json<ErrorResponse>(
        {
          success: false,
          error: "user not found",
          code: "NOT_FOUND",
        },
        StatusCodes.NOT_FOUND,
      );
    }

    return c.json<SuccessResponse<typeof updatedUser>>(
      { success: true, data: updatedUser },
      StatusCodes.OK,
    );
  }

  async deleteUser(c: Context<{ Variables: Variables }, PathRoutes.GET_BY_ID>) {
    const { id } = c.req.param();
    const user = await this.userService.delete(id);

    if (!user) {
      return c.json<ErrorResponse>(
        {
          success: false,
          error: "user not found",
          code: "NOT_FOUND",
        },
        StatusCodes.NOT_FOUND,
      );
    }

    return c.json<SuccessResponse<typeof user>>(
      { success: true, data: user },
      StatusCodes.OK,
    );
  }
}
