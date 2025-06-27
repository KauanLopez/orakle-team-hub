
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '../hooks/useFirebaseAuth';
import { toast } from '@/hooks/use-toast';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !role) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    setIsLogging(true);
    try {
      const success = await login(email, password, role);
      if (!success) {
        toast({
          title: "Erro de Autenticação",
          description: "Credenciais inválidas para o nível de acesso selecionado",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erro de Conexão",
        description: "Não foi possível conectar ao servidor",
        variant: "destructive"
      });
    } finally {
      setIsLogging(false);
    }
  };

  const quickLogin = (userType: string) => {
    const credentials = {
      colaborador: { email: 'ana@orakle.com', password: '123456', role: 'colaborador' },
      supervisor: { email: 'carlos@orakle.com', password: '123456', role: 'supervisor' },
      administrador: { email: 'maria@orakle.com', password: '123456', role: 'administrador' }
    };
    
    const cred = credentials[userType as keyof typeof credentials];
    setEmail(cred.email);
    setPassword(cred.password);
    setRole(cred.role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">O</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Orakle
          </h1>
          <p className="text-slate-600 mt-2">Plataforma de Gestão Inteligente</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl text-slate-800">Acesso à Plataforma</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="bg-white/70 border-slate-200 focus:border-blue-400"
                  disabled={isLogging}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="bg-white/70 border-slate-200 focus:border-blue-400"
                  disabled={isLogging}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Nível de Acesso</Label>
                <Select value={role} onValueChange={setRole} disabled={isLogging}>
                  <SelectTrigger className="bg-white/70 border-slate-200">
                    <SelectValue placeholder="Selecione seu nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="colaborador">Colaborador</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="administrador">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg"
                disabled={isLogging}
              >
                {isLogging ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 space-y-2">
              <p className="text-sm text-slate-600 text-center">Acesso rápido para demonstração:</p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('colaborador')}
                  className="text-xs hover:bg-blue-50"
                  disabled={isLogging}
                >
                  Colaborador
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('supervisor')}
                  className="text-xs hover:bg-green-50"
                  disabled={isLogging}
                >
                  Supervisor
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('administrador')}
                  className="text-xs hover:bg-purple-50"
                  disabled={isLogging}
                >
                  Admin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
