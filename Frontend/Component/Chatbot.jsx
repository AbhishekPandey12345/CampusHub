import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import run  from './Chat.js';
import StartChat  from './Chat.js';
const ChatBubble = () => {
  const initialMessage = {
    text: "👋 Hi! I'm your chat assistant. How can I help you today?",
    isBot: true
  };

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([initialMessage]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Enhanced scroll to bottom function
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll when messages change or chat opens
  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;
    
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputMessage, isBot: false },
    ]);

    async function get() {
      try {
        const randomResponse = await run(inputMessage);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: randomResponse, isBot: true },
        ]);
      } catch (error) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { 
            text: "I apologize, but I encountered an error. Please try again.", 
            isBot: true 
          },
        ]);
      }
    }

    get();
    setInputMessage("");
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true) && StartChat}
          className="group rounded-full w-16 h-16 bg-blue-500 text-white shadow-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-300 animate-bounce"
        >
          <MessageCircle className="h-6 w-6 animate-pulse" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-ping" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full" />
          <span className="sr-only">Open chat</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-0 right-0 h-full w-full sm:h-[80vh] sm:w-[40vw] md:w-[40vw] bg-white shadow-xl flex flex-col rounded-t-lg">
          <div className="border-b flex flex-row items-center justify-between p-4">
            <div className="flex flex-col">
              <h2 className="text-lg font-bold">Chat Assistant</h2>
              <p className="text-sm text-green-500">online</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 hover:bg-gray-200"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close chat</span>
            </button>
          </div>
          <div 
            ref={chatContainerRef}
            className="flex-grow overflow-y-auto p-4 space-y-4 scroll-smooth"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isBot ? "justify-start" : "justify-end"} items-start space-x-2`}
              >
                {message.isBot && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-bold">Bot</span>
                  </div>
                )}
                <div
                  className={`rounded-lg p-3 max-w-[70%] ${message.isBot ? "bg-gray-200 text-gray-800" : "bg-blue-500 text-white"}`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} className="h-1" />
          </div>
          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-grow border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="rounded-full bg-blue-500 text-white p-2 hover:bg-blue-600 transition-colors"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;