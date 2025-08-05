import { WebSocket } from "ws";

export interface User {
  socket: WebSocket;
  room: string;
  userName: string;
  avatar: string;
}

export interface MessagePayload {
  type: string;
  payload: any;
}
