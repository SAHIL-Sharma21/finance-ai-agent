import Groq from 'groq-sdk';
import {getTotalExpense} from './tools/getExpense';

const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

async function callAgent(){
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `
                You are Martin, a personal finance assistant. 
                Your task is to assist the users to track their expenses, 
                balances and financial planning
                current datetime: ${new Date().toUTCString()}.
                `,
            },
            {
                role: "user",
                content: "How much money  i have spent in this month?",
            },
        ],
        model: "llama-3.3-70b-versatile",
        tools: [
            {
                type: "function",
                function: {
                    name: 'getTotalExpense',
                    description: "Get total expense from date to date.",
                    parameters: {
                        type: "object",
                        properties: {
                            from: {
                                type: "string",
                                description:"From date to get the expense"
                            },
                            to: {
                                type: "string",
                                description: "To date to get the expense"
                            }
                        }
                    }
                }
            }
        ],
    });

    console.log( JSON.stringify(completion.choices[0].message , null, 2));

    const toolsCalls = completion.choices[0].message?.tool_calls

    if(!toolsCalls){
        console.log(`Assistant: ${completion.choices[0].message.content}`);
        return;
    }

    for (const tool of toolsCalls) {
        const functionName = tool.function.name;
        const functionArgs = JSON.parse(tool.function.arguments);

        let result = ""

        if(functionName ===  "getTotalExpense"){
             result = getTotalExpense({from: functionArgs.from, to: functionArgs.to});
        }

        // call again  the completion and give the past history of messages
    }
}

callAgent();