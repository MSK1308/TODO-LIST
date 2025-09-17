import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Heart, Clock, Lightbulb } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'suggestion' | 'resource';
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your MindCare assistant. I'm here to listen and support you. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    "I'm feeling anxious",
    "I'm having trouble sleeping",
    "I feel overwhelmed",
    "I'm feeling lonely",
    "I need motivation",
    "I'm stressed about work"
  ];

  const responses = {
    greeting: [
      "I'm glad you're here. Remember, it's okay to not be okay sometimes. What's on your mind?",
      "Thank you for reaching out. That takes courage. How can I support you today?",
      "I'm here to listen without judgment. What would you like to talk about?"
    ],
    anxiety: [
      "Anxiety can feel overwhelming, but you're not alone. Try the 5-4-3-2-1 grounding technique: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
      "When anxiety strikes, remember to breathe slowly and deeply. Inhale for 4 counts, hold for 4, and exhale for 6. This activates your body's relaxation response.",
      "Anxiety often comes from worrying about the future. Try to focus on what you can control right now, in this moment."
    ],
    sleep: [
      "Sleep troubles are common when we're stressed. Try creating a bedtime routine: dim lights 1 hour before bed, avoid screens, and consider gentle stretching or meditation.",
      "Good sleep hygiene can help: keep your bedroom cool and dark, avoid caffeine after 2 PM, and try to go to bed at the same time each night.",
      "If your mind is racing, try writing down your worries in a journal before bed. This helps get them out of your head and onto paper."
    ],
    overwhelmed: [
      "Feeling overwhelmed is a sign you're carrying too much. Let's break things down into smaller, manageable pieces. What's the most pressing thing on your mind right now?",
      "When everything feels like a priority, nothing is. Try listing your tasks and identifying just 1-3 that truly need attention today.",
      "Remember: you don't have to do everything perfectly, and you don't have to do it all at once. Progress, not perfection."
    ],
    lonely: [
      "Loneliness can be incredibly painful. You've taken a brave step by reaching out here. Consider calling a friend, joining a community group, or even just going somewhere where there are other people.",
      "Sometimes we feel lonely even when surrounded by others. This feeling is temporary, even though it doesn't feel that way right now. You matter, and you're valued.",
      "Connection doesn't always mean being around people - it can also mean connecting with yourself through journaling, art, or activities you enjoy."
    ],
    motivation: [
      "Motivation often comes after we start, not before. Try committing to just 5 minutes of something meaningful to you. Often, starting is the hardest part.",
      "Remember why you started. What are your values? What kind of person do you want to be? Let those guide your next small step.",
      "It's okay to have days with low motivation. Be kind to yourself, and celebrate small wins. Even getting out of bed counts as an accomplishment."
    ],
    work_stress: [
      "Work stress is incredibly common. Try setting boundaries: when work time ends, transition with a ritual like a short walk or changing clothes.",
      "Remember that your worth isn't defined by your productivity. You're valuable as a person, not just for what you do.",
      "If possible, talk to your supervisor about workload. Many workplace stress issues can be improved with better communication and realistic expectations."
    ],
    default: [
      "I hear you, and what you're experiencing is valid. Sometimes just talking about things can help us see them more clearly.",
      "Thank you for sharing that with me. It sounds like you're going through a challenging time. Remember, seeking help is a sign of strength.",
      "Your feelings are important and deserve attention. Would you like to explore this further, or would you prefer some practical coping strategies?"
    ]
  };

  const getResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('anxious') || message.includes('anxiety') || message.includes('worried') || message.includes('panic')) {
      return responses.anxiety[Math.floor(Math.random() * responses.anxiety.length)];
    }
    if (message.includes('sleep') || message.includes('insomnia') || message.includes('tired') || message.includes('rest')) {
      return responses.sleep[Math.floor(Math.random() * responses.sleep.length)];
    }
    if (message.includes('overwhelmed') || message.includes('too much') || message.includes('stressed')) {
      return responses.overwhelmed[Math.floor(Math.random() * responses.overwhelmed.length)];
    }
    if (message.includes('lonely') || message.includes('alone') || message.includes('isolated')) {
      return responses.lonely[Math.floor(Math.random() * responses.lonely.length)];
    }
    if (message.includes('motivation') || message.includes('unmotivated') || message.includes('give up')) {
      return responses.motivation[Math.floor(Math.random() * responses.motivation.length)];
    }
    if (message.includes('work') || message.includes('job') || message.includes('boss') || message.includes('deadline')) {
      return responses.work_stress[Math.floor(Math.random() * responses.work_stress.length)];
    }
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    }
    
    return responses.default[Math.floor(Math.random() * responses.default.length)];
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: getResponse(text),
      sender: 'bot',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botResponse]);
    setIsTyping(false);
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-blue-100">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-4">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Neurox Support Chat</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            I'm here to listen and provide support. While I can offer coping strategies and a caring ear, 
            please remember that I'm not a replacement for professional therapy.
          </p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' 
                    ? 'bg-blue-600' 
                    : 'bg-gradient-to-r from-green-400 to-blue-500'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className={`rounded-2xl px-4 py-2 ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <div className={`flex items-center space-x-1 mt-1 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <Clock className="h-3 w-3 opacity-50" />
                    <span className="text-xs opacity-75">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white text-gray-900 shadow-sm border border-gray-200 rounded-2xl px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-2 mb-3">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Quick responses:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleQuickReply(reply)}
                className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors border border-blue-200"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(inputText);
            }}
            className="flex space-x-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
        <div className="flex items-start space-x-3">
          <Heart className="h-6 w-6 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-900 mb-2">Important Notice</h4>
            <p className="text-amber-800 text-sm mb-3">
              While I'm here to provide support and coping strategies, I'm not a replacement for professional mental health care. 
              If you're experiencing thoughts of self-harm or suicide, please reach out to emergency services immediately.
            </p>
            <div className="space-y-1 text-sm">
              <p className="text-amber-900 font-medium">Crisis Resources:</p>
              <p className="text-amber-800">• Emergency: 100</p>
              <p className="text-amber-800">• Crisis Text Line: Text HOME to 741741</p>
              <p className="text-amber-800">• National Suicide Prevention Lifeline: 988</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;