import { Elysia } from "elysia";
import { addExpenseDB, addIncomeDB, getAllExpenseDB, getAllIncomeDB, getMoneyBalanceDB } from "./database";

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
  .post("/api/income", ({body}: {body: {name: string, amount: number | string}}) => {
    const result = addIncomeDB(body);
    return {success: true, message: result};
  })
  .get("/api/getmoney-balance", () => {
    const result = getMoneyBalanceDB();
    return {success: true, message: result}
  })
  .get("/api/getexpense", () => {
    const result = getAllExpenseDB()
    return {success: true, message: result}
  })
  .get("/api/getAllIncome", () => {
    const result = getAllIncomeDB();
    return {success: true, message: result}
  })
  .listen(3001);

console.log(`🦊 Finance AI Agent API running at http://localhost:3001`);
