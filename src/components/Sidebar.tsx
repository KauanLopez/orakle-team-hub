import React from 'react';
import { 
  Home, 
  BarChart, 
  Trophy, 
  FileText, 
  Calendar, 
  Users, 
  Gift, 
  Gamepad2, 
  User, 
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentPage, 
  setCurrentPage, 
  isOpen, 
  setIsOpen 
}) => {
  const { user } = useAuth();

  const menuItems = [
    { id: 'home', label: 'Início', icon: Home, roles: ['colaborador', 'supervisor', 'administrador'] },
    { id: 'performance', label: 'Desempenho', icon: BarChart, roles: ['colaborador', 'supervisor', 'administrador'] },
    { id: 'ranking', label: 'Ranking', icon: Trophy, roles: ['colaborador', 'supervisor', 'administrador'] },
    { id: 'requests', label: 'Solicitações', icon: FileText, roles: ['colaborador', 'supervisor', 'administrador'] },
    { id: 'calendar', label: 'Calendário', icon: Calendar, roles: ['colaborador', 'supervisor', 'administrador'] },
    { id: 'team', label: 'Equipe', icon: Users, roles: ['supervisor', 'administrador'] },
    { id: 'rewards', label: 'Premiações', icon: Gift, roles: ['colaborador', 'supervisor', 'administrador'] },
    { id: 'games', label: 'Jogos', icon: Gamepad2, roles: ['colaborador', 'supervisor', 'administrador'] },
    { id: 'profile', label: 'Perfil', icon: User, roles: ['colaborador', 'supervisor', 'administrador'] },
    { id: 'support', label: 'Suporte AI', icon: MessageCircle, roles: ['colaborador', 'supervisor', 'administrador'] },
  ];

  const visibleItems = menuItems.filter(item => 
    item.roles.includes(user?.role || 'colaborador')
  );

  return (
    <>
      <div 
        className={`
          flex-shrink-0 bg-white/90 backdrop-blur-sm border-r border-slate-200 shadow-lg 
          transition-all duration-300 ease-in-out
          lg:relative lg:translate-x-0
          fixed inset-y-0 left-0 z-50 
          ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-20'}
        `}
      >
        <div className="flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg font-bold">O</span>
              </div>
              <div className={`transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                <h2 className="font-semibold text-slate-800 whitespace-nowrap">Orakle</h2>
                <p className="text-sm text-slate-600 whitespace-nowrap">{user?.team}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full h-12 flex items-center transition-colors ${
                    isOpen ? 'justify-start' : 'justify-center'
                  } ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  onClick={() => setCurrentPage(item.id)}
                  title={isOpen ? '' : item.label} // Tooltip for collapsed state
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className={`transition-all duration-200 whitespace-nowrap ${isOpen ? 'ml-3 opacity-100' : 'w-0 opacity-0'}`}>
                    {item.label}
                  </span>
                </Button>
              );
            })}
          </nav>

          <div className={`transition-opacity duration-200 border-t border-slate-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            {isOpen && (
              <div className="p-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-slate-800 truncate">{user?.name}</div>
                  <div className="text-xs text-slate-600 mt-1 truncate">{user?.position}</div>
                  <div className="text-xs text-blue-600 font-medium mt-2">
                    {user?.points} pontos
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};