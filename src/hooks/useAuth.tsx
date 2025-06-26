
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'colaborador' | 'supervisor' | 'administrador';
  team: string;
  ficticiousName: string;
  position: string;
  points: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => boolean;
  logout: () => void;
  updateUserPoints: (newPoints: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize mock data
    initializeMockData();
    
    // Check for existing session
    const savedUser = localStorage.getItem('orakle_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const initializeMockData = () => {
    if (!localStorage.getItem('orakle_users')) {
      const mockUsers = [
        {
          id: '1',
          name: 'Ana Silva',
          email: 'ana@orakle.com',
          password: '123456',
          role: 'colaborador',
          team: 'Vendas',
          ficticiousName: 'Estrela Dourada',
          position: 'Vendedora',
          points: 1250
        },
        {
          id: '2',
          name: 'Carlos Santos',
          email: 'carlos@orakle.com',
          password: '123456',
          role: 'supervisor',
          team: 'Vendas',
          ficticiousName: 'Líder Supremo',
          position: 'Supervisor de Vendas',
          points: 2100
        },
        {
          id: '3',
          name: 'Maria Oliveira',
          email: 'maria@orakle.com',
          password: '123456',
          role: 'administrador',
          team: 'Administração',
          ficticiousName: 'Comando Central',
          position: 'Gerente Geral',
          points: 3500
        }
      ];
      localStorage.setItem('orakle_users', JSON.stringify(mockUsers));
    }

    // Initialize other mock data
    if (!localStorage.getItem('orakle_announcements')) {
      const mockAnnouncements = [
        {
          id: '1',
          title: 'Bem-vindos ao Orakle!',
          content: 'Nossa nova plataforma de gestão está no ar. Explore todas as funcionalidades!',
          image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=400&fit=crop',
          date: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Meta do Trimestre',
          content: 'Estamos próximos de alcançar nossa meta! Continue o excelente trabalho.',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
          date: new Date().toISOString()
        }
      ];
      localStorage.setItem('orakle_announcements', JSON.stringify(mockAnnouncements));
    }

    // Initialize rewards
    if (!localStorage.getItem('orakle_rewards')) {
      const mockRewards = [
        {
          id: '1',
          name: 'Mousepad Ergonômico',
          image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=200&fit=crop',
          points: 500,
          description: 'Mousepad ergonômico para maior conforto'
        },
        {
          id: '2',
          name: 'Fone de Ouvido Bluetooth',
          image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=200&fit=crop',
          points: 1200,
          description: 'Fone de ouvido sem fio de alta qualidade'
        },
        {
          id: '3',
          name: 'Voucher Almoço',
          image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop',
          points: 800,
          description: 'Voucher para almoço em restaurante local'
        }
      ];
      localStorage.setItem('orakle_rewards', JSON.stringify(mockRewards));
    }

    // Initialize games/quizzes
    if (!localStorage.getItem('orakle_games')) {
      const mockGames = [
        {
          id: '1',
          name: 'Quiz de Segurança no Trabalho',
          type: 'Quiz',
          expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          pointsPerAnswer: 5,
          participationPoints: 10,
          questions: [
            {
              question: 'Qual é a primeira coisa a fazer em caso de incêndio?',
              options: ['Ligar para bombeiros', 'Usar extintor', 'Evacuar área', 'Gritar por ajuda'],
              correctAnswer: 2
            },
            {
              question: 'Quantas horas de trabalho contínuo são recomendadas antes de uma pausa?',
              options: ['1 hora', '2 horas', '3 horas', '4 horas'],
              correctAnswer: 1
            }
          ]
        }
      ];
      localStorage.setItem('orakle_games', JSON.stringify(mockGames));
    }

    // Initialize points history
    if (!localStorage.getItem('orakle_points_history')) {
      const mockHistory = [
        {
          id: '1',
          userId: '1',
          points: 10,
          type: 'gain',
          description: 'Participação no Quiz de Segurança',
          date: new Date().toISOString()
        },
        {
          id: '2',
          userId: '1',
          points: -500,
          type: 'spend',
          description: 'Resgate do prêmio: Mousepad Ergonômico',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      localStorage.setItem('orakle_points_history', JSON.stringify(mockHistory));
    }

    // Initialize AI knowledge base
    if (!localStorage.getItem('orakle_ai_knowledge')) {
      const mockKnowledge = [
        {
          id: '1',
          keywords: ['férias', 'pedir férias', 'solicitar férias'],
          answer: 'Para solicitar férias, acesse o menu "Solicitações", preencha o formulário com as datas desejadas e aguarde a aprovação do seu supervisor.'
        },
        {
          id: '2',
          keywords: ['pontos', 'ganhar pontos', 'como ganhar'],
          answer: 'Você pode ganhar pontos participando de quizzes, tendo bom desempenho e através de reconhecimento manual do seu supervisor.'
        }
      ];
      localStorage.setItem('orakle_ai_knowledge', JSON.stringify(mockKnowledge));
    }
  };

  const login = (email: string, password: string, role: string): boolean => {
    const users = JSON.parse(localStorage.getItem('orakle_users') || '[]');
    const foundUser = users.find((u: any) => 
      u.email === email && u.password === password && u.role === role
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('orakle_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('orakle_user');
  };

  const updateUserPoints = (newPoints: number) => {
    if (user) {
      const updatedUser = { ...user, points: newPoints };
      setUser(updatedUser);
      localStorage.setItem('orakle_user', JSON.stringify(updatedUser));
      
      // Update in users list
      const users = JSON.parse(localStorage.getItem('orakle_users') || '[]');
      const updatedUsers = users.map((u: any) => 
        u.id === user.id ? { ...u, points: newPoints } : u
      );
      localStorage.setItem('orakle_users', JSON.stringify(updatedUsers));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserPoints }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
