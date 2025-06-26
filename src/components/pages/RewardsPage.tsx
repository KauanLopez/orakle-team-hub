
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const RewardsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Premiações</h1>
        <p className="text-slate-600 mt-1">Resgate prêmios com seus pontos</p>
      </div>

      <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <h3 className="text-lg font-semibold text-slate-600 mb-2">
            Funcionalidade em Desenvolvimento
          </h3>
          <p className="text-slate-500">
            Esta página será implementada em breve com todas as premiações disponíveis.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
