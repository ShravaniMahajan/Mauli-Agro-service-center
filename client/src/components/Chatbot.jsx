import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

// Agricultural Knowledge Base
const KNOWLEDGE_BASE = [
  {
    keywords: ["seed", "seeds", "wheat", "rice", "soybean", "cotton", "बियाणे", "गहू", "तांदूळ", "सोयाबीन", "कापूस", "पेरणी"],
    reply: `🌾 **Recommended Quality Seeds at Smart Krushi:**\n• **Wheat:** Super Hybrid Wheat SH-40 (high yield, rust-resistant).\n• **Soybean:** JS-335 & DS-228 (drought tolerant, 50% protein).\n• **Rice:** Premium Basmati Pusa-1121 & Indrayani.\n• **Cotton:** Bollgard-II Hybrid Cotton Seeds.\n\nAll seeds are government-certified with >95% germination rate. Check our **Products** tab to order with home delivery!`
  },
  {
    keywords: ["fertilizer", "fertilizers", "npk", "urea", "dap", "potash", "compost", "खत", "खते", "युरिया", "डीएपी", "सेंद्रिय"],
    reply: `🧪 **Fertilizer Application Guide:**\n• **Basal Dose:** Apply DAP (18:46:0) and MOP (Potash) during sowing.\n• **Vegetative Growth:** Top-dress with Urea in 2 split doses with irrigation.\n• **Foliar Spray:** 19:19:19 or 12:61:0 water-soluble fertilizer for rapid boost.\n• **Organic Option:** Use Vermicompost (2 tons/acre) to restore soil fertility.\n\nBrowse our **Fertilizers** section in the store for genuine certified bags!`
  },
  {
    keywords: ["pest", "pests", "insect", "insects", "fungus", "disease", "worm", "कीटक", "अळी", "मावा", "तुडतुडे", "बुरशी", "रोग", "औषध"],
    reply: `🐛 **Pest & Disease Management:**\n• **Sucking Pests (Aphids/Thrips):** Spray Imidacloprid 17.8% SL (0.5ml/L) or Organic Neem Oil 10000 PPM (2ml/L).\n• **Caterpillars / Stem Borer:** Spray Emamectin Benzoate 5% SG (0.5g/L).\n• **Fungal Blight / Rust:** Use Mancozeb 75% WP or Carbendazim 50% WP (2g/L).\n\nAlways spray early morning or late evening for best results!`
  },
  {
    keywords: ["order", "shipping", "delivery", "track", "cod", "payment", "ऑर्डर", "डिलिव्हरी", "पेमेंट", "पत्ता"],
    reply: `📦 **Orders & Delivery Information:**\n• **Delivery Time:** 2 to 4 business days across Maharashtra & nearby regions.\n• **Payment Methods:** Cash on Delivery (COD) and Online Payment (UPI / Cards).\n• **Track Order:** Check your **User Panel ➔ Order History** tab to view your live order status and items!`
  },
  {
    keywords: ["contact", "phone", "call", "help", "address", "location", "दुकान", "संपर्क", "फोन", "पत्ता"],
    reply: `📞 **Mauli Agro Service Center Contact:**\n• **Helpline:** +91 95794 70744 / +91 98765 43210\n• **Store Location:** Plot 14, Main Road, Aitawade Budruk, Sangli, MH - 415401\n• **Timings:** Monday - Sunday: 8:00 AM to 8:30 PM\n• **Agronomist Support:** Available on-call for field visits!`
  },
  {
    keywords: ["price", "discount", "offer", "cost", "किंमत", "भाव", "सवलत"],
    reply: `🏷️ **Current Store Offers:**\n• Up to **20% OFF** on bulk seed bookings.\n• Special combo discounts on NPK micronutrient packs.\n• **Free delivery** on orders above ₹1,500!\nVisit our **Products** catalog to view wholesale prices.`
  },
  {
    keywords: ["hi", "hello", "hey", "namaste", "namaskar", "हाय", "हॅलो", "नमस्कार"],
    reply: `Namaste! 🙏 Welcome to Smart Krushi Assistant. I can help you with:\n1. Seed variety recommendations\n2. Fertilizer dosage & timing\n3. Pest & crop disease remedies\n4. Order tracking & store inquiries\n\nWhat crop or query would you like help with?`
  }
];

function getBotReply(userQuery) {
  const query = userQuery.toLowerCase().trim();

  for (const item of KNOWLEDGE_BASE) {
    if (item.keywords.some((kw) => query.includes(kw))) {
      return item.reply;
    }
  }

  return `Thank you for your question! 🌾 For detailed diagnosis on "${userQuery}", our senior agronomist is available at **+91 95794 70744**.\n\nYou can also browse our **Products** page for certified seeds, fertilizers, and plant protection medicines.`;
}

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Namaste! 🙏 I am Krushi AI Assistant. How can I help you with your crops, seeds, fertilizers, or orders today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const chatEndRef = useRef(null);

  const quickChips = [
    { label: "🌾 Best Seeds", query: "What are the best seeds for farming?" },
    { label: "🧪 Fertilizer Guide", query: "Guide me on fertilizers and NPK doses" },
    { label: "🐛 Pest Control", query: "How to protect crops from pests and insects?" },
    { label: "📦 Order & Shipping", query: "How does delivery and payment work?" },
    { label: "📞 Contact Center", query: "How do I contact Mauli Agro center?" }
  ];

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, isTyping]);

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking and reply
    setTimeout(() => {
      const botReply = getBotReply(query);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      if (!isOpen) setUnreadCount((c) => c + 1);
    }, 700);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: 'Chat cleared! 🌿 How else can I assist your farming today?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="chatbot-wrapper">
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <span className="chatbot-avatar-icon">🌾</span>
              <div>
                <h4>Krushi AI Assistant</h4>
                <span className="chatbot-status-online">● Online | Farming Expert</span>
              </div>
            </div>
            <div className="chatbot-header-actions">
              <button
                className="chatbot-clear-btn"
                onClick={handleClearChat}
                title="Clear Conversation"
              >
                🔄
              </button>
              <button
                className="chatbot-close-btn"
                onClick={() => setIsOpen(false)}
                title="Close Chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="chatbot-chips-bar">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                className="chatbot-chip"
                onClick={() => handleSend(chip.query)}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="chatbot-body">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`}
              >
                {msg.sender === 'bot' && <span className="chat-mini-avatar">🌱</span>}
                <div className={`chat-bubble ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}>
                  <div className="chat-bubble-text">
                    {msg.text.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </div>
                  <span className="chat-time">{msg.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-bubble-row bot-row">
                <span className="chat-mini-avatar">🌱</span>
                <div className="chat-bubble bot-msg typing-bubble">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Ask about seeds, fertilizers, pests..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <button
              className="chatbot-send-btn"
              onClick={() => handleSend()}
              disabled={!input.trim()}
              title="Send message"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button with Unread Badge */}
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with Krushi AI Assistant"
      >
        💬
        {unreadCount > 0 && <span className="chatbot-unread-badge">{unreadCount}</span>}
      </button>
    </div>
  );
}

export default Chatbot;

