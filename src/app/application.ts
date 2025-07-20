/** @notice library imports */
import "reflect-metadata";
import { Hono } from "hono";

/// Local imports
import { handlers } from "@/middlewares";
import { todoRouter } from "@/modules/todos/todoRouter";
import { ApplicationRoutes } from "@/constants/routes";
import { userRouter } from "@/modules/users/userRouter";

/// Core app
const app = new Hono({ strict: false });

/// Routers
app.route(ApplicationRoutes.TODOS, todoRouter);
app.route(ApplicationRoutes.USERS, userRouter);

/// Global handlers
app.onError(handlers.onErrorHandler);
app.notFound(handlers.onNotFoundHandler);

export default app;
