
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { KnowledgeForm } from './KnowledgeForm';
import { KnowledgeList } from './KnowledgeList';
import { useToast } from '@/hooks/use-toast';

interface KnowledgeManagementProps {
  isOpen: boolean;
  onClose: () => void;
  knowledgeBase: any[];
  setKnowledgeBase: (knowledge: any[]) => void;
}

export const KnowledgeManagement: React.FC<KnowledgeManagementProps> = ({
  isOpen,
  onClose,
  knowledgeBase,
  setKnowledgeBase
}) => {
  const { toast } = useToast();
  const [editingKnowledge, setEditingKnowledge] = useState<any>(null);
  const [newKnowledge, setNewKnowledge] = useState({
    keywords: '',
    answer: ''
  });

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

  const handleCancel = () => {
    setEditingKnowledge(null);
    setNewKnowledge({ keywords: '', answer: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Base de Conhecimento</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <KnowledgeForm
            editingKnowledge={editingKnowledge}
            newKnowledge={newKnowledge}
            setNewKnowledge={setNewKnowledge}
            onAdd={handleAddKnowledge}
            onUpdate={handleUpdateKnowledge}
            onCancel={handleCancel}
          />
          
          <KnowledgeList
            knowledgeBase={knowledgeBase}
            onEdit={handleEditKnowledge}
            onDelete={handleDeleteKnowledge}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
