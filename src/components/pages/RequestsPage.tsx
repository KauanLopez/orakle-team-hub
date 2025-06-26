
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, FileText, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface Request {
  id: string;
  type: 'general' | 'schedule_change';
  title: string;
  description: string;
  requester: string;
  requesterId: string;
  team: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  targetColleague?: string;
  originalSchedule?: string;
  newSchedule?: string;
}

export const RequestsPage: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [requestType, setRequestType] = useState<'general' | 'schedule_change'>('general');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetColleague: '',
    originalSchedule: '',
    newSchedule: ''
  });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const savedRequests = localStorage.getItem('orakle_requests');
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    } else {
      // Initialize with mock data
      const mockRequests: Request[] = [
        {
          id: '1',
          type: 'general',
          title: 'Solicitação de Férias',
          description: 'Gostaria de solicitar férias do dia 15/07 ao 30/07.',
          requester: 'Ana Silva',
          requesterId: '1',
          team: 'Vendas',
          status: 'pending',
          date: new Date().toISOString()
        },
        {
          id: '2',
          type: 'schedule_change',
          title: 'Troca de Horário',
          description: 'Preciso trocar meu horário com um colega.',
          requester: 'João Costa',
          requesterId: '4',
          team: 'Suporte',
          status: 'approved',
          date: new Date(Date.now() - 86400000).toISOString(),
          targetColleague: 'Pedro Lima',
          originalSchedule: 'Manhã (08:00-12:00)',
          newSchedule: 'Tarde (13:00-17:00)'
        }
      ];
      setRequests(mockRequests);
      localStorage.setItem('orakle_requests', JSON.stringify(mockRequests));
    }
  };

  const saveRequests = (updatedRequests: Request[]) => {
    setRequests(updatedRequests);
    localStorage.setItem('orakle_requests', JSON.stringify(updatedRequests));
  };

  const handleSubmitRequest = () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const newRequest: Request = {
      id: Date.now().toString(),
      type: requestType,
      title: formData.title,
      description: formData.description,
      requester: user?.name || '',
      requesterId: user?.id || '',
      team: user?.team || '',
      status: 'pending',
      date: new Date().toISOString(),
      ...(requestType === 'schedule_change' && {
        targetColleague: formData.targetColleague,
        originalSchedule: formData.originalSchedule,
        newSchedule: formData.newSchedule
      })
    };

    const updatedRequests = [newRequest, ...requests];
    saveRequests(updatedRequests);

    // Reset form
    setFormData({
      title: '',
      description: '',
      targetColleague: '',
      originalSchedule: '',
      newSchedule: ''
    });
    setShowNewRequestDialog(false);

    toast({
      title: "Sucesso",
      description: "Solicitação enviada com sucesso!"
    });
  };

  const handleRequestAction = (requestId: string, action: 'approved' | 'rejected') => {
    const updatedRequests = requests.map(req =>
      req.id === requestId ? { ...req, status: action } : req
    );
    saveRequests(updatedRequests);

    toast({
      title: "Sucesso",
      description: `Solicitação ${action === 'approved' ? 'aprovada' : 'rejeitada'} com sucesso!`
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          Pendente
        </Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Aprovado
        </Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Rejeitado
        </Badge>;
      default:
        return null;
    }
  };

  const canManageRequests = user?.role === 'supervisor' || user?.role === 'administrador';
  
  const filteredRequests = canManageRequests 
    ? requests.filter(req => 
        user?.role === 'administrador' || 
        (user?.role === 'supervisor' && req.team === user?.team)
      )
    : requests.filter(req => req.requesterId === user?.id);

  const teamMembers = ['Pedro Lima', 'Sofia Mendes', 'Rafael Torres']; // Mock team members

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Solicitações</h1>
          <p className="text-slate-600 mt-1">
            {canManageRequests ? 'Gerencie as solicitações da equipe' : 'Suas solicitações e status'}
          </p>
        </div>

        <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Solicitação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nova Solicitação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Tipo de Solicitação</Label>
                <Select value={requestType} onValueChange={(value: 'general' | 'schedule_change') => setRequestType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Solicitação Geral</SelectItem>
                    <SelectItem value="schedule_change">Troca de Horário</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Solicitação de férias"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva sua solicitação..."
                  rows={3}
                />
              </div>

              {requestType === 'schedule_change' && (
                <>
                  <div>
                    <Label>Colega para Troca</Label>
                    <Select value={formData.targetColleague} onValueChange={(value) => setFormData({ ...formData, targetColleague: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um colega" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers.map((member) => (
                          <SelectItem key={member} value={member}>{member}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="originalSchedule">Seu Horário Atual</Label>
                    <Input
                      id="originalSchedule"
                      value={formData.originalSchedule}
                      onChange={(e) => setFormData({ ...formData, originalSchedule: e.target.value })}
                      placeholder="Ex: Manhã (08:00-12:00)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="newSchedule">Horário Desejado</Label>
                    <Input
                      id="newSchedule"
                      value={formData.newSchedule}
                      onChange={(e) => setFormData({ ...formData, newSchedule: e.target.value })}
                      placeholder="Ex: Tarde (13:00-17:00)"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleSubmitRequest}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  Enviar Solicitação
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewRequestDialog(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Solicitações */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">
                Nenhuma solicitação encontrada
              </h3>
              <p className="text-slate-500">
                {canManageRequests 
                  ? 'Não há solicitações pendentes para sua equipe.'
                  : 'Você ainda não fez nenhuma solicitação.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id} className="shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {request.type === 'schedule_change' ? (
                          <Calendar className="h-5 w-5 text-blue-500" />
                        ) : (
                          <FileText className="h-5 w-5 text-green-500" />
                        )}
                        <div>
                          <h3 className="font-semibold text-slate-800">{request.title}</h3>
                          <p className="text-sm text-slate-600">
                            Por: {request.requester} • {request.team}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>

                    <p className="text-slate-700 mb-3">{request.description}</p>

                    {request.type === 'schedule_change' && request.targetColleague && (
                      <div className="bg-blue-50 p-3 rounded-lg mb-3">
                        <p className="text-sm text-blue-800">
                          <strong>Troca com:</strong> {request.targetColleague}
                        </p>
                        <p className="text-sm text-blue-800">
                          <strong>De:</strong> {request.originalSchedule} <strong>Para:</strong> {request.newSchedule}
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-slate-500">
                      Enviado em {new Date(request.date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {canManageRequests && request.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleRequestAction(request.id, 'approved')}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRequestAction(request.id, 'rejected')}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
