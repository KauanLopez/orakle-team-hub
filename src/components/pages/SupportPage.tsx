
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const SupportPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Suporte AI</h1>
        <p className="text-slate-600 mt-1">Chat inteligente para suas dúvidas</p>
      </div>

      <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <h3 className="text-lg font-semibold text-slate-600 mb-2">
            Funcionalidade em Desenvolvimento
          </h3>
          <p className="text-slate-500">
            Esta página será implementada em breve com um chat de suporte inteligente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
