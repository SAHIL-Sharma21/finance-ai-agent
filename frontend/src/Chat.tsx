import { useState } from "react";
import type { Message } from './types/messages'

export const ChatWindow = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "system",
            content: 'you are Martin, a personal finance assistant and planner....'
        }
    ]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>("")




    return (
        <>
            <h2>Chat file</h2>
        </>
    );
}