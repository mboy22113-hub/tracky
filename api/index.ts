import { createApiApp } from "../server/app";

const app = createApiApp();

// Vercel serverless function configuration
export const maxDuration = 30;

export default app;
