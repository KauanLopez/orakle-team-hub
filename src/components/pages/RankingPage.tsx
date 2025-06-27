import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Star, BarChart } from 'lucide-react';
import { useAuth } from '../../hooks/useFirebaseAuth';

export const RankingPage: React.FC = () => {
  const { user } = useAuth();
  const [rankingType, setRankingType] = useState<'points' | 'performance'>('points');
  const [showRealNames, setShowRealNames] = useState(true);

  // Mock ranking data
  const pointsRanking = [
    { id: '1', name: 'Maria Oliveira', ficticiousName: 'Comando Central', points: 3500, team: 'Administração' },
    { id: '2', name: 'Carlos Santos', ficticiousName: 'Líder Supremo', points: 2100, team: 'Vendas' },
    { id: '3', name: 'Ana Silva', ficticiousName: 'Estrela Dourada', points: 1250, team: 'Vendas' },
    { id: '4', name: 'João Costa', ficticiousName: 'Raio Veloz', points: 1180, team: 'Suporte' },
    { id: '5', name: 'Luisa Santos', ficticiousName: 'Mente Brilhante', points: 1050, team: 'Marketing' },
    { id: '6', name: 'Pedro Lima', ficticiousName: 'Foco Total', points: 890, team: 'Vendas' },
    { id: '7', name: 'Sofia Mendes', ficticiousName: 'Energia Pura', points: 750, team: 'Suporte' },
    { id: '8', name: 'Rafael Torres', ficticiousName: 'Determinação', points: 680, team: 'Marketing' },
  ];

  const performanceRanking = [
    { id: '1', name: 'Ana Silva', ficticiousName: 'Estrela Dourada', score: 4.9, atendimentos: 203, team: 'Vendas' },
    { id: '2', name: 'Sofia Mendes', ficticiousName: 'Energia Pura', score: 4.8, atendimentos: 187, team: 'Suporte' },
    { id: '3', name: 'Carlos Santos', ficticiousName: 'Líder Supremo', score: 4.7, atendimentos: 195, team: 'Vendas' },
    { id: '4', name: 'Luisa Santos', ficticiousName: 'Mente Brilhante', score: 4.6, atendimentos: 156, team: 'Marketing' },
    { id: '5', name: 'Pedro Lima', ficticiousName: 'Foco Total', score: 4.5, atendimentos: 142, team: 'Vendas' },
    { id: '6', name: 'João Costa', ficticiousName: 'Raio Veloz', score: 4.4, atendimentos: 178, team: 'Suporte' },
    { id: '7', name: 'Rafael Torres', ficticiousName: 'Determinação', score: 4.3, atendimentos: 134, team: 'Marketing' },
    { id: '8', name: 'Maria Oliveira', ficticiousName: 'Comando Central', score: 4.2, atendimentos: 98, team: 'Administração' },
  ];

  const currentRanking = rankingType === 'points' ? pointsRanking : performanceRanking;
  const canManage = user?.role === 'supervisor' || user?.role === 'administrador';

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-orange-500" />;
      default: return <Star className="h-5 w-5 text-slate-400" />;
    }
  };

  const getRankBadgeColor = (position: number) => {
    switch (position) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2: return 'bg-gradient-to-r from-slate-300 to-slate-500 text-white';
      case 3: return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getUserPosition = () => {
    const position = currentRanking.findIndex(item => item.name === user?.name) + 1;
    return position || 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Ranking</h1>
          <p className="text-slate-600 mt-1">Acompanhe sua posição e a dos colegas</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex bg-white rounded-lg p-1 shadow-sm border">
            <Button
              variant={rankingType === 'points' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setRankingType('points')}
              className={rankingType === 'points' ? 'bg-blue-500 hover:bg-blue-600' : ''}
            >
              <Trophy className="h-4 w-4 mr-2" />
              Pontuação
            </Button>
            <Button
              variant={rankingType === 'performance' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setRankingType('performance')}
              className={rankingType === 'performance' ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              <BarChart className="h-4 w-4 mr-2" />
              Desempenho
            </Button>
          </div>

          {canManage && (
            <div className="flex bg-white rounded-lg p-1 shadow-sm border">
              <Button
                variant={showRealNames ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setShowRealNames(true)}
                className={showRealNames ? 'bg-slate-500 hover:bg-slate-600' : ''}
              >
                Nomes Reais
              </Button>
              <Button
                variant={!showRealNames ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setShowRealNames(false)}
                className={!showRealNames ? 'bg-purple-500 hover:bg-purple-600' : ''}
              >
                Nomes Fictícios
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Sua Posição */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankBadgeColor(getUserPosition())}`}>
                <span className="text-xl font-bold">#{getUserPosition()}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Sua Posição</h3>
                <p className="text-slate-600">
                  {showRealNames || user?.role === 'colaborador' ? user?.name : user?.ficticiousName}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-700">
                {rankingType === 'points' 
                  ? `${user?.points} pontos`
                  : '4.8 ★'
                }
              </div>
              <div className="text-slate-600">{user?.team}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ranking Completo */}
      <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {rankingType === 'points' ? (
              <Trophy className="h-6 w-6 text-yellow-500" />
            ) : (
              <BarChart className="h-6 w-6 text-green-500" />
            )}
            <span>
              {rankingType === 'points' ? 'Ranking de Pontuação' : 'Ranking de Desempenho'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentRanking.map((item, index) => {
              const position = index + 1;
              const isCurrentUser = item.name === user?.name;
              
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-md ${
                    isCurrentUser 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 ring-2 ring-blue-300' 
                      : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getRankBadgeColor(position)}`}>
                      {position <= 3 ? (
                        getRankIcon(position)
                      ) : (
                        <span className="font-bold">#{position}</span>
                      )}
                    </div>
                    
                    <div>
                      <div className="font-semibold text-slate-800">
                        {showRealNames || user?.role === 'colaborador' ? item.name : item.ficticiousName}
                      </div>
                      <div className="text-sm text-slate-600">{item.team}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {rankingType === 'points' ? (
                        <span className="text-blue-700">{(item as any).points} pts</span>
                      ) : (
                        <span className="text-green-700">{(item as any).score} ★</span>
                      )}
                    </div>
                    {rankingType === 'performance' && (
                      <div className="text-sm text-slate-600">
                        {(item as any).atendimentos} atendimentos
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
