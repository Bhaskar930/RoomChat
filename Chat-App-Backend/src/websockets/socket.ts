import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { MessagePayload, User } from "../utils/types";


let users: User[] = [];

export const setupSocketServer = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (socket: WebSocket) => {
    socket.on("message", (message) => {
      try {
        const parsed: MessagePayload = JSON.parse(message.toString());

        switch (parsed.type) {
          case "join":
            users.push({ socket, room: parsed.payload.roomId, userName: parsed.payload.userName, avatar: parsed.payload.avatar });
            broadcastUserList(parsed.payload.roomId);
            break;

          case "chat":
            broadcast(parsed.payload.roomId, {
              type: "chat",
              payload: {
                message: parsed.payload.message,
                userName: parsed.payload.userName,
                avatar: parsed.payload.avatar,
                timestamp: new Date().toISOString(),
              },
            });
            break;

          case "typing":
            broadcast(parsed.payload.roomId, {
              type: "typing",
              payload: { userName: parsed.payload.userName },
            }, socket);
            break;
        }
      } catch (err) {
        console.error("Invalid message:", err);
      }
    });

    socket.on("close", () => {
      users = users.filter((u) => u.socket !== socket);
    });
  });
};

function broadcast(roomId: string, message: any, excludeSocket?: WebSocket) {
  users.forEach((u) => {
    if (u.room === roomId && u.socket !== excludeSocket) {
      u.socket.send(JSON.stringify(message));
    }
  });
}

function broadcastUserList(roomId: string) {
  const roomUsers = users
    .filter((u) => u.room === roomId)
    .map((u) => ({ userName: u.userName, avatar: u.avatar }));

  broadcast(roomId, {
    type: "participants",
    payload: roomUsers,
  });
}
