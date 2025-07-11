import Groq from 'groq-sdk';

const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

async function callAgent(){
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: "Explain the impotance of LLM"
            },
        ],
        model: "llama-3.3-70b-versatile"
    });
    
}