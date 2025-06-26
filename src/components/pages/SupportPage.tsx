
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ChatInterface } from '../support/ChatInterface';
import { KnowledgeManagement } from '../support/KnowledgeManagement';

export const SupportPage: React.FC = () => {
  const { user } = useAuth();
  const [knowledgeBase, setKnowledgeBase] = useState<any[]>([]);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const canManage = user?.role === 'supervisor' || user?.role === 'administrador';

  useEffect(() => {
    loadKnowledgeBase();
  }, []);

  const loadKnowledgeBase = () => {
    const knowledge = localStorage.getItem('orakle_ai_knowledge');
    if (knowledge) {
      setKnowledgeBase(JSON.parse(knowledge));
    }
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

      <ChatInterface knowledgeBase={knowledgeBase} />

      {canManage && (
        <KnowledgeManagement
          isOpen={isManageModalOpen}
          onClose={() => setIsManageModalOpen(false)}
          knowledgeBase={knowledgeBase}
          setKnowledgeBase={setKnowledgeBase}
        />
      )}
    </div>
  );
};
