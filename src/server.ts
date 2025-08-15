import { Elysia } from "elysia";
import { addExpenseDB } from "./database";

const app = new Elysia()
  .get("/", () => "Finance Ai agent is running...")
  .get("/health", () => ({ status: 200, message: "Server is healthy" }))
  .post(
    "/api/expense",
    ({ body }: { body: { name: string; amount: number | string } }) => {
      const result = addExpenseDB(body);
      return { success: true, message: result };
    }
  )
  .listen(3001);

console.log(`🦊 Finance AI Agent API running at http://localhost:3001`);
