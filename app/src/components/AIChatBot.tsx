import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    text: "Hello! I'm your Rochester Car Rental assistant. How can I help you today?",
    sender: 'bot',
    timestamp: new Date(),
  },
];

const BOT_RESPONSES: Record<string, string> = {
  'hello': "Hi there! Welcome to Rochester Car Rental. I can help you with booking, fleet information, pricing, or any questions about our service!",
  'hi': "Hello! How can I assist you with your car rental needs today?",
  'price': "Our vehicles range from $45/day for economy cars to $120/day for luxury vehicles. Would you like to see our full fleet with pricing?",
  'pricing': "Our vehicles range from $45/day for economy cars to $120/day for luxury vehicles. Would you like to see our full fleet with pricing?",
  'book': "I'd be happy to help you book! You can click 'Book Your Vehicle' to get started with our matching questionnaire, or browse our fleet directly.",
  'booking': "I'd be happy to help you book! You can click 'Book Your Vehicle' to get started with our matching questionnaire, or browse our fleet directly.",
  'fleet': "We have 30+ vehicles including economy cars, SUVs, luxury vehicles, and electric options. Would you like to view our full fleet?",
  'cars': "We have 30+ vehicles including economy cars, SUVs, luxury vehicles, and electric options. Would you like to view our full fleet?",
  'suv': "We have several SUVs available including the Ford Escape ($65/day) and Chevrolet Tahoe ($95/day). Would you like more details?",
  'luxury': "Our luxury fleet includes the BMW 5 Series at $120/day. Perfect for business travelers and special occasions!",
  'electric': "We have the Tesla Model 3 available at $85/day with Autopilot and supercharging capabilities!",
  'location': "We serve Rochester Hills, DTW Airport, and the entire Metro Detroit area. We deliver directly to your terminal!",
  'delivery': "Yes! We offer free delivery to DTW Airport and surrounding areas. We'll meet you right at your terminal.",
  'contact': "You can reach us at admin@rochester.rentals or message us on Turo. We're here to help!",
  'email': "Our contact email is admin@rochester.rentals. We'd love to hear from you!",
  'hours': "We're available 24/7 for vehicle pickup and drop-off. Our team is always ready to assist you!",
  'cancel': "We offer flexible cancellation policies. You can cancel up to 24 hours before your booking for a full refund.",
  'insurance': "All our rentals include basic insurance coverage. Additional coverage options are available during booking.",
  'payment': "We accept all major credit cards. Payment is processed securely through our platform.",
  'turo': "You can also book through our Turo profile! We have a 5.0 rating as a Power Host with over 1,277 trips completed.",
};

function generateBotResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  // Check for keyword matches
  for (const [keyword, response] of Object.entries(BOT_RESPONSES)) {
    if (lowerMessage.includes(keyword)) {
      return response;
    }
  }
  
  // Default responses
  const defaultResponses = [
    "I'm not sure I understand. Could you rephrase that? I can help with booking, pricing, fleet info, or general questions.",
    "I can help you with that! Would you like to browse our fleet or get help with booking a vehicle?",
    "For the best assistance, you can browse our fleet, use our booking questionnaire, or contact us directly at admin@rochester.rentals.",
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(userMessage.text),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-[200] w-14 h-14 bg-gold rounded-full flex items-center justify-center shadow-lg hover:bg-gold-light transition-all duration-300 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageCircle size={24} className="text-charcoal" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[200] w-[380px] h-[500px] bg-charcoal-light rounded-lg shadow-2xl border border-white/10 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
          {/* Header */}
          <div className="bg-gold px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-charcoal" />
              <span className="font-semibold text-charcoal text-sm">Rental Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-charcoal/70 hover:text-charcoal transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'bot' ? 'bg-gold/20' : 'bg-white/10'
                }`}>
                  {message.sender === 'bot' ? (
                    <Bot size={14} className="text-gold" />
                  ) : (
                    <User size={14} className="text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                    message.sender === 'bot'
                      ? 'bg-white/10 text-white'
                      : 'bg-gold text-charcoal'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                  <Bot size={14} className="text-gold" />
                </div>
                <div className="bg-white/10 px-3 py-2 rounded-lg flex items-center gap-1">
                  <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-charcoal border border-white/10 rounded px-3 py-2 text-white text-sm placeholder:text-[#A6AAB4] focus:border-gold focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="w-10 h-10 bg-gold rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold-light transition-colors"
              >
                <Send size={16} className="text-charcoal" />
              </button>
            </div>
            <p className="text-[10px] text-[#A6AAB4] mt-2 text-center">
              AI Assistant • Powered by Rochester Rentals
            </p>
          </div>
        </div>
      )}
    </>
  );
}
