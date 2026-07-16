import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, X, SendHorizontal, MessageSquare } from 'lucide-react';
import './FloatingWidgets.css';

const WHATSAPP_NUMBER = '61480899936';
const TELEGRAM_LINK = 'https://t.me/cnvapesaustralia';

const FloatingWidgets = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      text: 'Hi there! Welcome to CNVapes Australia. 👋 How can we help you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Monitor scroll for Scroll-to-Top visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getAutoResponse = (text) => {
    const query = text.toLowerCase();
    if (query.includes('price') || query.includes('cost') || query.includes('cheap') || query.includes('discount')) {
      return "All our prices are in AUD. We offer bulk discounts: 5% off for 7+ units, 10% off for 11+ units, and 15% off for 51+ units! Check our Shop page for prices.";
    }
    if (query.includes('shipping') || query.includes('delivery') || query.includes('time') || query.includes('post')) {
      return "We deliver Australia-wide via Australia Post. Shipping is AUD $20 for orders under 5 units, and FREE if you buy 5 or more units! Delivery typically takes 5-8 business days.";
    }
    if (query.includes('authentic') || query.includes('real') || query.includes('genuine') || query.includes('original')) {
      return "Yes! All our vapes (IGET, Geek Bar, Vozol, etc.) are 100% authentic and sourced directly from official manufacturer lines.";
    }
    if (query.includes('refund') || query.includes('protect') || query.includes('lost') || query.includes('customs')) {
      return "We provide 100% Delivery Protection. If your order is lost, seized, or not delivered for any reason, we will issue a full refund or free reshipment!";
    }
    if (query.includes('pay') || query.includes('card') || query.includes('bank') || query.includes('payid')) {
      return "We accept Credit/Debit Cards directly on the website, as well as Bank Transfer and PayID. For Bank Transfer/PayID details, please contact us on WhatsApp!";
    }
    return "Thank you for reaching out! A representative will get back to you shortly. For instant support and payment confirmation, please click the green WhatsApp icon to chat with us.";
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = {
      id: chatMessages.length + 1,
      sender: 'user',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const currentInput = inputMessage;
    setInputMessage('');

    // Simulate agent typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const agentMsg = {
        id: chatMessages.length + 2,
        sender: 'agent',
        text: getAutoResponse(currentInput),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, agentMsg]);
    }, 1200);
  };

  return (
    <div className="floating-widgets-container">
      {/* Scroll to Top Widget */}
      <button
        className={`widget-btn scroll-top-btn ${showScrollTop ? 'visible' : ''}`}
        onClick={handleScrollTop}
        title="Scroll to Top"
      >
        <ArrowUp size={22} />
      </button>

      {/* Telegram Widget */}
      <a
        href={TELEGRAM_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="widget-btn telegram-btn"
        title="Join Telegram Channel"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15.82-.78 4.53-1.09 6.24-.13.72-.4 1.15-.65 1.18-.56.05-1-.38-1.54-.73-.85-.55-1.33-.9-2.15-1.44-.96-.63-.34-1 .21-1.57.14-.15 2.65-2.42 2.7-2.63.01-.03.01-.15-.06-.21-.07-.06-.18-.04-.26-.02-.11.02-1.89 1.2-5.32 3.52-.5.34-.95.51-1.36.5-.45-.01-1.32-.26-1.97-.47-.79-.26-1.42-.4-1.37-.85.03-.23.34-.47.95-.72 3.73-1.62 6.21-2.69 7.45-3.21 3.54-1.49 4.27-1.75 4.75-1.76.11 0 .34.03.49.15.12.1.16.24.18.33.02.1.03.3.01.48z" />
        </svg>
      </a>

      {/* WhatsApp Widget */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C%20I'm%20interested%20in%20ordering%20from%20CNVapes%20Australia.`}
        target="_blank"
        rel="noopener noreferrer"
        className="widget-btn whatsapp-btn"
        title="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.858.002-2.634-1.023-5.11-2.885-6.974C16.526 1.909 14.058.882 11.433.882c-5.445 0-9.87 4.426-9.875 9.866-.001 1.769.467 3.498 1.357 5.022L1.87 20.89l5.378-1.411L6.647 19.16zM17.15 14.4c-.3-.15-1.77-.874-2.046-.973-.27-.1-.47-.15-.66.15-.19.3-.74.925-.91 1.12-.17.195-.34.22-.64.07-.3-.15-1.27-.47-2.42-1.5-1-.89-1.675-2-1.87-2.3-.2-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.66-1.59-.9-2.18-.24-.58-.495-.5-.675-.51-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.11 3.225 5.11 4.525.714.31 1.27.49 1.7.63.72.23 1.375.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z" />
        </svg>
      </a>

      {/* Live Chat Toggle Widget */}
      <button
        className={`widget-btn chat-btn ${isChatOpen ? 'active' : ''}`}
        onClick={() => setIsChatOpen(!isChatOpen)}
        title="Live Chat Support"
      >
        <MessageSquare size={22} />
      </button>

      {/* Chat Simulation Window */}
      {isChatOpen && (
        <div className="chat-window animate-slide-up">
          <div className="chat-header">
            <div className="agent-info">
              <div className="agent-avatar">CN</div>
              <div>
                <p className="agent-name">CNVapes Support</p>
                <p className="agent-status">● Online</p>
              </div>
            </div>
            <button className="chat-close" onClick={() => setIsChatOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="chat-body">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`chat-bubble-container ${msg.sender}`}>
                <div className={`chat-bubble ${msg.sender}`}>
                  <p className="chat-text">{msg.text}</p>
                  <span className="chat-time">{msg.time}</span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-bubble-container agent">
                <div className="chat-bubble agent typing">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chat-footer flex">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="chat-input"
            />
            <button type="submit" className="chat-send-btn">
              <SendHorizontal size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FloatingWidgets;
