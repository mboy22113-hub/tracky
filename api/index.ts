import "dotenv/config";
import { createApiApp } from "../server/app.js";

const app = createApiApp();

// Vercel serverless function configuration (timeout limit in seconds)
export const maxDuration = 30;

export default app;

