import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatbotPopupProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function ChatbotPopup({ isOpen, setIsOpen }: ChatbotPopupProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your car shopping assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: inputValue }),
      });

      const data = await response.json();

      let botText = data.answer;

      // Add hyperlink to first car if available
      if (data.relevant_cars && data.relevant_cars.length > 0) {
        const firstCar = data.relevant_cars[0];
        const carLink = `http://localhost:3000/car/${firstCar.hack_id})`;
        
        botText += `\n\n🚗 [${firstCar.hack_id}](${carLink})\n${firstCar.description}`;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed right-6 z-[9999] bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700 rounded-2xl shadow-2xl shadow-primary/20 flex flex-col"
      style={{
        width: "400px",
        height: "600px",
        bottom: "90px",
        maxHeight: "calc(100vh - 110px)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gradient-to-r from-primary/20 to-primary/10 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
          </div>
          <div>
            <h3 className="text-white font-semibold italic" style={{ fontFamily: 'Saira, sans-serif' }}>
              Car Assistant
            </h3>
            <p className="text-xs text-gray-400 italic">Online now</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
          key={message.id}
          className={`flex w-full ${
            message.sender === "user" ? "justify-end text-right" : "justify-start text-left"
          }`}
        >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-primary to-primary/80 text-white"
                  : "bg-gray-800 text-gray-200 border border-gray-700"
              }`}
            >
              <div className="text-sm italic whitespace-pre-line">
                {message.text.split(/(\[.*?\]\(.*?\))/).map((part, idx) => {
                  const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
                  if (linkMatch) {
                    return (
                      <a
                        key={idx}
                        href={`${linkMatch[2]})`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 underline font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        {linkMatch[1]}
                      </a>
                    );
                  }
                  return <span key={idx}>{part}</span>;
                })}
              </div>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700 bg-gray-900/95 backdrop-blur-sm">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white text-sm italic placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white rounded-xl px-4 py-2 transition-all shadow-lg shadow-primary/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}