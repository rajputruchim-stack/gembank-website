
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { GoogleGenAI, Chat } from '@google/genai';
import { useLanguage } from '../contexts/LanguageContext';

// IMPORTANT: This key is managed externally and should not be modified.
const API_KEY = process.env.API_KEY;

interface Message {
  role: 'user' | 'model';
  text: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      // Re-initialize chat if it doesn't exist or if the system instruction has changed
      try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const chatSession = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: t('chatbot.systemInstruction'),
          },
        });
        setChat(chatSession);
        setMessages([{ role: 'model', text: t('chatbot.greeting') }]);
      } catch (error) {
        console.error("Failed to initialize AI chat:", error);
        setMessages([{ role: 'model', text: t('chatbot.connectError') }]);
      }
    }
  }, [isOpen, t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chat || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({ message: input });
      const modelMessage: Message = { role: 'model', text: response.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      const errorMessage: Message = { role: 'model', text: t('chatbot.sendError') };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-sky-600 text-white p-4 rounded-full shadow-lg hover:bg-sky-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 z-20"
        aria-label={t('chatbot.open')}
      >
        <MessageSquare size={24} />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-sm h-[70vh] max-h-[600px] flex flex-col bg-white rounded-lg shadow-2xl border border-slate-200 z-20 fade-in-late">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div className="flex items-center">
              <Bot className="h-6 w-6 text-sky-600 mr-2" />
              <h3 className="font-bold text-lg text-slate-900">{t('chatbot.title')}</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-900">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center flex-shrink-0">
                      <Bot size={20} className="text-white" />
                    </div>
                  )}
                  <div className={`px-4 py-2 rounded-lg max-w-[80%] ${
                    msg.role === 'model'
                      ? 'bg-slate-100 text-slate-800'
                      : 'bg-sky-600 text-white'
                  }`}>
                    <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }}></p>
                  </div>
                   {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center flex-shrink-0">
                      <User size={20} className="text-slate-800" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center flex-shrink-0">
                      <Bot size={20} className="text-white" />
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-slate-100 text-slate-800">
                        <Loader2 className="h-5 w-5 animate-spin"/>
                    </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chatbot.placeholder')}
                className="w-full pl-4 pr-12 py-2 bg-slate-100 text-slate-900 rounded-full border border-slate-300 focus:ring-2 focus:ring-sky-600 focus:border-sky-600 outline-none"
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading || !input.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 bg-sky-600 text-white rounded-full p-2 hover:bg-sky-700 disabled:bg-slate-500 disabled:cursor-not-allowed">
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;