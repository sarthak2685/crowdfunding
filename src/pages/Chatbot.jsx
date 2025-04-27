import React, { useState } from "react";
import axios from "axios";
import { FaUser, FaTimes } from "react-icons/fa"; // Or your custom icon import
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineChatAlt } from "react-icons/hi";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // for toggle
  const [errorMessage, setErrorMessage] = useState(""); // To store error message

  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, newUserMessage]);
    setInput("");
    setLoading(true);

    const token = localStorage.getItem("token");

    // If no token is found, display login prompt
    if (!token) {
      const botMessage = { sender: "bot", text: "Please log in to continue." };
      setMessages(prev => [...prev, botMessage]);
      setLoading(false); // Stop loading animation
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/chatbot/chatbot`,
        { message: input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const botMessage = { sender: "bot", text: res.data.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage = { sender: "bot", text: "Sorry, something went wrong. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chatbot Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          className="bg-green-700 hover:bg-green-900 text-white p-4 rounded-full shadow-lg transition-all"
          onClick={() => setIsOpen(true)}
        >
          {/* Change the icon to match the one from your landing page */}
          <HiOutlineChatAlt size={24} className="text-white" /> {/* Replace HiOutlineChatAlt with your custom icon if needed */}
        </button>
      </div>

      {/* Chatbot Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-20 right-6 w-80 h-[500px] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-700 to-green-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <HiOutlineChatAlt className="text-white" /> Crowdfunding Assistant
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">
                <FaTimes size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-start max-w-[75%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                    <div className="p-1">
                      {msg.sender === "user" ? (
                        <FaUser className="text-blue-500" />
                      ) : (
                        <HiOutlineChatAlt className="text-green-700" />
                      )}
                    </div>
                    <div className={`rounded-2xl p-2 text-sm ${msg.sender === "user" ? "bg-blue-100" : "bg-green-100"} shadow`}>
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Loader */}
              {loading && (
                <div className="flex items-center gap-2 p-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-700 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-700 rounded-full animate-bounce delay-150"></div>
                    <div className="w-2 h-2 bg-green-700 rounded-full animate-bounce delay-300"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex items-center p-3 bg-white border-t">
              <input
                type="text"
                className="flex-1 border rounded-full p-2 text-sm outline-none focus:ring-2 focus:ring-green-700"
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                className="ml-2 bg-green-700 hover:bg-green-900 text-white p-2 rounded-full"
                onClick={handleSend}
                disabled={loading}
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
