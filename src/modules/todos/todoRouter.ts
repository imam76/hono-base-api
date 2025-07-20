/** @notice library imports */
import { Hono } from "hono";
/// Local imports
import { PathRoutes } from "@/constants/routes";
import { injectTodoDependenciesMiddleware } from "./todoDependencyMiddleware";

/// Todo router
export const todoRouter = new Hono({
  strict: false,
})
  /// Dependency injection
  .use("*", injectTodoDependenciesMiddleware)
  /// Create todo
  .post(PathRoutes.CREATE, (c) => c.get("todoController").createTodo(c))

  /// Get todo by id
  .get(PathRoutes.GET_BY_ID, async (c) => {
    const { id } = c.req.param();
    return c.text(`Got todo, ${id}`);
  })

  /// Get todos
  .get(PathRoutes.GET_ALL, async (c) => {
    return c.text(`Got todos`);
  });
