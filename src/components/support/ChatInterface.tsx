
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { useAuth } from '../../hooks/useFirebaseAuth';
import { useToast } from '@/hooks/use-toast';

interface ChatInterfaceProps {
  knowledgeBase: any[];
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ knowledgeBase }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = () => {
    const history = localStorage.getItem(`orakle_chat_${user?.id}`);
    if (history) {
      setMessages(JSON.parse(history));
    } else {
      // Welcome message
      setMessages([
        {
          id: '1',
          type: 'bot',
          content: 'Olá! Sou o assistente virtual do Orakle. Como posso ajudá-lo hoje?',
          timestamp: new Date().toISOString()
        }
      ]);
    }
  };

  const saveChatHistory = (updatedMessages: any[]) => {
    localStorage.setItem(`orakle_chat_${user?.id}`, JSON.stringify(updatedMessages));
  };

  const findBestAnswer = (question: string) => {
    const questionLower = question.toLowerCase();
    
    for (const knowledge of knowledgeBase) {
      const keywordMatch = knowledge.keywords.some((keyword: string) => 
        questionLower.includes(keyword.toLowerCase())
      );
      
      if (keywordMatch) {
        return knowledge.answer;
      }
    }
    
    return 'Desculpe, não encontrei uma resposta específica para sua pergunta. Você pode tentar reformular ou entrar em contato com seu supervisor para mais informações.';
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: newMessage.trim(),
        timestamp: new Date().toISOString()
      };
      
      const botResponse = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: findBestAnswer(newMessage.trim()),
        timestamp: new Date().toISOString(),
        canRate: true
      };
      
      const updatedMessages = [...messages, userMessage, botResponse];
      setMessages(updatedMessages);
      saveChatHistory(updatedMessages);
      setNewMessage('');
    }
  };

  const handleRateResponse = (messageId: string, rating: 'useful' | 'not_useful') => {
    const updatedMessages = messages.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, rating, canRate: false };
      }
      return msg;
    });
    
    setMessages(updatedMessages);
    saveChatHistory(updatedMessages);
    
    // Save rating for analytics
    const ratings = JSON.parse(localStorage.getItem('orakle_ai_ratings') || '[]');
    ratings.push({
      messageId,
      rating,
      userId: user?.id,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('orakle_ai_ratings', JSON.stringify(ratings));
    
    toast({
      title: "Obrigado pelo feedback!",
      description: "Sua avaliação nos ajuda a melhorar.",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="h-6 w-6 text-blue-500" />
          <span>Chat de Suporte</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Messages */}
          <div className="h-96 overflow-y-auto space-y-4 p-4 bg-slate-50 rounded-lg">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onRate={handleRateResponse}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
