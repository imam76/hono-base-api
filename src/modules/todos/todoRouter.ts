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
  /// Get todos
  .get(PathRoutes.GET_ALL, (c) => c.get("todoController").getAllTodos(c))
  /// Get todo by id
  .get(PathRoutes.GET_BY_ID, (c) => c.get("todoController").getTodoById(c))
  /// Update todo
  .put(PathRoutes.GET_BY_ID, (c) => c.get("todoController").updateTodo(c))
  /// Delete todo
  .delete(PathRoutes.GET_BY_ID, (c) => c.get("todoController").deleteTodo(c));
