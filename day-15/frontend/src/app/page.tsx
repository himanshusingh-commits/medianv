"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

const BACKEND_URL = "http://localhost:3001";

interface Message {
  id?: number;
  user: string;
  content: string;
  timestamp?: string;
}

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // User Info
  const [userName, setUserName] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  
  // Inputs
  const [chatInput, setChatInput] = useState("");
  const [httpInput, setHttpInput] = useState("");
  const [webhookJson, setWebhookJson] = useState('{"name": "himanshu", "amount": 500}');
  const [statusMsg, setStatusMsg] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Database se History Load karo
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/socket/messages`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data); 
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    };
    fetchHistory();

    // 2. Socket Connect karo
    const newSocket = io(BACKEND_URL);

    newSocket.on("connect", () => {
      console.log("Connected with ID:", newSocket.id);
      
      // --- FIX: Check LocalStorage for saved name ---
      const savedName = localStorage.getItem("chatUserName");
      if (savedName) {
        setUserName(savedName); // State update
        newSocket.emit("setName", savedName); // Server ko batao
        setIsJoined(true); // UI change karo
      }
    });

    newSocket.on("room", (dataString: string) => {
      const isSystem = !dataString.includes("->");
      const newMessage: Message = {
        user: isSystem ? "System" : "Live", 
        content: dataString,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, newMessage]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  // --- Actions ---

  const handleJoin = () => {
    if (!userName) return;
    
    // --- FIX: Save Name to LocalStorage ---
    localStorage.setItem("chatUserName", userName);
    
    socket?.emit("setName", userName);
    setIsJoined(true);
  };

  // Logout / Change Name Logic (Optional)
  const handleLogout = () => {
    localStorage.removeItem("chatUserName");
    setIsJoined(false);
    setUserName("");
    window.location.reload(); // Reload to reset socket ID cleanly
  };

  const sendViaSocket = () => {
    if (!chatInput) return;
    socket?.emit("customName", chatInput); 
    setChatInput("");
  };

  const sendViaHttp = async () => {
    if (!httpInput) return;
    try {
      await fetch(`${BACKEND_URL}/socket/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: "HTTP-User", content: httpInput }),
      });
      setHttpInput("");
      setStatusMsg("HTTP Message sent!");
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const triggerWebhook = async () => {
    try {
      const payload = JSON.parse(webhookJson);
      await fetch(`${BACKEND_URL}/socket/webhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatusMsg("Webhook Triggered!");
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (err) {
      alert("Invalid JSON");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-400">
          Super Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
              <h2 className="text-xl font-semibold mb-3 text-green-400">1. HTTP Post</h2>
              <div className="flex gap-2">
                <input
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  placeholder="Message..."
                  value={httpInput}
                  onChange={(e) => setHttpInput(e.target.value)}
                />
                <button onClick={sendViaHttp} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-bold">POST</button>
              </div>
            </div>

            <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
              <h2 className="text-xl font-semibold mb-3 text-pink-400">2. Simulate Webhook</h2>
              <textarea
                className="w-full h-24 bg-gray-700 border border-gray-600 rounded px-3 py-2 font-mono text-sm"
                value={webhookJson}
                onChange={(e) => setWebhookJson(e.target.value)}
              />
              <button onClick={triggerWebhook} className="w-full mt-2 bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded font-bold">Trigger</button>
            </div>
            {statusMsg && <div className="text-blue-200 text-center animate-pulse">{statusMsg}</div>}
          </div>

          {/* RIGHT COLUMN: CHAT */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg border border-gray-700 flex flex-col h-[600px]">
            <div className="p-4 border-b border-gray-700 bg-gray-850 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-indigo-400">Live Monitor</h2>
                <span className="text-xs text-gray-400">
                  {isJoined ? `Connected as: ${userName}` : "Status: Disconnected"}
                </span>
              </div>
              {isJoined && (
                <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300 underline">
                  Change Name
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/20">
              {messages.map((msg, index) => {
                const isSystem = msg.user === "System-Webhook" || msg.content.includes("System-Webhook");
                return (
                  <div key={index} className={`flex flex-col ${isSystem ? "items-center" : "items-start"}`}>
                     {isSystem ? (
                        <div className="bg-pink-900/40 border border-pink-700 text-pink-200 px-4 py-2 rounded-full text-sm">
                          Using Webhook: {msg.content}
                        </div>
                     ) : (
                        <div className="bg-gray-700 text-gray-200 px-4 py-2 rounded-lg max-w-[80%] break-words shadow-sm border border-gray-600">
                          <span className="text-xs text-indigo-300 font-bold block mb-1">
                            {msg.user === "Live" ? "Notification" : msg.user}
                          </span>
                          {msg.content}
                        </div>
                     )}
                  </div>
                )
              })}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-gray-850 border-t border-gray-700">
              {!isJoined ? (
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    placeholder="Enter your name to chat..."
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <button onClick={handleJoin} className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded font-bold">Join</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    placeholder="Type a socket message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendViaSocket()}
                  />
                  <button onClick={sendViaSocket} className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded font-bold">Send</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
