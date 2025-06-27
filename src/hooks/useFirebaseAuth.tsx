
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'colaborador' | 'supervisor' | 'administrador';
  team: string;
  ficticiousName: string;
  position: string;
  points: number;
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserPoints: (newPoints: number) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('orakle_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Query users collection to find matching user
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email), where('role', '==', role));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log('No user found with this email and role');
        return false;
      }
      
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data() as User;
      
      // Check password
      if (userData.password !== password) {
        console.log('Invalid password');
        return false;
      }
      
      // Set user with document ID
      const loggedUser = { ...userData, id: userDoc.id };
      setUser(loggedUser);
      localStorage.setItem('orakle_current_user', JSON.stringify(loggedUser));
      
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${loggedUser.name}!`,
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erro no login",
        description: "Não foi possível conectar ao servidor.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setUser(null);
      localStorage.removeItem('orakle_current_user');
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUserPoints = async (newPoints: number): Promise<void> => {
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.id), {
          points: newPoints
        });
        const updatedUser = { ...user, points: newPoints };
        setUser(updatedUser);
        localStorage.setItem('orakle_current_user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error updating user points:', error);
        toast({
          title: "Erro ao atualizar pontos",
          description: "Não foi possível atualizar os pontos.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserPoints, loading }}>
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
