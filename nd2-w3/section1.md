## 📍 Navigation

**[Section 1: API Integration & Validation](./section1.md)** | **[Section 2: Advanced Type Patterns](./section2.md)** | **[Section 3: Production Optimization](./section3.md)** | **[Home](./README.md)**

---

## **Section 1: Type-Safe API Integration and Data Validation**

---

### **Topic 1: TypeScript Interfaces**

**Purpose:**
Interfaces define the *shape* of data and ensure your API responses and objects are consistent across your application.

**Key Concepts:**

* Declare the structure of objects (fields, types, optional values).
* Enforce consistency between backend data and frontend usage.
* Allow extension or composition for scalable design.

**Example:**

```typescript
interface User {
  id: number;
  name: string;
  email?: string; // optional field
}

function getUserInfo(user: User) {
  console.log(`User: ${user.name}`);
}
```

**Use Case:**
When fetching user data from an API, an interface ensures that every component consuming this data knows what fields are expected — reducing runtime bugs.

---

### **Topic 2: TypeScript Generics**

**Purpose:**
Generics allow you to write flexible, reusable code that still maintains type safety.

**Key Concepts:**

* Define placeholder types (`<T>`) that get replaced when used.
* Useful for reusable functions, data models, and API handlers.
* Prevents code duplication and ensures consistency.

**Example:**

```typescript
function getData<T>(url: string): Promise<T> {
  return fetch(url).then(res => res.json());
}

// Usage:
interface Product {
  id: number;
  title: string;
  price: number;
}

getData<Product>('/api/products/1').then(product => {
  console.log(product.title); // Type-safe!
});
```

**Use Case:**
When building a data fetching utility, generics allow it to handle multiple types (User, Product, Order) without losing type inference.

---

### **Topic 3: Runtime Validation with Zod**

**Purpose:**
TypeScript checks types at *compile time* — not runtime. Libraries like **Zod** allow validation of actual data from APIs.

**Key Concepts:**

* Define schemas for runtime validation.
* Infer TypeScript types from schemas (`z.infer<typeof schema>`).
* Prevents invalid API data from breaking the app.

**Example:**

```typescript
import { z } from "zod";

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email()
});

type User = z.infer<typeof UserSchema>;

async function fetchUser(): Promise<User> {
  const res = await fetch("/api/user");
  const data = await res.json();
  return UserSchema.parse(data); // runtime validation
}
```

**Use Case:**
If the API changes or returns invalid data, `Zod` will throw a clear error instead of silently failing in production.

---

### **Topic 4: Combining Types with Generics and Schemas**

**Purpose:**
Combine compile-time and runtime checks for full-stack safety.

**Key Concepts:**

* Use generics for reusable fetchers.
* Use Zod schemas to validate and type-infer automatically.

**Example:**

```typescript
async function fetchTyped<T>(
  url: string,
  schema: z.ZodSchema<T>
): Promise<T> {
  const res = await fetch(url);
  const json = await res.json();
  return schema.parse(json);
}

const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
});

const product = await fetchTyped("/api/product/1", ProductSchema);
```

**Use Case:**
This approach scales perfectly for large projects — one fetcher, infinite type-safe endpoints.

---

### **Topic 5: Handling Partial and Optional API Data**

**Purpose:**
Real-world APIs sometimes send incomplete or partial data. Handle this safely using **utility types**.

**Key Concepts:**

* Use `Partial<T>` for update payloads.
* Use `Pick<T>` or `Omit<T>` for narrowing down models.

**Example:**

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type UserUpdate = Partial<User>;

function updateUser(id: number, data: UserUpdate) {
  // allows partial fields safely
}
```

**Use Case:**
Useful for PATCH requests or UI forms where not all fields are provided.

---

## 📍 Navigation

**[Section 1: API Integration & Validation](./section1.md)** | **[Section 2: Advanced Type Patterns](./section2.md)** | **[Section 3: Production Optimization](./section3.md)** | **[Home](./README.md)**

---
