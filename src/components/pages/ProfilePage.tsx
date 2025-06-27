import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Star, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useFirebaseAuth';
import { useFirestore } from '../../hooks/useFirestore';

export const ProfilePage: React.FC = () => {
  const { user, loading } = useAuth();
  const { data: pointsHistoryData, getByUser } = useFirestore('pointsHistory');

  const pointsHistory = user ? getByUser(user.id).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getPointsIcon = (type: string) => {
    return type === 'gain' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getPointsColor = (type: string) => {
    return type === 'gain' ? 'text-green-600' : 'text-red-600';
  };

  const totalGained = pointsHistory
    .filter(h => h.type === 'gain')
    .reduce((sum, h) => sum + h.points, 0);

  const totalSpent = pointsHistory
    .filter(h => h.type === 'spend')
    .reduce((sum, h) => sum + Math.abs(h.points), 0);

  if (loading || !user) {
    return <div className="text-center text-slate-600">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Perfil</h1>
        <p className="text-slate-600 mt-1">Suas informações e histórico de pontos</p>
      </div>

      {/* Informações do Usuário */}
      <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-6 w-6 text-blue-500" />
            <span>Informações Pessoais</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {user.name.charAt(0)}
              </span>
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-600">Nome</h3>
                  <p className="text-lg font-semibold text-slate-800">{user.name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-slate-600">Cargo</h3>
                  <p className="text-lg font-semibold text-slate-800">{user.position}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-slate-600">Equipe</h3>
                  <p className="text-lg font-semibold text-slate-800">{user.team}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-slate-600">Nome Fictício</h3>
                  <p className="text-lg font-semibold text-purple-600">"{user.ficticiousName}"</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo de Pontos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <Star className="h-12 w-12 text-blue-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-blue-700">{user.points}</h3>
            <p className="text-blue-600">Pontos Atuais</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-green-700">{totalGained}</h3>
            <p className="text-green-600">Total Ganho</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-6 text-center">
            <TrendingDown className="h-12 w-12 text-orange-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-orange-700">{totalSpent}</h3>
            <p className="text-orange-600">Total Gasto</p>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Pontos */}
      <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-green-500" />
            <span>Histórico de Pontos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pointsHistory.length > 0 ? (
            <div className="space-y-3">
              {pointsHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-3">
                    {getPointsIcon(entry.type)}
                    <div>
                      <p className="font-medium text-slate-800">{entry.description}</p>
                      <p className="text-sm text-slate-600">
                        {formatDate(entry.date)}
                      </p>
                    </div>
                  </div>
                  
                  <Badge
                    variant="outline"
                    className={`${getPointsColor(entry.type)} font-bold`}
                  >
                    {entry.type === 'gain' ? '+' : ''}{entry.points} pontos
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">
                Nenhum histórico encontrado
              </h3>
              <p className="text-slate-500">
                Participe de atividades para começar a ganhar pontos!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
