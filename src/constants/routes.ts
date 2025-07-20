const API_PREFIX = "/api";

export const enum ApplicationRoutes {
  TODOS = `${API_PREFIX}/todos`,
  USERS = `${API_PREFIX}/users`,
  PRODUCTS = `${API_PREFIX}/products`,
}
export const enum PathRoutes {
  CREATE = "/",
  GET_ALL = "/",
  GET_BY_ID = "/:id",
}
