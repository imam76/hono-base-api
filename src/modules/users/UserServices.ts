/** @notice library imports */
/// Local imports
import { users } from "@/schemas";
import { QueryBuilder, type QueryOptions } from "@/utils/QueryBuilder";

type ICreateParams = {
  first_name: string;
  last_name: string;
  full_name?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  password: string;
};

export class UserServices {
  async create(params: ICreateParams) {
    if (!params.full_name) {
      params.full_name = `${params.first_name} ${params.last_name}`;
    }
    return await QueryBuilder.create(users, params);
  }

  async getById(id: string) {
    return await QueryBuilder.findById(users, id);
  }

  async getAll(options?: QueryOptions) {
    return await QueryBuilder.findMany(users, options);
  }

  async update(id: string, params: Partial<ICreateParams>) {
    if (params.first_name || params.last_name) {
      const user = await this.getById(id);
      if (user) {
        params.full_name = `${params.first_name || user["first_name"]} ${params.last_name || user["last_name"]}`;
      }
    }
    return await QueryBuilder.update(users, id, params);
  }

  async delete(id: string) {
    return await QueryBuilder.deleteById(users, id);
  }
}
