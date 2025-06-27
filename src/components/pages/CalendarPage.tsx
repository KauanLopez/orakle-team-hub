
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useFirebaseAuth';
import { toast } from '@/hooks/use-toast';

interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  createdBy: string;
  team: string;
}

export const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showNewEventDialog, setShowNewEventDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: ''
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    const savedEvents = localStorage.getItem('orakle_events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      // Initialize with mock data
      const mockEvents: CalendarEvent[] = [
        {
          id: '1',
          date: '2024-07-15',
          title: 'Reunião Mensal',
          description: 'Reunião mensal de resultados e planejamento',
          createdBy: 'Carlos Santos',
          team: 'Vendas'
        },
        {
          id: '2',
          date: '2024-07-20',
          title: 'Treinamento de Vendas',
          description: 'Workshop sobre técnicas de vendas',
          createdBy: 'Maria Oliveira',
          team: 'Administração'
        }
      ];
      setEvents(mockEvents);
      localStorage.setItem('orakle_events', JSON.stringify(mockEvents));
    }
  };

  const saveEvents = (updatedEvents: CalendarEvent[]) => {
    setEvents(updatedEvents);
    localStorage.setItem('orakle_events', JSON.stringify(updatedEvents));
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleAddEvent = () => {
    if (!formData.title || !formData.date) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      date: formData.date,
      createdBy: user?.name || '',
      team: user?.team || ''
    };

    const updatedEvents = [...events, newEvent];
    saveEvents(updatedEvents);

    // Reset form
    setFormData({ title: '', description: '', date: '' });
    setShowNewEventDialog(false);

    toast({
      title: "Sucesso",
      description: "Evento adicionado com sucesso!"
    });
  };

  const deleteEvent = (eventId: string) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    saveEvents(updatedEvents);
    toast({
      title: "Sucesso",
      description: "Evento removido com sucesso!"
    });
  };

  const getEventsForDate = (dateStr: string) => {
    return events.filter(event => event.date === dateStr);
  };

  const getEventsForMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const monthStr = `${year}-${month.toString().padStart(2, '0')}`;
    
    return events
      .filter(event => event.date.startsWith(monthStr))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-slate-50"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const dayEvents = getEventsForDate(dateStr);
      const isToday = new Date().toDateString() === new Date(dateStr).toDateString();

      days.push(
        <div
          key={day}
          className={`h-24 border border-slate-200 p-2 cursor-pointer transition-colors hover:bg-blue-50 ${
            isToday ? 'bg-blue-100 border-blue-300' : 'bg-white'
          }`}
          onClick={() => {
            setSelectedDate(dateStr);
            setFormData({ ...formData, date: dateStr });
          }}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-700' : 'text-slate-700'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className="text-xs bg-blue-500 text-white px-2 py-1 rounded truncate"
                title={event.title}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-blue-600">
                +{dayEvents.length - 2} mais
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const canManage = user?.role === 'supervisor' || user?.role === 'administrador';
  const monthEvents = getEventsForMonth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Calendário</h1>
          <p className="text-slate-600 mt-1">Acompanhe eventos e compromissos da equipe</p>
        </div>

        {canManage && (
          <Dialog open={showNewEventDialog} onOpenChange={setShowNewEventDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Evento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Novo Evento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="event-title">Título *</Label>
                  <Input
                    id="event-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Reunião de equipe"
                  />
                </div>

                <div>
                  <Label htmlFor="event-date">Data *</Label>
                  <Input
                    id="event-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="event-description">Descrição</Label>
                  <Textarea
                    id="event-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva o evento..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleAddEvent}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                  >
                    Adicionar
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNewEventDialog(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {currentDate.toLocaleDateString('pt-BR', { 
                    month: 'long', 
                    year: 'numeric' 
                  }).replace(/^\w/, c => c.toUpperCase())}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-0 mb-4">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                  <div key={day} className="p-2 text-center font-semibold text-slate-600 bg-slate-100">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0 border border-slate-200">
                {renderCalendar()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <div>
          <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5" />
                <span>Eventos do Mês</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monthEvents.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">
                    Nenhum evento este mês
                  </p>
                ) : (
                  monthEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-slate-800">{event.title}</div>
                          <div className="text-sm text-blue-600 mb-1">
                            {new Date(event.date).toLocaleDateString('pt-BR')}
                          </div>
                          {event.description && (
                            <div className="text-sm text-slate-600 mb-2">
                              {event.description}
                            </div>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {event.team}
                          </Badge>
                        </div>
                        {canManage && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteEvent(event.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
