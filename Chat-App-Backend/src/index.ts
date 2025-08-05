import express from "express";
import http from "http";
import cors from "cors";

import uploadRoutes from "./routes/upload.route";
import { setupSocketServer } from "./websockets/socket";

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Static file serving

app.use("/api/upload", uploadRoutes);

setupSocketServer(server);

server.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
