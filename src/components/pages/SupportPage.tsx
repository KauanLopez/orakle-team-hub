import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageCircle, Send, ThumbsUp, ThumbsDown, Plus, Edit, Trash2, Bot, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const SupportPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [knowledgeBase, setKnowledgeBase] = useState<any[]>([]);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [editingKnowledge, setEditingKnowledge] = useState<any>(null);
  const [newKnowledge, setNewKnowledge] = useState({
    keywords: '',
    answer: ''
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const canManage = user?.role === 'supervisor' || user?.role === 'administrador';

  useEffect(() => {
    loadKnowledgeBase();
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadKnowledgeBase = () => {
    const knowledge = localStorage.getItem('orakle_ai_knowledge');
    if (knowledge) {
      setKnowledgeBase(JSON.parse(knowledge));
    }
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

  const handleAddKnowledge = () => {
    if (newKnowledge.keywords && newKnowledge.answer) {
      const knowledge = {
        id: Date.now().toString(),
        keywords: newKnowledge.keywords.split(',').map(k => k.trim()),
        answer: newKnowledge.answer
      };
      
      const updatedKnowledge = [...knowledgeBase, knowledge];
      setKnowledgeBase(updatedKnowledge);
      localStorage.setItem('orakle_ai_knowledge', JSON.stringify(updatedKnowledge));
      
      setIsManageModalOpen(false);
      setNewKnowledge({ keywords: '', answer: '' });
      
      toast({
        title: "Conhecimento Adicionado!",
        description: "Nova resposta foi adicionada à base de conhecimento.",
      });
    }
  };

  const handleEditKnowledge = (knowledge: any) => {
    setEditingKnowledge(knowledge);
    setNewKnowledge({
      keywords: knowledge.keywords.join(', '),
      answer: knowledge.answer
    });
  };

  const handleUpdateKnowledge = () => {
    if (newKnowledge.keywords && newKnowledge.answer && editingKnowledge) {
      const updatedKnowledge = knowledgeBase.map(k => 
        k.id === editingKnowledge.id 
          ? {
              ...k,
              keywords: newKnowledge.keywords.split(',').map(k => k.trim()),
              answer: newKnowledge.answer
            }
          : k
      );
      
      setKnowledgeBase(updatedKnowledge);
      localStorage.setItem('orakle_ai_knowledge', JSON.stringify(updatedKnowledge));
      
      setEditingKnowledge(null);
      setNewKnowledge({ keywords: '', answer: '' });
      
      toast({
        title: "Conhecimento Atualizado!",
        description: "A resposta foi atualizada com sucesso.",
      });
    }
  };

  const handleDeleteKnowledge = (knowledgeId: string) => {
    const updatedKnowledge = knowledgeBase.filter(k => k.id !== knowledgeId);
    setKnowledgeBase(updatedKnowledge);
    localStorage.setItem('orakle_ai_knowledge', JSON.stringify(updatedKnowledge));
    
    toast({
      title: "Conhecimento Removido",
      description: "A resposta foi removida da base de conhecimento.",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Suporte AI</h1>
          <p className="text-slate-600 mt-1">Chat inteligente para suas dúvidas</p>
        </div>
        
        {canManage && (
          <Button onClick={() => setIsManageModalOpen(true)} className="bg-blue-500 hover:bg-blue-600">
            <Plus className="h-4 w-4 mr-2" />
            Gerenciar Base de Conhecimento
          </Button>
        )}
      </div>

      {/* Chat Interface */}
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
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
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
                      <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-slate-200">
                        <span className="text-xs text-slate-600">Esta resposta foi útil?</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRateResponse(message.id, 'useful')}
                          className="h-6 w-6 p-0"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRateResponse(message.id, 'not_useful')}
                          className="h-6 w-6 p-0"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
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

      {/* Knowledge Base Management Modal */}
      <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerenciar Base de Conhecimento</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Add New Knowledge */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingKnowledge ? 'Editar Conhecimento' : 'Adicionar Novo Conhecimento'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="keywords">Palavras-chave (separadas por vírgula)</Label>
                    <Input
                      id="keywords"
                      value={newKnowledge.keywords}
                      onChange={(e) => setNewKnowledge({...newKnowledge, keywords: e.target.value})}
                      placeholder="Ex: férias, pedir férias, solicitar férias"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="answer">Resposta</Label>
                    <Textarea
                      id="answer"
                      value={newKnowledge.answer}
                      onChange={(e) => setNewKnowledge({...newKnowledge, answer: e.target.value})}
                      placeholder="Digite a resposta completa..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={editingKnowledge ? handleUpdateKnowledge : handleAddKnowledge}>
                      {editingKnowledge ? 'Atualizar' : 'Adicionar'}
                    </Button>
                    {editingKnowledge && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingKnowledge(null);
                          setNewKnowledge({ keywords: '', answer: '' });
                        }}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Existing Knowledge */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Conhecimento Existente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {knowledgeBase.map((knowledge) => (
                    <div key={knowledge.id} className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2">
                            <strong>Palavras-chave:</strong> {knowledge.keywords.join(', ')}
                          </div>
                          <div>
                            <strong>Resposta:</strong> {knowledge.answer}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditKnowledge(knowledge)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteKnowledge(knowledge.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {knowledgeBase.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      Nenhum conhecimento cadastrado ainda.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
