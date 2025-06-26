
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface MessageRatingProps {
  onRate: (rating: 'useful' | 'not_useful') => void;
}

export const MessageRating: React.FC<MessageRatingProps> = ({ onRate }) => {
  return (
    <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-slate-200">
      <span className="text-xs text-slate-600">Esta resposta foi útil?</span>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onRate('useful')}
        className="h-6 w-6 p-0"
      >
        <ThumbsUp className="h-3 w-3" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onRate('not_useful')}
        className="h-6 w-6 p-0"
      >
        <ThumbsDown className="h-3 w-3" />
      </Button>
    </div>
  );
};
