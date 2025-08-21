import { Elysia } from "elysia";
import { addExpenseDB, addIncomeDB, getAllExpenseDB, getAllIncomeDB, getMoneyBalanceDB } from "./database";

const app = new Elysia()
  .get("/", () => "Finance Ai agent is running...")
  .get("/health", () => ({ status: 200, message: "Server is healthy" }))
  .post(
    "/api/expense",
    async ({ body }: { body: { name: string; amount: number | string } }) => {
      const result = await addExpenseDB(body);
      return { success: true, message: result };
    }
  )
  .post("/api/income", async ({body}: {body: {name: string, amount: number | string}}) => {
    const result = await addIncomeDB(body);
    return {success: true, message: result};
  })
  .get("/api/balance", async () => {
    const result = await getMoneyBalanceDB();
    return {success: true, message: result}
  })
  .get("/api/expense", async () => {
    const result = await getAllExpenseDB()
    return {success: true, message: result}
  })
  .get("/api/income", async () => {
    const result = await getAllIncomeDB();
    return {success: true, message: result}
  })
  .listen(3001);

console.log(`🦊 Finance AI Agent API running at http://localhost:3001`);
