
## **Section 2: Advanced Type System Patterns for Scalability**

These topics teach juniors how to use TypeScript’s **powerful type system** to manage complexity in large projects — ensuring code remains safe, maintainable, and self-documenting.

---

### **Topic 1: Discriminated Unions (Tagged Unions)**

**Purpose:**
Model multiple related states or variants of data safely — great for handling API responses, UI states, or Redux actions.

**Key Concepts:**

* Each variant has a *discriminant* (like `type` or `status`) that uniquely identifies it.
* TypeScript automatically narrows types based on this discriminant.

**Example:**

```typescript
type ApiResponse =
  | { status: "success"; data: string[] }
  | { status: "error"; message: string }
  | { status: "loading" };

function handleResponse(res: ApiResponse) {
  if (res.status === "success") {
    console.log("Data:", res.data);
  } else if (res.status === "error") {
    console.error("Error:", res.message);
  } else {
    console.log("Loading...");
  }
}
```

**Use Case:**
Helps model frontend state machines, API status responses, or workflow steps without nullable chaos or `if` spaghetti.

---

### **Topic 2: Mapped Types**

**Purpose:**
Transform one type into another — ideal for building dynamic, reusable patterns across entities.

**Key Concepts:**

* A *mapped type* iterates over keys of another type.
* Commonly used with utility types like `Partial<T>`, `Readonly<T>`, or custom ones.

**Example:**

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type ReadonlyUser = {
  readonly [K in keyof User]: User[K];
};

// Same as Readonly<User>
```

**Use Case:**
Creating “safe” variants of types for configuration, form state, or database updates.

---

### **Topic 3: Conditional Types**

**Purpose:**
Enable logic *within types* — the type returned depends on another type.

**Key Concepts:**

* Syntax: `T extends U ? X : Y`
* Useful for dynamic relationships between types (e.g., response type vs. request type).

**Example:**

```typescript
type ApiResult<T> = T extends "success"
  ? { status: "success"; data: string[] }
  : { status: "error"; message: string };

const result: ApiResult<"success"> = { status: "success", data: ["a", "b"] };
```

**Use Case:**
Perfect for API handler results, component props that change with mode, or polymorphic functions.

---

### **Topic 4: Utility Types in Practice**

**Purpose:**
Learn to use built-in utility types to reduce boilerplate and enforce rules.

**Common Utilities:**

* `Partial<T>` – Makes all properties optional.
* `Required<T>` – Makes all properties required.
* `Pick<T, K>` – Select specific keys.
* `Omit<T, K>` – Exclude keys.
* `Record<K, T>` – Create a type with specific key-value pairs.
* `ReturnType<T>` – Infer function return type.

**Example:**

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type PublicUser = Omit<User, "email">;
type UserMap = Record<number, User>;
```

**Use Case:**
Ideal for type-safe caching systems, public/private data layers, and mapping ID-indexed data.

---

### **Topic 5: Type Inference and Narrowing**

**Purpose:**
Help juniors understand how TypeScript automatically infers and narrows types at runtime.

**Key Concepts:**

* **Type inference** — TypeScript guesses the type from context.
* **Type narrowing** — Reduces a union type using conditions (`typeof`, `in`, `instanceof`).

**Example:**

```typescript
function printId(id: string | number) {
  if (typeof id === "string") {
    console.log("ID (string):", id.toUpperCase());
  } else {
    console.log("ID (number):", id.toFixed(2));
  }
}
```

**Use Case:**
Improves code readability, reduces manual type annotations, and avoids unsafe casts.

---

### **Topic 6: Template Literal Types**

**Purpose:**
Create string-based patterns with compile-time safety — great for dynamic routes, event names, or CSS class helpers.

**Example:**

```typescript
type Route = `/api/${string}`;
const route: Route = "/api/users"; // ✅
const badRoute: Route = "/users";  // ❌ Type error
```

**Use Case:**
Enforce consistent naming or endpoint formats without writing manual checks.

---
