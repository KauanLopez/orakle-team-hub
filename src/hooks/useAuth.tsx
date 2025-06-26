
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

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
