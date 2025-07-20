/** @notice library imports */
/// Local imports
import { todos } from "@/schemas";
import { QueryBuilder, type QueryOptions } from "@/utils/QueryBuilder";

type ICreateParams = {
  description: string;
};

export class TodoServices {
  async create(params: ICreateParams) {
    return await QueryBuilder.create(todos, params);
  }

  async getById(id: string) {
    return await QueryBuilder.findById(todos, id);
  }

  async getAll(options?: QueryOptions) {
    return await QueryBuilder.findMany(todos, options);
  }

  async update(id: string, params: Partial<ICreateParams>) {
    return await QueryBuilder.update(todos, id, params);
  }

  async delete(id: string) {
    return await QueryBuilder.deleteById(todos, id);
  }
}
