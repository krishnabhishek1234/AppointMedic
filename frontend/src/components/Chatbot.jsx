import React, { useState, useRef } from "react";
import axios from "axios";
import Draggable from "react-draggable";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Minus, X } from "lucide-react";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi, I'm MediBot! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const nodeRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/chat", {
        message: input,
      });
      const botMessage = { from: "bot", text: response.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const botMessage = {
        from: "bot",
        text: "⚠️ Sorry, something went wrong. Please try again later.",
      };
      setMessages((prev) => [...prev, botMessage]);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg z-50"
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <Draggable nodeRef={nodeRef} handle=".chat-header">
            <motion.div
              ref={nodeRef}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-20 right-6 w-80 bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden border border-gray-200 z-40"
            >
              {/* Header */}
              <div className="chat-header bg-primary text-white flex justify-between items-center px-4 py-2 cursor-move select-none">
                <span className="font-semibold">MediBot 💬</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMinimized(!minimized)}
                    className="hover:text-gray-200"
                  >
                    <Minus size={18} />
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="hover:text-gray-200"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              {!minimized && (
                <>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: msg.from === "user" ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`p-2 rounded-lg max-w-[80%] text-sm ${msg.from === "user"
                            ? "bg-blue-100 self-end ml-auto"
                            : "bg-gray-200"
                          }`}
                      >
                        {msg.text}
                      </motion.div>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="flex p-2 border-t bg-white">
                    <input
                      type="text"
                      className="flex-1 border rounded-lg p-2 text-sm focus:outline-none"
                      placeholder="Ask MediBot..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={sendMessage}
                      className="ml-2 bg-primary text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <Send size={18} />
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </Draggable>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
