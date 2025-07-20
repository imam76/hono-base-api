/** @notice library imports */
import { Hono } from "hono";
/// Local imports
import { PathRoutes } from "@/constants/routes";
import { injectUserDependenciesMiddleware } from "./userDependencyMiddleware";

/// User router
export const userRouter = new Hono({
  strict: false,
})
  /// Dependency injection
  .use("*", injectUserDependenciesMiddleware)
  /// Create user
  .post(PathRoutes.CREATE, (c) => c.get("userController").createUser(c))
  /// Get users
  .get(PathRoutes.GET_ALL, (c) => c.get("userController").getAllUsers(c))
  /// Get user by id
  .get(PathRoutes.GET_BY_ID, (c) => c.get("userController").getUserById(c))
  /// Update user
  .put(PathRoutes.GET_BY_ID, (c) => c.get("userController").updateUser(c))
  /// Delete user
  .delete(PathRoutes.GET_BY_ID, (c) => c.get("userController").deleteUser(c));
