
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus, Edit } from 'lucide-react';
import { useAuth } from '../../hooks/useFirebaseAuth';
import { useFirestore } from '../../hooks/useFirestore';
import { Badge } from '@/components/ui/badge';

interface Announcement {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
}

export const HomePage: React.FC = () => {
  const { user, loading } = useAuth();
  const { data: announcements } = useFirestore('announcements');
  const { data: alignmentsData } = useFirestore('alignments');
  const [currentSlide, setCurrentSlide] = useState(0);

  const alignments = alignmentsData.map(item => item.text);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % announcements.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  useEffect(() => {
    if (announcements.length > 1) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [announcements.length]);

  const canManage = user?.role === 'supervisor' || user?.role === 'administrador';

  if (loading) {
    return <div className="text-center text-slate-600">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Bem-vindo, {user?.name}!
          </h1>
          <p className="text-slate-600 mt-1">
            Acompanhe as últimas atualizações e informações importantes
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2 hidden sm:flex">
          {user?.points} pontos
        </Badge>
      </div>

      {/* MUDANÇA 1: Wrapper para layout em grid em telas grandes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-6">
        {/* Coluna do Carrossel */}
        <Card className="overflow-hidden shadow-lg bg-white/80 backdrop-blur-sm flex flex-col h-full">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Avisos Importantes</CardTitle>
              {canManage && (
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Gerenciar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-grow">
            {announcements.length > 0 ? (
              <div className="relative h-full">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white relative overflow-hidden rounded-b-lg">
                  <img
                    src={announcements[currentSlide]?.image}
                    alt={announcements[currentSlide]?.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold mb-2">
                      {announcements[currentSlide]?.title}
                    </h3>
                    <p className="text-lg opacity-90">
                      {announcements[currentSlide]?.content}
                    </p>
                  </div>
                </div>
                
                {announcements.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 p-0 bg-white/20 hover:bg-white/30 border-0"
                      onClick={prevSlide}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 p-0 bg-white/20 hover:bg-white/30 border-0"
                      onClick={nextSlide}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                    
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {announcements.map((_, index) => (
                        <button
                          key={index}
                          className={`w-3 h-3 rounded-full transition-all ${
                            index === currentSlide ? 'bg-white' : 'bg-white/40'
                          }`}
                          onClick={() => setCurrentSlide(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="h-full bg-gradient-to-r from-slate-200 to-slate-300 flex items-center justify-center">
                <p className="text-slate-600">Nenhum anúncio disponível</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Coluna dos Alinhamentos */}
        <Card className="shadow-lg bg-white/80 backdrop-blur-sm flex flex-col h-full mt-6 lg:mt-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Alinhamentos Importantes</CardTitle>
              {canManage && (
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            {/* MUDANÇA 2: Layout de lista em vez de grid */}
            <div className="space-y-4">
              {alignments.map((alignment, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
                >
                  <p className="text-slate-700 text-sm leading-relaxed">{alignment}</p>
                </div>
              ))}
            </div>
            {alignments.length === 0 && (
              <p className="text-slate-500 text-center py-8">
                Nenhum alinhamento cadastrado
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cards de Status Rápido (continuam abaixo) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-700 mb-2">{user?.points}</div>
              <div className="text-blue-600 font-medium">Seus Pontos</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-700 mb-2">15</div>
              <div className="text-green-600 font-medium">Avaliações Este Mês</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-700 mb-2">4.8</div>
              <div className="text-purple-600 font-medium">Nota Média</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
