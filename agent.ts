import Groq from 'groq-sdk';
import {getTotalExpense} from './tools/getExpense';

const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

async function callAgent(){
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are Martin, a personal finance assistant. Your task is to assist the users to track their expenses, balances and financial planning",
            },
            {
                role: "user",
                content: "Explain the impotance of Ai Agent",
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
                        propeties: {
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
}

callAgent();