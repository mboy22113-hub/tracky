import express from "express";
import path from "path";
import { spawnSync } from "child_process";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Python API Execution Bridge
  function callPythonBridge(endpoint: string, method: string, body: any = {}, query: any = {}) {
    const payload = JSON.stringify({ endpoint, method, body, query });
    const pyScript = path.join(process.cwd(), "server", "api_handler.py");
    const result = spawnSync("python3", [pyScript, payload], {
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024
    });

    if (result.error || result.status !== 0) {
      console.error("Python bridge error:", result.stderr || result.error);
      throw new Error(result.stderr || "Python execution failed");
    }

    try {
      return JSON.parse(result.stdout.trim());
    } catch (e) {
      console.error("JSON parse error from Python:", result.stdout);
      throw new Error("Invalid response from API bridge");
    }
  }

  // Profile API
  app.get("/api/profile", (req, res) => {
    try {
      const data = callPythonBridge("/api/profile", "GET", {}, req.query);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/profile", (req, res) => {
    try {
      const data = callPythonBridge("/api/profile", "PUT", req.body);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Subscriptions CRUD API
  app.get("/api/subscriptions", (req, res) => {
    try {
      const data = callPythonBridge("/api/subscriptions", "GET", {}, req.query);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/subscriptions", (req, res) => {
    try {
      const data = callPythonBridge("/api/subscriptions", "POST", req.body);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/subscriptions/:id", (req, res) => {
    try {
      const data = callPythonBridge(`/api/subscriptions/${req.params.id}`, "GET");
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/subscriptions/:id", (req, res) => {
    try {
      const data = callPythonBridge(`/api/subscriptions/${req.params.id}`, "PUT", req.body);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/subscriptions/:id", (req, res) => {
    try {
      const data = callPythonBridge(`/api/subscriptions/${req.params.id}`, "DELETE");
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Insights API
  app.get("/api/insights", (req, res) => {
    try {
      const data = callPythonBridge("/api/insights", "GET", {}, req.query);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Optimizer API
  app.post("/api/optimizer", (req, res) => {
    try {
      const data = callPythonBridge("/api/optimizer", "POST", req.body);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/optimizer", (req, res) => {
    try {
      const data = callPythonBridge("/api/optimizer", "GET");
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Recommendations & Movies API
  app.get("/api/recommendations", (req, res) => {
    try {
      const data = callPythonBridge("/api/recommendations", "GET");
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/movies/upcoming", (req, res) => {
    try {
      const data = callPythonBridge("/api/movies/upcoming", "GET");
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Wishlist API
  app.get("/api/wishlist", (req, res) => {
    try {
      const data = callPythonBridge("/api/wishlist", "GET");
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/wishlist", (req, res) => {
    try {
      const data = callPythonBridge("/api/wishlist", "POST", req.body);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/wishlist/:id", (req, res) => {
    try {
      const data = callPythonBridge(`/api/wishlist/${req.params.id}`, "DELETE");
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Comparisons API
  app.post("/api/comparison/ott", (req, res) => {
    try {
      const data = callPythonBridge("/api/comparison/ott", "POST", req.body);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/comparison/services", (req, res) => {
    try {
      const data = callPythonBridge("/api/comparison/services", "POST", req.body);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Assistant Chat API
  app.post("/api/assistant/chat", (req, res) => {
    try {
      const data = callPythonBridge("/api/assistant/chat", "POST", req.body);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Health API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "Trackey Full-Stack App" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Trackey server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
