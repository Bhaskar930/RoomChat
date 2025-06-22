import express from "express";
import http from "http";
import cors from "cors";
import { WebSocket, WebSocketServer } from "ws";

const app = express();
const server = http.createServer(app);

// ✅ Enable CORS for your frontend
app.use(cors({
  origin: "http://localhost:5174",
  credentials: true,
}));
app.use(express.json()); // If you're handling JSON POST requests

// ✅ Example route (you can later add /api/auth/signup here)
app.get("/", (req, res) => {
  res.send("HTTP server is running");
});

// ✅ WebSocket server on same HTTP server
const wss = new WebSocketServer({ server });

interface User {
  socket: WebSocket;
  room: string;
}

let allSockets: User[] = [];

wss.on("connection", (socket) => {
  socket.on("message", (message) => {
    try {
      const parsed = JSON.parse(message.toString());

      if (parsed.type === "join") {
        console.log(`User joined room: ${parsed.payload.roomId}`);
        allSockets.push({ socket, room: parsed.payload.roomId });
      }

      if (parsed.type === "chat") {
        const user = allSockets.find((u) => u.socket === socket);
        if (!user) return;

        const roomId = user.room;

        allSockets.forEach((u) => {
          if (u.room === roomId && u.socket !== socket) {
            u.socket.send(JSON.stringify({
              type: "chat",
              payload: { message: parsed.payload.message },
            }));
          }
        });
      }
    } catch (err) {
      console.error("Error handling message:", err);
    }
  });

  socket.on("close", () => {
    allSockets = allSockets.filter((u) => u.socket !== socket);
  });
});

// ✅ Start both HTTP and WebSocket on port 5000
server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
