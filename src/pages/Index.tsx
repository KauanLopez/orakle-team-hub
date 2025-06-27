import React from 'react';
import { LoginPage } from '../components/LoginPage';
import { Dashboard } from '../components/Dashboard';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

const Index: React.FC = () => {
  // Agora também obtemos o estado de 'loading' do nosso hook
  const { user, loading } = useAuth();

  // 1. Enquanto o Firebase verifica o estado de autenticação, mostramos uma tela de carregamento
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  // 2. Após o carregamento, decidimos qual página mostrar
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {user ? <Dashboard /> : <LoginPage />}
    </div>
  );
};

export default Index;
