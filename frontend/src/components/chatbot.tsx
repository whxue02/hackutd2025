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
      style={{
        position: 'fixed',
        right: '24px',
        bottom: '90px',
        zIndex: 9999,
        width: '400px',
        height: '600px',
        maxHeight: 'calc(100vh - 110px)',
        background: '#fdfdfd',
        border: '1px solid rgba(0,0,0,0.06)',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        background: 'rgba(139,21,56,0.05)',
        borderRadius: '24px 24px 0 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#8b1538',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(139,21,56,0.3)'
          }}>
            <MessageCircle style={{ width: '20px', height: '20px', color: 'white' }} />
          </div>
          <div>
            <h3 style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: '700',
              color: '#1a1a1a'
            }}>
              Car Assistant
            </h3>
            <p style={{
              margin: 0,
              fontSize: '12px',
              color: '#666'
            }}>
              Online now
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#666',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s'
          }}
        >
          <X style={{ width: '20px', height: '20px' }} />
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: message.sender === "user" ? 'flex-end' : 'flex-start',
              textAlign: message.sender === "user" ? 'right' : 'left'
            }}
          >
            <div
              style={{
                maxWidth: '75%',
                borderRadius: '16px',
                padding: '12px 16px',
                background: message.sender === "user"
                  ? '#8b1538'
                  : 'rgba(0,0,0,0.04)',
                color: message.sender === "user" ? 'white' : '#1a1a1a',
                border: message.sender === "user" 
                  ? 'none' 
                  : '1px solid rgba(0,0,0,0.06)',
                boxShadow: message.sender === "user"
                  ? '0 2px 8px rgba(139,21,56,0.3)'
                  : '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{
                fontSize: '14px',
                whiteSpace: 'pre-line',
                lineHeight: '1.5'
              }}>
                {message.text.split(/(\[.*?\]\(.*?\))/).map((part, idx) => {
                  const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
                  if (linkMatch) {
                    return (
                      <a
                        key={idx}
                        href={`${linkMatch[2]})`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: message.sender === "user" ? 'white' : '#8b1538',
                          textDecoration: 'underline',
                          fontWeight: '600',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {linkMatch[1]}
                      </a>
                    );
                  }
                  return <span key={idx}>{part}</span>;
                })}
              </div>
              <span style={{
                fontSize: '11px',
                opacity: 0.7,
                marginTop: '4px',
                display: 'block'
              }}>
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
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              background: 'rgba(0,0,0,0.04)',
              border: '1px solid rgba(0,0,0,0.06)',
              borderRadius: '16px',
              padding: '12px 16px'
            }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    background: '#999',
                    borderRadius: '50%',
                    animation: 'bounce 1.4s infinite ease-in-out both'
                  }}
                ></div>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    background: '#999',
                    borderRadius: '50%',
                    animation: 'bounce 1.4s infinite ease-in-out both',
                    animationDelay: '0.16s'
                  }}
                ></div>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    background: '#999',
                    borderRadius: '50%',
                    animation: 'bounce 1.4s infinite ease-in-out both',
                    animationDelay: '0.32s'
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        background: '#fdfdfd'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            style={{
              flex: 1,
              background: 'rgba(0,0,0,0.02)',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#1a1a1a',
              fontSize: '14px',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          <button
            onClick={handleSendMessage}
            style={{
              background: '#8b1538',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(139,21,56,0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(139,21,56,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(139,21,56,0.3)';
            }}
          >
            <Send style={{ width: '16px', height: '16px', color: 'white' }} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}