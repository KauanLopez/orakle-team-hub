
import React from 'react';
import { Bot, User } from 'lucide-react';
import { MessageRating } from './MessageRating';

interface ChatMessageProps {
  message: {
    id: string;
    type: 'user' | 'bot';
    content: string;
    timestamp: string;
    canRate?: boolean;
    rating?: 'useful' | 'not_useful';
  };
  onRate: (messageId: string, rating: 'useful' | 'not_useful') => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onRate }) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] p-3 rounded-lg ${
          message.type === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-white text-slate-800 border'
        }`}
      >
        <div className="flex items-start space-x-2">
          {message.type === 'bot' && (
            <Bot className="h-5 w-5 text-blue-500 mt-0.5" />
          )}
          {message.type === 'user' && (
            <User className="h-5 w-5 text-white mt-0.5" />
          )}
          <div className="flex-1">
            <p className="text-sm">{message.content}</p>
            <p className={`text-xs mt-1 ${
              message.type === 'user' ? 'text-blue-100' : 'text-slate-500'
            }`}>
              {formatTime(message.timestamp)}
            </p>
          </div>
        </div>
        
        {message.type === 'bot' && message.canRate && (
          <MessageRating onRate={(rating) => onRate(message.id, rating)} />
        )}
        
        {message.rating && (
          <div className="mt-2 pt-2 border-t border-slate-200">
            <span className="text-xs text-green-600">
              Obrigado pelo feedback!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
