"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const upload_route_1 = __importDefault(require("./routes/upload.route"));
const socket_1 = require("./websockets/socket");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)({ origin: "http://localhost:5173", credentials: true }));
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static("uploads")); // Static file serving
app.use("/api/upload", upload_route_1.default);
(0, socket_1.setupSocketServer)(server);
server.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});
