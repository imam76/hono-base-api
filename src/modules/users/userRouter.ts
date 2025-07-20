/** @notice library imports */
import { Hono } from "hono";
/// Local imports
import { PathRoutes } from "@/constants/routes";
import { injectUserDependenciesMiddleware } from "./userDependencyMiddleware";

/// Todo router
export const userRouter = new Hono({
  strict: false,
})
  /// Dependency injection
  .use("*", injectUserDependenciesMiddleware)
  /// Create user
  .post(PathRoutes.CREATE, (c) => c.get("userController").createUser(c))

  /// Get user by id
  .get(PathRoutes.GET_BY_ID, async (c) => c.get("userController").getUserById(c))

  /// Get users
  .get(PathRoutes.GET_ALL, async (c) => c.get("userController").getAllUsers(c));
