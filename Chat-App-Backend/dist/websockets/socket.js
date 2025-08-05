"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketServer = void 0;
const ws_1 = require("ws");
let users = [];
const setupSocketServer = (server) => {
    const wss = new ws_1.WebSocketServer({ server });
    wss.on("connection", (socket) => {
        socket.on("message", (message) => {
            try {
                const parsed = JSON.parse(message.toString());
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
            }
            catch (err) {
                console.error("Invalid message:", err);
            }
        });
        socket.on("close", () => {
            users = users.filter((u) => u.socket !== socket);
        });
    });
};
exports.setupSocketServer = setupSocketServer;
function broadcast(roomId, message, excludeSocket) {
    users.forEach((u) => {
        if (u.room === roomId && u.socket !== excludeSocket) {
            u.socket.send(JSON.stringify(message));
        }
    });
}
function broadcastUserList(roomId) {
    const roomUsers = users
        .filter((u) => u.room === roomId)
        .map((u) => ({ userName: u.userName, avatar: u.avatar }));
    broadcast(roomId, {
        type: "participants",
        payload: roomUsers,
    });
}
