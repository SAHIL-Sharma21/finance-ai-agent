import {Elysia} from 'elysia';

const app = new Elysia()
    .get("/", () => "Application is running")
    .get("/health", () => ({status: 200, message: "Server is healthy"}))
    .listen(3001)


console.log(`🦊 Finance AI Agent API running at http://localhost:3001`)
