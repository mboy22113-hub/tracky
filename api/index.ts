import "dotenv/config";
import { createApiApp } from "../server/app";

const app = createApiApp();

// Vercel serverless function configuration (timeout limit in seconds)
export const maxDuration = 30;

export default function handler(req: any, res: any) {
  return app(req, res);
}

