
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Minimize2, Maximize2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clinicalApi } from '../../utils/api';
import './ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Xin chào! Tôi là Hậu Anh AI. Tôi có thể hỗ trợ bạn đặt lịch, tra cứu kết quả khám hoặc tư vấn sức khỏe cơ bản. Bạn cần giúp gì?", sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = {
      id: Date.now(),
      text: input,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const history = updatedMessages
          .filter(msg => msg.id !== 1 && msg.id !== userMsg.id) // Filter initial and current
          .map(msg => ({
             role: msg.sender === 'bot' ? 'assistant' : 'user',
             content: msg.text
          }));

      const res = await clinicalApi.chatWithAI({
         message: currentInput,
         history: history.slice(-10) // Send the last 10 messages for context
      });

      const botMsg = {
        id: Date.now() + 1,
        text: res.data.response,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error: ", error);
      const errorMsg = {
        id: Date.now() + 1,
        text: "Xin lỗi, hiện tại tôi không thể kết nối tới hệ thống. Vui lòng thử lại sau.",
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-widget-container">
      {/* Floating Button */}
      <motion.button 
        className={`chat-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && <span className="notification-badge">1</span>}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '60px' : '500px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`chat-window glass ${isMinimized ? 'minimized' : ''}`}
          >
            {/* Header */}
            <div className="chat-header">
              <div className="flex items-center gap-3">
                <div className="bot-avatar">
                  <Bot size={20} />
                  <span className="online-status"></span>
                </div>
                <div>
                  <h4>Hậu Anh AI Assistant</h4>
                  <p>Sẵn sàng hỗ trợ bạn 24/7</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsMinimized(!isMinimized)} className="header-icon-btn">
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="header-icon-btn text-white/50 hover:text-white">
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div className="messages-area">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                      <div className="message-content">
                        {msg.text}
                        <span className="message-time">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="message-wrapper bot">
                      <div className="message-content typing">
                        <span className="dot-typing"></span>
                        <span className="dot-typing"></span>
                        <span className="dot-typing"></span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form className="chat-input-area" onSubmit={handleSend}>
                  <input 
                    type="text" 
                    placeholder="Nhập tin nhắn..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <button type="submit" className="btn-send" disabled={!input.trim()}>
                    <Send size={18} />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidget;
