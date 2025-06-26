
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuth } from '../../hooks/useAuth';

export const PerformancePage: React.FC = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('individual'); // individual, team, general
  const [dateFilter, setDateFilter] = useState('30'); // last 30 days
  const [selectedTeam, setSelectedTeam] = useState('');

  // Mock data for charts
  const performanceData = [
    { name: 'Sem 1', atendimentos: 45, nota: 4.8, avaliacoes: 12 },
    { name: 'Sem 2', atendimentos: 52, nota: 4.6, avaliacoes: 15 },
    { name: 'Sem 3', atendimentos: 48, nota: 4.9, avaliacoes: 14 },
    { name: 'Sem 4', atendimentos: 58, nota: 4.7, avaliacoes: 18 },
  ];

  const teamPerformanceData = [
    { name: 'Ana Silva', atendimentos: 203, nota: 4.8, avaliacoes: 59, pontos: 1250 },
    { name: 'João Santos', atendimentos: 187, nota: 4.6, avaliacoes: 52, pontos: 980 },
    { name: 'Maria Costa', atendimentos: 195, nota: 4.9, avaliacoes: 61, pontos: 1340 },
  ];

  const canViewTeam = user?.role === 'supervisor' || user?.role === 'administrador';

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Desempenho</h1>
          <p className="text-slate-600 mt-1">Acompanhe suas métricas e resultados</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {canViewTeam && (
            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="team">Minha Equipe</SelectItem>
                {user?.role === 'administrador' && (
                  <SelectItem value="general">Geral</SelectItem>
                )}
              </SelectContent>
            </Select>
          )}

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 3 meses</SelectItem>
              <SelectItem value="365">Último ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-700 mb-2">4.8</div>
              <div className="text-blue-600 font-medium">Nota Média</div>
              <Badge variant="secondary" className="mt-2 bg-blue-200 text-blue-800">
                +0.2 vs mês anterior
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-700 mb-2">203</div>
              <div className="text-green-600 font-medium">Atendimentos</div>
              <Badge variant="secondary" className="mt-2 bg-green-200 text-green-800">
                +15 vs mês anterior
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-700 mb-2">85%</div>
              <div className="text-purple-600 font-medium">% Avaliações</div>
              <Badge variant="secondary" className="mt-2 bg-purple-200 text-purple-800">
                +5% vs mês anterior
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-700 mb-2">12</div>
              <div className="text-orange-600 font-medium">Posição Ranking</div>
              <Badge variant="secondary" className="mt-2 bg-orange-200 text-orange-800">
                ↑3 posições
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Evolução dos Atendimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="atendimentos" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Evolução da Nota Média</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[4.0, 5.0]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="nota" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Desempenho da Equipe */}
      {viewMode === 'team' && canViewTeam && (
        <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Desempenho da Equipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Colaborador</th>
                    <th className="text-center p-4 font-semibold">Atendimentos</th>
                    <th className="text-center p-4 font-semibold">Nota Média</th>
                    <th className="text-center p-4 font-semibold">Avaliações</th>
                    <th className="text-center p-4 font-semibold">Pontos</th>
                  </tr>
                </thead>
                <tbody>
                  {teamPerformanceData.map((member, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50">
                      <td className="p-4">
                        <div className="font-medium">{member.name}</div>
                      </td>
                      <td className="text-center p-4">{member.atendimentos}</td>
                      <td className="text-center p-4">
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {member.nota}
                        </Badge>
                      </td>
                      <td className="text-center p-4">{member.avaliacoes}</td>
                      <td className="text-center p-4">
                        <Badge className="bg-blue-100 text-blue-700">
                          {member.pontos}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
