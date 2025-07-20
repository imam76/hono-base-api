# Simple Query Builder

Query builder simpel untuk pagination, sorting, searching, dan filtering.

## Usage

```typescript
import { QueryBuilder } from "@/utils/QueryBuilder";
import { users } from "@/schemas";

// Get all with options
const result = await QueryBuilder.findMany(users, {
  page: 1,
  limit: 10,
  sortBy: "created_at",
  sortOrder: "desc",
  search: "john",
  searchBy: "first_name",
  filters: { city: "Jakarta", status: "active" },
});

// CRUD operations
const user = await QueryBuilder.findById(users, 1);
const newUser = await QueryBuilder.create(users, userData);
const updated = await QueryBuilder.update(users, 1, updateData);
const deleted = await QueryBuilder.deleteById(users, 1);
```

## URL Examples

```
GET /users?page=1&limit=10
GET /users?search=john&searchBy=first_name
GET /users?search=john&searchBy=email&sortBy=created_at&sortOrder=desc
GET /users?filter=city:Jakarta&filter=status:active
GET /users?page=1&search=john&searchBy=first_name&sortBy=created_at&sortOrder=desc&filter=city:Jakarta
```

## Query Parameters

| Parameter   | Description              | Example               |
| ----------- | ------------------------ | --------------------- |
| `page`      | Page number              | `page=1`              |
| `limit`     | Items per page (max 100) | `limit=10`            |
| `search`    | Search term              | `search=john`         |
| `searchBy`  | Field to search in       | `searchBy=first_name` |
| `sortBy`    | Field to sort by         | `sortBy=created_at`   |
| `sortOrder` | Sort direction           | `sortOrder=desc`      |
| `filter`    | Field filters            | `filter=city:Jakarta` |

## Response

```json
{
  "success": true,
  "data": {
    "data": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```
