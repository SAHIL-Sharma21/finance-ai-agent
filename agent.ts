import Groq from "groq-sdk";
import { getTotalExpense } from "./tools/getExpense";
import { addExpense } from "./tools/addExpense";
import readline from "readline/promises";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

//  DB init
export const expenseDB: any = [];

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
        model: "llama-3.3-70b-versatile",
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
          result = getTotalExpense({
            from: functionArgs.from,
            to: functionArgs.to,
          });
        } else if (functionName === "addExpense") {
          result = addExpense({
            name: functionArgs.name,
            amount: functionArgs.amount,
          });
        }

        messages.push({
          role: "tool",
          content: result,
          tool_call_id: tool.id,
        });
      }

      //   console.log("======================");
      //   console.log("MESSAGES", messages);
      //   console.log("======================");
      //   console.log("DB: ", expenseDB);
    }
  }

  rl.close();
}
callAgent();
