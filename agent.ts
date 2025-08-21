import Groq from "groq-sdk";
import { getTotalExpense } from "./src/tools/getExpense";
import { addExpense } from "./src/tools/addExpense";
import readline from "readline/promises";
import { addIncome } from "./src/tools/addIncome";
import { getMoneyBalance } from "./src/tools/getMoneyBalance";


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

//  DB init
export const expenseDB: any = [];

// Incone Database
export const incomeDB: any = []


async function callAgent() {
  // terminal I/O
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const messages: any[] = [
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

  // this loop is for unser input from the command line
  while (true) {
    const question = await rl.question("USER: ");

    if (question === "bye") {
      break;
    }

    messages.push({
      role: "user",
      content: question,
    });

    // this infinite loop is for agent
    while (true) {
      const completion = await groq.chat.completions.create({
        messages: messages,
        model: "openai/gpt-oss-20b",
        tools: [
          {
            type: "function",
            function: {
              name: "getTotalExpense",
              description: "Get total expense from date to date.",
              parameters: {
                type: "object",
                properties: {
                  from: {
                    type: "string",
                    description: "From date to get the expense",
                  },
                  to: {
                    type: "string",
                    description: "To date to get the expense",
                  },
                },
              },
            },
          },
          {
            type: "function",
            function: {
              name: "addExpense",
              description: "Add new expense entry to expense database.",
              parameters: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description:
                      "Name of the expense. e.g., Bought an macbook.",
                  },
                  amount: {
                    type: "string",
                    description: "Amount of the expense to be added.",
                  },
                },
              },
            },
          },
          {
            type: "function",
            function: {
              name: "addIncome",
              description: "Add new income entry to income database.",
              parameters: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description:
                      "Name of the income. e.g. Got salary.",
                  },
                  amount: {
                    type: "string",
                    description: "Amount of the income to be added.",
                  },
                },
              },
            },
          },
          {
            type: "function",
            function: {
              name: "getMoneyBalance",
              description: "Get remainig money balance from your database.",
            },
          },
        ],
      });

      messages.push(completion.choices[0].message);

      const toolsCalls = completion.choices[0].message?.tool_calls;
      if (!toolsCalls) {
        console.log(`Assistant: ${completion.choices[0].message.content}`);
        break; // important line to break the infinite loop
      }

      for (const tool of toolsCalls) {
        const functionName = tool.function.name;
        const functionArgs = JSON.parse(tool.function.arguments);

        let result: any = "";

        if (functionName === "getTotalExpense") {
          result =  getTotalExpense({
            from: functionArgs.from,
            to: functionArgs.to,
          });
        } else if (functionName === "addExpense") {
          result =  addExpense({
            name: functionArgs.name,
            amount: functionArgs.amount,
          });
        } else if(functionName === "addIncome"){
          result =  addIncome({
            name: functionArgs.name,
            amount: functionArgs.amount
          });
        } else if(functionName === "getMoneyBalance"){
          result =  getMoneyBalance();
        }

        messages.push({
          role: "tool",
          content: typeof result === "string" ? result: JSON.stringify(result),
          tool_call_id: tool.id,
        });
      }
    }
  }

  rl.close();
}
callAgent();
