import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { app, db } from '../lib/firebase'; // Import from our new firebase config

// Interface para os dados do usuário do Orakle
export interface User {
  id: string; // Firebase UID
  name: string;
  email: string;
  role: 'colaborador' | 'supervisor' | 'administrador';
  team: string;
  ficticiousName: string;
  position: string;
  points: number;
}

// Interface para o contexto de autenticação
interface AuthContextType {
  user: User | null;
  loading: boolean; // Adicionado para gerenciar o estado de carregamento
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserPoints: (newPoints: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const auth = getAuth(app);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Inicia como true para esperar a verificação inicial

  useEffect(() => {
    // onAuthStateChanged é um listener que observa mudanças no estado de login
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Se o usuário está logado no Firebase, buscamos seus dados no Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          // Se o documento existe, montamos o objeto de usuário completo
          const userData = userDoc.data() as Omit<User, 'id' | 'email'>;
          setUser({ 
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            ...userData 
          });
        } else {
          // Caso crítico: usuário autenticado mas sem dados no Firestore. Deslogar.
          console.error("Usuário autenticado sem documento no Firestore. Deslogando.");
          await signOut(auth);
          setUser(null);
        }
      } else {
        // Se não há usuário no Firebase, o estado é nulo
        setUser(null);
      }
      // Finaliza o carregamento após a verificação
      setLoading(false);
    });

    // Limpa o listener ao desmontar o componente para evitar vazamentos de memória
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // O sucesso do login será capturado pelo listener onAuthStateChanged
      return true;
    } catch (error) {
      console.error("Erro de autenticação:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const updateUserPoints = async (newPoints: number) => {
    if (user) {
      const userDocRef = doc(db, 'users', user.id);
      try {
        await updateDoc(userDocRef, { points: newPoints });
        setUser((currentUser) => currentUser ? { ...currentUser, points: newPoints } : null);
      } catch (error) {
        console.error("Erro ao atualizar pontos:", error);
      }
    }
  };
  
  // O valor do provider agora inclui o estado de 'loading'
  const value = { user, loading, login, logout, updateUserPoints };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
