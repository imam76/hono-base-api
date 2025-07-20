/** @notice library imports */
import { createMiddleware } from "hono/factory";
/// local imports
import { UserServices } from "./UserServices";
import { UserController } from "./userController";

/// Variable type
export type Variables = {
  userController: UserController;
};

/// Dependencies
const userServices = new UserServices();
const userController = new UserController(userServices);

/// Dependency injection
export const injectUserDependenciesMiddleware = createMiddleware<{
  Variables: Variables;
}>(async (c, next) => {
  c.set("userController", userController);
  await next();
});
