
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface KnowledgeListProps {
  knowledgeBase: any[];
  onEdit: (knowledge: any) => void;
  onDelete: (knowledgeId: string) => void;
}

export const KnowledgeList: React.FC<KnowledgeListProps> = ({
  knowledgeBase,
  onEdit,
  onDelete
}) => {
  return (
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
                    onClick={() => onEdit(knowledge)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(knowledge.id)}
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
  );
};
