import { Elysia } from "elysia";
import {
  addExpenseDB,
  addIncomeDB,
  getAllExpenseDB,
  getAllIncomeDB,
  getMoneyBalanceDB,
} from "./database";
import { processAgentMessage } from "./agent";

const app = new Elysia()
  .get("/", () => "Finance Ai agent is running...")
  .get("/health", () => ({ status: 200, message: "Server is healthy" }))
  .post(
    "/api/expense",
    async ({ body }: { body: { name: string; amount: number | string } }) => {
      const result = await addExpenseDB(body);
      return { success: true, data: result };
    }
  )
  .post(
    "/api/income",
    async ({ body }: { body: { name: string; amount: number | string } }) => {
      const result = await addIncomeDB(body);
      return { success: true, data: result };
    }
  )
  .post(
    "/api/chat",
    async ({ body }: { body: { message: string; messages?: any[] } }) => {
      try {
        const messages = body.messages || [
          {
            role: "system",
            content: `
          You are Martin, a personal finance assistant. 
          Your task is to assist the users to track their expenses, 
          balances and financial planning.

          You have access to following tools:
          1. getTotalExpense({from, to}): string // Get total expense for a time period.
          2. addExpense({name, amount}): string // add new expense to the expense database.
          3. addIncome({name, amount}): string // add new income to the income database.
          4. getMoneyBalance(): string  // Get remainig money balance from your database.
          current datetime: ${new Date().toUTCString()}.
        `,
          },
        ];

        messages.push({
          role: "user",
          content: body.message,
        });

        const result = await processAgentMessage(messages);

        return {
          success: true,
          response: result.response,
          message: result.messages,
        };
      } catch (err) {
        console.error("Chat API Error: ", err);
        return {
          success: false,
          error: "Failed to process chat message.",
        };
      }
    }
  )
  .get("/api/balance", async () => {
    const result = await getMoneyBalanceDB();
    return { success: true, data: result };
  })
  .get("/api/expense", async () => {
    const result = await getAllExpenseDB();
    return { success: true, data: result };
  })
  .get("/api/income", async () => {
    const result = await getAllIncomeDB();
    return { success: true, data: result };
  })
  .listen(3001);

console.log(`🦊 Finance AI Agent API running at http://localhost:3001`);
