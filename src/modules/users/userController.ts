/** @notice library imports */
import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";
// import type { BlankInput } from "hono/types";

/// Local imports
import { UserServices } from "./UserServices";
import { PathRoutes } from "@/constants/routes";
import { SuccessResponse } from "@/types/responses";
import { Variables } from "./userDependencyMiddleware";
import { Users } from "@/schemas";

export class UserController {
  constructor(private todoService: UserServices) { }

  async createUser(c: Context<{ Variables: Variables }, PathRoutes.CREATE>) {
    /// Grab fields
    const body = await c.req.json();

    /// Save into database
    const res = await this.todoService.create(body);

    /// Response
    return c.json<SuccessResponse<Partial<Users>>>(
      {
        success: true,
        data: res,
      },
      StatusCodes.CREATED,
    );
  }

  async getUserById(c: Context<{ Variables: Variables }, PathRoutes.GET_BY_ID>) {
    const { id } = c.req.param();
    const user = await this.todoService.getById(id);

    if (!user) {
      return c.json(
        {
          success: false,
          data: null,
        },
        StatusCodes.NOT_FOUND,
      );
    }

    return c.json<SuccessResponse<Users>>(
      {
        success: true,
        data: user,
      },
      StatusCodes.OK,
    );
  }

  async getAllUsers(c: Context<{ Variables: Variables }, PathRoutes.GET_ALL>) {
    const users = await this.todoService.getAll();
    return c.json<SuccessResponse<Users[]>>(
      {
        success: true,
        data: users,
      },
      StatusCodes.OK,
    );
  }

  async updateUser(c: Context<{ Variables: Variables }, PathRoutes.GET_BY_ID>) {
    const { id } = c.req.param();
    const params = await c.req.json<Partial<Users>>();

    // Filter out null values to match ICreateParams type
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== null)
    );

    const updatedUser = await this.todoService.update(id, filteredParams);

    if (!updatedUser) {
      return c.json(
        {
          success: false,
          data: null,
        },
        StatusCodes.NOT_FOUND,
      );
    }

    return c.json<SuccessResponse<Partial<Users>>>(
      {
        success: true,
        data: updatedUser,
      },
      StatusCodes.OK,
    );
  }
}
