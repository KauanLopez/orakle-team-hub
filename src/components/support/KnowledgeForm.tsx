
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface KnowledgeFormProps {
  editingKnowledge: any;
  newKnowledge: {
    keywords: string;
    answer: string;
  };
  setNewKnowledge: (knowledge: { keywords: string; answer: string }) => void;
  onAdd: () => void;
  onUpdate: () => void;
  onCancel: () => void;
}

export const KnowledgeForm: React.FC<KnowledgeFormProps> = ({
  editingKnowledge,
  newKnowledge,
  setNewKnowledge,
  onAdd,
  onUpdate,
  onCancel
}) => {
  return (
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
            <Button onClick={editingKnowledge ? onUpdate : onAdd}>
              {editingKnowledge ? 'Atualizar' : 'Adicionar'}
            </Button>
            {editingKnowledge && (
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
