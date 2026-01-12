"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import "./globals.css";

const BACKEND_URL = "http://localhost:3001";

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);

  const [messages, setMessages] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [userName, setUserName] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  const [helloResponse, setHelloResponse] = useState("");
  const [httpMessageInput, setHttpMessageInput] = useState("");
  const [httpStatus, setHttpStatus] = useState("");

  // 🔥 Load chat history + connect socket
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/message/history`);
        const data = await res.json();
        const formatted = data.map(
          (msg: any) => `[${msg.user}] -> ${msg.content}`
        );
        setMessages(formatted);
      } catch (err) {
        console.error("History load failed", err);
      }
    };

    fetchHistory();

    const newSocket = io(BACKEND_URL);

    newSocket.on("connect", () => {
      console.log("Connected:", newSocket.id);
    });

    newSocket.on("room", (data: string) => {
      setMessages((prev) => [...prev, data]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleJoinChat = () => {
    if (!socket || !userName) return;
    socket.emit("setName", userName);
    setIsJoined(true);
  };

  const handleSendChatMessage = () => {
    if (!socket || !chatInput) return;
    socket.emit("customName", chatInput);
    setChatInput("");
  };

  const getHello = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/message`);
      const data = await res.text();
      setHelloResponse(data);
    } catch {
      setHelloResponse("GET request failed");
    }
  };

  const sendViaHttp = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/message/send-http`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: httpMessageInput }),
      });
      const data = await res.text();
      setHttpStatus(data);
      setHttpMessageInput("");
    } catch {
      setHttpStatus("POST failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
        NestJS + Next.js Real-time Dashboard
      </h1>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* HTTP Panel */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">HTTP API</h2>

          <button onClick={getHello} className="btn-blue">
            Call GET
          </button>

          <p className="mt-2">{helloResponse}</p>

          <div className="mt-6 flex gap-2">
            <input
              value={httpMessageInput}
              onChange={(e) => setHttpMessageInput(e.target.value)}
              className="input"
              placeholder="Send via HTTP..."
            />
            <button onClick={sendViaHttp} className="btn-green">
              Send
            </button>
          </div>

          <p className="mt-2 text-sm text-gray-500">{httpStatus}</p>
        </div>

        {/* Chat Panel */}
        <div className="bg-white p-6 rounded shadow flex flex-col h-[500px]">
          <h2 className="text-xl font-semibold mb-4">Chat</h2>

          {!isJoined ? (
            <div className="flex flex-col items-center justify-center flex-1">
              <input
                className="input mb-4"
                placeholder="Your name..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <button onClick={handleJoinChat} className="btn-purple">
                Join
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto border p-3 mb-3 bg-gray-50">
                {messages.map((m, i) => (
                <div key={i} className="message">
                    {m}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  className="input"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                />
                <button onClick={handleSendChatMessage} className="btn-purple">
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
