import { useEffect, useRef, useState } from "react";

interface Message {
  text: string;
  sender: "me" | "others";
}

const ChatRoom = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const roomInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomId, setRoomId] = useState("");
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const connectToRoom = () => {
    const enteredRoom = roomInputRef.current?.value;
    if (!enteredRoom) return;

    const ws = new WebSocket("ws://localhost:5000");

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: enteredRoom,
          },
        })
      );
      setRoomId(enteredRoom);
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "chat") {
          setMessages((prev) => [
            ...prev,
            { text: data.payload.message, sender: "others" },
          ]);
        }
      } catch (error) {
        console.error("Invalid message:", event.data);
      }
    };

    wsRef.current = ws;
  };

  const sendMessage = () => {
    const message = inputRef.current?.value;
    if (message && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          payload: { message },
        })
      );

      setMessages((prev) => [...prev, { text: message, sender: "me" }]);
      //@ts-ignore
      inputRef.current.value = "";
    }
  };

  if (!connected) {
    return (
      <div className="h-screen bg-black text-white flex flex-col justify-center items-center space-y-4">
        <h1 className="text-2xl">Join or Create a Room</h1>
        <input
          ref={roomInputRef}
          type="text"
          className="p-2 border-2 border-white bg-black text-white rounded"
          placeholder="Enter Room ID"
        />
        <button
          onClick={connectToRoom}
          className="bg-purple-600 px-4 py-2 rounded"
        >
          Join Room
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black flex flex-col justify-between">
      <div className="text-white p-4">Room: {roomId}</div>

      <div className="overflow-y-auto p-4 h-[85vh] space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              msg.sender === "me" ? "items-end" : "items-start"
            }`}
          >
            <span
              className={`px-3 py-1 rounded w-fit max-w-[70%] ${
                msg.sender === "me"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white flex p-2">
        <input
          ref={inputRef}
          type="text"
          className="w-[90vw] p-2 border-2 border-gray-300 rounded-md mr-2"
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 text-white p-2 rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
