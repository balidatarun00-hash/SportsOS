import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, GenerateVideosOperation } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const DEFAULT_PORT = Number(process.env.PORT || 3000);
const FALLBACK_PORTS = [DEFAULT_PORT, 3001, 3002, 3003, 3004, 3005];

// Set up JSON body parser with a large limit for base64 images
app.use(express.json({ limit: "50mb" }));

// Initialize Gemini SDK lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required for video generation.");
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

// ================= API ENDPOINTS =================

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: process.env.NODE_ENV || "development" });
});

// Start video generation
app.post("/api/generate-video", async (req, res) => {
  try {
    const { image, prompt, aspectRatio = "16:9" } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Missing image base64 data" });
    }

    // Extract base64 clean data and mime type
    const match = image.match(/^data:([^;]+);base64,(.+)$/);
    let base64Data = image;
    let mimeType = "image/png";

    if (match) {
      mimeType = match[1];
      base64Data = match[2];
    }

    const ai = getGeminiClient();

    // Start Veo generation using model veo-3.1-fast-generate-preview
    const operation = await ai.models.generateVideos({
      model: "veo-3.1-fast-generate-preview",
      prompt: prompt || "Animate the background of this image, making the wind blow the grass blades gently, dynamic lens flares, slow motion cinematic",
      image: {
        imageBytes: base64Data,
        mimeType: mimeType,
      },
      config: {
        numberOfVideos: 1,
        resolution: "720p",
        aspectRatio: aspectRatio === "9:16" ? "9:16" : "16:9",
      },
    });

    res.json({ operationName: operation.name });
  } catch (err: any) {
    console.error("Error starting video generation:", err);
    res.status(500).json({ error: err.message || "Failed to initiate video generation" });
  }
});

// Check status of video generation
app.post("/api/video-status", async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: "Missing operationName" });
    }

    const ai = getGeminiClient();
    const op = new GenerateVideosOperation();
    op.name = operationName;

    const updated = await ai.operations.getVideosOperation({ operation: op });
    
    res.json({
      done: updated.done || false,
      error: updated.error || null,
      metadata: updated.metadata || null
    });
  } catch (err: any) {
    console.error("Error polling video status:", err);
    res.status(500).json({ error: err.message || "Failed to fetch video status" });
  }
});

// Stream completed video back to client
app.get("/api/video-stream", async (req, res) => {
  try {
    const operationName = req.query.operationName as string;
    if (!operationName) {
      return res.status(400).json({ error: "Missing operationName query parameter" });
    }

    const ai = getGeminiClient();
    const op = new GenerateVideosOperation();
    op.name = operationName;

    const updated = await ai.operations.getVideosOperation({ operation: op });

    if (!updated.done) {
      return res.status(400).json({ error: "Video generation is not yet complete" });
    }

    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) {
      return res.status(404).json({ error: "No video found in the completed operation" });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    // Fetch video stream from the Google Cloud Storage URI using the API key
    const videoRes = await fetch(uri, {
      headers: { "x-goog-api-key": key },
    });

    if (!videoRes.ok) {
      throw new Error(`Failed to download video from storage: ${videoRes.statusText}`);
    }

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Cache-Control", "public, max-age=3600");

    // Pipe the response body to Express client
    const body = videoRes.body;
    if (body) {
      const reader = body.getReader();
      const stream = new ReadableStream({
        async start(controller) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
          controller.close();
        }
      });

      // Stream the responses back
      for await (const chunk of stream as any) {
        res.write(chunk);
      }
      res.end();
    } else {
      res.status(500).json({ error: "Video stream body is empty" });
    }
  } catch (err: any) {
    console.error("Error streaming video:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message || "Failed to stream video" });
    }
  }
});

// ================= VITE OR STATIC SERVING =================

async function startServer(portIndex = 0) {
  const port = FALLBACK_PORTS[portIndex];

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

  const server = app.listen(port, "0.0.0.0", () => {
    const address = server.address();
    const actualPort = address && typeof address === "object" ? address.port : port;
    console.log(`Server running on http://0.0.0.0:${actualPort} in ${process.env.NODE_ENV || "development"} mode`);
  });

  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE" && portIndex < FALLBACK_PORTS.length - 1) {
      const nextPort = FALLBACK_PORTS[portIndex + 1];
      console.warn(`Port ${port} is already in use. Trying ${nextPort} instead.`);
      server.close(() => {
        startServer(portIndex + 1);
      });
      return;
    }

    console.error(err);
    process.exit(1);
  });
}

startServer();
