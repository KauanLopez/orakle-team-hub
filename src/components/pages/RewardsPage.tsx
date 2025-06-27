
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gift, Plus, Edit, Trash2, Star } from 'lucide-react';
import { useAuth } from '../../hooks/useFirebaseAuth';
import { useToast } from '@/hooks/use-toast';

export const RewardsPage: React.FC = () => {
  const { user, updateUserPoints } = useAuth();
  const { toast } = useToast();
  const [rewards, setRewards] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<any>(null);
  const [newReward, setNewReward] = useState({
    name: '',
    points: 0,
    description: '',
    image: ''
  });

  const canManage = user?.role === 'supervisor' || user?.role === 'administrador';

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = () => {
    const storedRewards = localStorage.getItem('orakle_rewards');
    if (storedRewards) {
      setRewards(JSON.parse(storedRewards));
    }
  };

  const handleRedeem = (reward: any) => {
    if (user && user.points >= reward.points) {
      const newPoints = user.points - reward.points;
      updateUserPoints(newPoints);
      
      // Add to points history
      const history = JSON.parse(localStorage.getItem('orakle_points_history') || '[]');
      history.push({
        id: Date.now().toString(),
        userId: user.id,
        points: -reward.points,
        type: 'spend',
        description: `Resgate do prêmio: ${reward.name}`,
        date: new Date().toISOString()
      });
      localStorage.setItem('orakle_points_history', JSON.stringify(history));
      
      toast({
        title: "Prêmio Resgatado!",
        description: `Você resgatou: ${reward.name}`,
      });
    } else {
      toast({
        title: "Pontos Insuficientes",
        description: "Você não possui pontos suficientes para este prêmio.",
        variant: "destructive"
      });
    }
  };

  const handleAddReward = () => {
    if (newReward.name && newReward.points > 0) {
      const reward = {
        id: Date.now().toString(),
        ...newReward,
        image: newReward.image || 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop'
      };
      
      const updatedRewards = [...rewards, reward];
      setRewards(updatedRewards);
      localStorage.setItem('orakle_rewards', JSON.stringify(updatedRewards));
      
      setIsAddModalOpen(false);
      setNewReward({ name: '', points: 0, description: '', image: '' });
      
      toast({
        title: "Prêmio Adicionado!",
        description: `${reward.name} foi adicionado à galeria.`,
      });
    }
  };

  const handleEditReward = (reward: any) => {
    setEditingReward(reward);
    setNewReward({
      name: reward.name,
      points: reward.points,
      description: reward.description,
      image: reward.image
    });
  };

  const handleUpdateReward = () => {
    if (newReward.name && newReward.points > 0 && editingReward) {
      const updatedRewards = rewards.map(r => 
        r.id === editingReward.id 
          ? { ...r, ...newReward }
          : r
      );
      
      setRewards(updatedRewards);
      localStorage.setItem('orakle_rewards', JSON.stringify(updatedRewards));
      
      setEditingReward(null);
      setNewReward({ name: '', points: 0, description: '', image: '' });
      
      toast({
        title: "Prêmio Atualizado!",
        description: `${newReward.name} foi atualizado.`,
      });
    }
  };

  const handleDeleteReward = (rewardId: string) => {
    const updatedRewards = rewards.filter(r => r.id !== rewardId);
    setRewards(updatedRewards);
    localStorage.setItem('orakle_rewards', JSON.stringify(updatedRewards));
    
    toast({
      title: "Prêmio Removido",
      description: "O prêmio foi removido da galeria.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Premiações</h1>
          <p className="text-slate-600 mt-1">Resgate prêmios com seus pontos</p>
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <Badge variant="outline" className="text-blue-600 text-lg px-4 py-2">
              <Star className="h-4 w-4 mr-2" />
              {user.points} pontos
            </Badge>
          )}
          {canManage && (
            <Button onClick={() => setIsAddModalOpen(true)} className="bg-green-500 hover:bg-green-600">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Prêmio
            </Button>
          )}
        </div>
      </div>

      {/* Galeria de Prêmios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <Card key={reward.id} className="shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <div className="relative">
              <img
                src={reward.image}
                alt={reward.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              {canManage && (
                <div className="absolute top-2 right-2 flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditReward(reward)}
                    className="bg-white/80 backdrop-blur-sm"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteReward(reward.id)}
                    className="bg-white/80 backdrop-blur-sm text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-slate-800 mb-2">{reward.name}</h3>
              <p className="text-sm text-slate-600 mb-4">{reward.description}</p>
              
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-orange-600">
                  <Gift className="h-4 w-4 mr-1" />
                  {reward.points} pontos
                </Badge>
                
                <Button
                  onClick={() => handleRedeem(reward)}
                  disabled={!user || user.points < reward.points}
                  className={
                    user && user.points >= reward.points
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-slate-300 cursor-not-allowed"
                  }
                >
                  Resgatar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {rewards.length === 0 && (
        <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Gift className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              Nenhum prêmio disponível
            </h3>
            <p className="text-slate-500">
              {canManage ? 'Adicione o primeiro prêmio!' : 'Aguarde novos prêmios serem adicionados.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modal de Adicionar/Editar Prêmio */}
      <Dialog open={isAddModalOpen || !!editingReward} onOpenChange={() => {
        setIsAddModalOpen(false);
        setEditingReward(null);
        setNewReward({ name: '', points: 0, description: '', image: '' });
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingReward ? 'Editar Prêmio' : 'Adicionar Prêmio'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Prêmio</Label>
              <Input
                id="name"
                value={newReward.name}
                onChange={(e) => setNewReward({...newReward, name: e.target.value})}
                placeholder="Ex: Mousepad Ergonômico"
              />
            </div>
            
            <div>
              <Label htmlFor="points">Pontos Necessários</Label>
              <Input
                id="points"
                type="number"
                value={newReward.points}
                onChange={(e) => setNewReward({...newReward, points: parseInt(e.target.value) || 0})}
                placeholder="Ex: 500"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={newReward.description}
                onChange={(e) => setNewReward({...newReward, description: e.target.value})}
                placeholder="Descrição do prêmio"
              />
            </div>
            
            <div>
              <Label htmlFor="image">URL da Imagem</Label>
              <Input
                id="image"
                value={newReward.image}
                onChange={(e) => setNewReward({...newReward, image: e.target.value})}
                placeholder="https://..."
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => {
                setIsAddModalOpen(false);
                setEditingReward(null);
                setNewReward({ name: '', points: 0, description: '', image: '' });
              }}>
                Cancelar
              </Button>
              <Button onClick={editingReward ? handleUpdateReward : handleAddReward}>
                {editingReward ? 'Atualizar' : 'Adicionar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
