/** @notice library imports */
/// Local imports
import { users } from "@/schemas";
import { database } from "@/config/database";
import { eq } from "drizzle-orm";

type ICreateParams = {
  first_name: string;
  last_name: string;
  full_name?: string; // Can be generated from first_name + last_name
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
    const result = await database.insert(users).values(params).returning({
      id: users.id,
      first_name: users.first_name,
      last_name: users.last_name,
      full_name: users.full_name,
      email: users.email,
      phone: users.phone,
      address: users.address,
      city: users.city,
      state: users.state,
      zip: users.zip,
      country: users.country
    });
    return result.at(0)!;
  }

  async getById(id: string) {
    const result = await database.select().from(users).where(eq(users.id, id));
    return result.at(0) || null;
  }

  async getAll() {
    const result = await database.select().from(users);
    return result;
  }

  async update(id: string, params: Partial<ICreateParams>) {
    const result = await database
      .update(users)
      .set(params)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        first_name: users.first_name,
        last_name: users.last_name,
        full_name: users.full_name,
        email: users.email,
        phone: users.phone,
        address: users.address,
        city: users.city,
        state: users.state,
        zip: users.zip,
        country: users.country
      });
    return result.at(0) || null;
  }

}
