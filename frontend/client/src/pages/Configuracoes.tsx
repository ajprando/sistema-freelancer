import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Lock, 
  CreditCard, 
  Palette, 
  Save, 
  Moon, 
  Sun, 
  ShieldCheck,
  Mail,
  Briefcase,
  Wallet,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';

export default function Configuracoes() {
  const { user } = useAuth();
  const [theme, setThemeState] = useState(localStorage.getItem('theme') || 'light');
  const [isLoading, setIsLoading] = useState(false);
  
  const isFreelancer = user?.tipo?.toUpperCase() === 'FREELANCER';

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const [profileData, setProfileData] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    especialidade: 'Desenvolvedor Fullstack', 
    valorHora: '70.00'
  });

  const [pixData, setPixData] = useState({
    chave: 'meuemail@exemplo.com',
    tipo: 'E-mail',
    banco: 'Nubank',
    titular: user?.nome || ''
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Perfil atualizado com sucesso!');
    }, 1000);
  };

  const handleSavePix = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Dados de faturamento salvos!');
    }, 1000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const currentPassword = (form.elements.namedItem('currentPassword') as HTMLInputElement).value;
    const newPassword = (form.elements.namedItem('newPassword') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;

    if (!newPassword || newPassword.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = `/freelancers/${user?.id}`;
      await apiClient.patch(endpoint, { senha: newPassword });
      
      toast.success('Senha alterada com sucesso!');
      form.reset();
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      toast.error('Erro ao alterar a senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Configurações</h1>
          <p className="text-muted-foreground mt-1">Personalize sua conta e preferências do sistema.</p>
        </div>

        <Tabs defaultValue="perfil" className="space-y-6">
          <TabsList className="bg-secondary/50 p-1">
            <TabsTrigger value="perfil" className="gap-2">
              <User className="w-4 h-4" />
              Perfil
            </TabsTrigger>
            {isFreelancer && (
              <TabsTrigger value="faturamento" className="gap-2">
                <CreditCard className="w-4 h-4" />
                Faturamento
              </TabsTrigger>
            )}
            <TabsTrigger value="aparencia" className="gap-2">
              <Palette className="w-4 h-4" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="seguranca" className="gap-2">
              <Lock className="w-4 h-4" />
              Segurança
            </TabsTrigger>
          </TabsList>

          <TabsContent value="perfil">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>Como os clientes e o sistema verão você.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome Completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="nome" 
                          className="pl-10" 
                          value={profileData.nome}
                          onChange={(e) => setProfileData({...profileData, nome: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="email" 
                          type="email" 
                          className="pl-10" 
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        />
                      </div>
                    </div>
                    {isFreelancer && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="especialidade">Especialidade / Cargo</Label>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                              id="especialidade" 
                              className="pl-10" 
                              value={profileData.especialidade}
                              onChange={(e) => setProfileData({...profileData, especialidade: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="valorHora">Valor/Hora Padrão (R$)</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                              id="valorHora" 
                              type="number" 
                              className="pl-10" 
                              value={profileData.valorHora}
                              onChange={(e) => setProfileData({...profileData, valorHora: e.target.value})}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <Button type="submit" disabled={isLoading} className="gap-2">
                    <Save className="w-4 h-4" />
                    {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {isFreelancer && (
            <TabsContent value="faturamento">
              <Card>
                <CardHeader>
                  <CardTitle>Dados de Recebimento (Pix)</CardTitle>
                  <CardDescription>Configure onde você deseja receber seus pagamentos.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSavePix} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="chavePix">Chave Pix</Label>
                        <div className="relative">
                          <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input 
                            id="chavePix" 
                            className="pl-10" 
                            value={pixData.chave}
                            onChange={(e) => setPixData({...pixData, chave: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tipoPix">Tipo de Chave</Label>
                        <select 
                          id="tipoPix"
                          className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          value={pixData.tipo}
                          onChange={(e) => setPixData({...pixData, tipo: e.target.value})}
                        >
                          <option>E-mail</option>
                          <option>CPF</option>
                          <option>Telefone</option>
                          <option>Chave Aleatória</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="banco">Instituição Bancária</Label>
                        <Input 
                          id="banco" 
                          value={pixData.banco}
                          onChange={(e) => setPixData({...pixData, banco: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="titular">Nome do Titular</Label>
                        <Input 
                          id="titular" 
                          value={pixData.titular}
                          onChange={(e) => setPixData({...pixData, titular: e.target.value})}
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={isLoading} className="gap-2">
                      <Save className="w-4 h-4" />
                      {isLoading ? 'Salvando...' : 'Salvar Dados de Pix'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="aparencia">
            <Card>
              <CardHeader>
                <CardTitle>Personalização Visual</CardTitle>
                <CardDescription>Escolha como o sistema deve ser exibido para você.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`flex items-center justify-between p-4 border rounded-xl transition-all ${theme === 'light' ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'hover:bg-secondary'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <Sun className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Tema Claro</p>
                        <p className="text-xs text-muted-foreground">Ideal para ambientes iluminados</p>
                      </div>
                    </div>
                    {theme === 'light' && <ShieldCheck className="w-5 h-5 text-primary" />}
                  </button>

                  <button 
                    onClick={() => setTheme('dark')}
                    className={`flex items-center justify-between p-4 border rounded-xl transition-all ${theme === 'dark' ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'hover:bg-secondary'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-900/30 rounded-lg">
                        <Moon className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Tema Escuro</p>
                        <p className="text-xs text-muted-foreground">Mais conforto para seus olhos</p>
                      </div>
                    </div>
                    {theme === 'dark' && <ShieldCheck className="w-5 h-5 text-primary" />}
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seguranca">
            <Card>
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
                <CardDescription>Proteja seu acesso e gerencie sua senha.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button type="submit" variant="destructive" className="gap-2">
                    <Lock className="w-4 h-4" />
                    Alterar Senha
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
