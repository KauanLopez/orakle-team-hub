import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Users, Edit, Trash2, Plus, Award } from 'lucide-react';
import { useAuth } from '../../hooks/useFirebaseAuth';

export const TeamPage: React.FC = () => {
  const { user } = useAuth();
  const [editingUser, setEditingUser] = useState<any>(null);
  const [pointsModalOpen, setPointsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [pointsType, setPointsType] = useState<'add' | 'remove'>('add');
  const [pointsAmount, setPointsAmount] = useState([5]);
  const [pointsReason, setPointsReason] = useState('');

  // Mock data - in real app would come from API/localStorage
  const teamMembers = [
    { id: '1', name: 'Ana Silva', position: 'Vendedora', ficticiousName: 'Estrela Dourada', team: 'Vendas', points: 1250 },
    { id: '4', name: 'Pedro Lima', position: 'Vendedor', ficticiousName: 'Foco Total', team: 'Vendas', points: 890 },
    { id: '6', name: 'João Costa', position: 'Vendedor', ficticiousName: 'Raio Veloz', team: 'Vendas', points: 1180 },
  ];

  const allUsers = [
    ...teamMembers,
    { id: '5', name: 'Luisa Santos', position: 'Analista', ficticiousName: 'Mente Brilhante', team: 'Marketing', points: 1050 },
    { id: '7', name: 'Sofia Mendes', position: 'Analista', ficticiousName: 'Energia Pura', team: 'Suporte', points: 750 },
    { id: '8', name: 'Rafael Torres', position: 'Designer', ficticiousName: 'Determinação', team: 'Marketing', points: 680 },
  ];

  const usersWithoutTeam = allUsers.filter(u => !u.team || u.team === 'Sem Equipe');

  const teams = [
    { name: 'Vendas', supervisor: 'Carlos Santos', members: 3 },
    { name: 'Marketing', supervisor: 'Luisa Santos', members: 2 },
    { name: 'Suporte', supervisor: 'Sofia Mendes', members: 2 },
  ];

  const handleEditUser = (member: any) => {
    setEditingUser(member);
  };

  const handleSaveUser = () => {
    // Save user changes to localStorage
    console.log('Saving user:', editingUser);
    setEditingUser(null);
  };

  const handleRemoveUser = (memberId: string) => {
    console.log('Removing user:', memberId);
  };

  const handlePointsSubmit = () => {
    if (selectedMember && pointsReason.trim()) {
      const points = pointsType === 'add' ? pointsAmount[0] : -pointsAmount[0];
      console.log(`${pointsType === 'add' ? 'Adding' : 'Removing'} ${Math.abs(points)} points to ${selectedMember.name} for: ${pointsReason}`);
      
      // Update points in localStorage
      const history = JSON.parse(localStorage.getItem('orakle_points_history') || '[]');
      history.push({
        id: Date.now().toString(),
        userId: selectedMember.id,
        points: points,
        type: pointsType === 'add' ? 'gain' : 'spend',
        description: pointsReason,
        date: new Date().toISOString()
      });
      localStorage.setItem('orakle_points_history', JSON.stringify(history));
      
      setPointsModalOpen(false);
      setSelectedMember(null);
      setPointsReason('');
    }
  };

  const isAdmin = user?.role === 'administrador';
  const isSupervisor = user?.role === 'supervisor' || isAdmin;

  if (!isSupervisor) {
    return <div className="text-center text-slate-600">Acesso negado</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Equipe</h1>
          <p className="text-slate-600 mt-1">Gerencie sua equipe e pontuações</p>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={() => setPointsModalOpen(true)}
            className="bg-green-500 hover:bg-green-600"
          >
            <Award className="h-4 w-4 mr-2" />
            Gerenciar Pontos
          </Button>
          {isAdmin && (
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Nova Equipe
            </Button>
          )}
        </div>
      </div>

      {/* Minha Equipe */}
      <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-blue-500" />
            <span>{isAdmin ? 'Todas as Equipes' : 'Minha Equipe'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{member.name}</div>
                    <div className="text-sm text-slate-600">{member.position}</div>
                    <div className="text-sm text-purple-600">"{member.ficticiousName}"</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="text-blue-600">
                    {member.points}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditUser(member)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveUser(member.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Admin Features */}
      {isAdmin && (
        <>
          {/* Todas as Equipes */}
          <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Gerenciamento de Equipes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map((team) => (
                  <div key={team.name} className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border">
                    <h3 className="font-semibold text-slate-800 mb-2">{team.name}</h3>
                    <p className="text-sm text-slate-600 mb-1">Supervisor: {team.supervisor}</p>
                    <p className="text-sm text-slate-600 mb-3">{team.members} membros</p>
                    <Button size="sm" variant="outline" className="w-full">
                      Gerenciar
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Usuários Sem Equipe */}
          {usersWithoutTeam.length > 0 && (
            <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Usuários Sem Equipe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {usersWithoutTeam.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div>
                        <span className="font-medium text-slate-800">{user.name}</span>
                        <span className="text-sm text-slate-600 ml-2">({user.position})</span>
                      </div>
                      <Button size="sm" variant="outline">
                        Alocar
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Modal de Edição */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Colaborador</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={editingUser?.name || ''}
                onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="position">Cargo</Label>
              <Input
                id="position"
                value={editingUser?.position || ''}
                onChange={(e) => setEditingUser({...editingUser, position: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="ficticiousName">Nome Fictício</Label>
              <Input
                id="ficticiousName"
                value={editingUser?.ficticiousName || ''}
                onChange={(e) => setEditingUser({...editingUser, ficticiousName: e.target.value})}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setEditingUser(null)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveUser}>
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Pontuação */}
      <Dialog open={pointsModalOpen} onOpenChange={setPointsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Pontos</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Selecionar Colaborador</Label>
              <Select onValueChange={(value) => setSelectedMember(teamMembers.find(m => m.id === value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um colaborador" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Tipo</Label>
              <Select value={pointsType} onValueChange={(value: 'add' | 'remove') => setPointsType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Adicionar Pontos</SelectItem>
                  <SelectItem value="remove">Remover Pontos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Quantidade de Pontos: {pointsAmount[0]}</Label>
              <Slider
                value={pointsAmount}
                onValueChange={setPointsAmount}
                max={100}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="reason">Motivo</Label>
              <Textarea
                id="reason"
                placeholder="Descreva o motivo da alteração..."
                value={pointsReason}
                onChange={(e) => setPointsReason(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setPointsModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handlePointsSubmit} disabled={!selectedMember || !pointsReason.trim()}>
                Confirmar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
