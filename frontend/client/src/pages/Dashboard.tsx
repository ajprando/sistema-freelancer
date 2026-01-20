import { useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  TrendingUp, 
  Clock, 
  Briefcase, 
  CheckCircle2, 
  DollarSign,
  Printer
} from 'lucide-react';
import { useProjetos } from '@/hooks/useProjetos';
import { useAtividades } from '@/hooks/useAtividades';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const { projetos, isLoading: loadingProjetos } = useProjetos();
  const { atividades, isLoading: loadingAtividades } = useAtividades();

  const isLoading = loadingProjetos || loadingAtividades;
  const isFreelancer = user?.tipo?.toUpperCase() === 'FREELANCER';

  const stats = useMemo(() => {
    if (!projetos || !atividades) return null;

    const totalProjetos = projetos.length;
    const projetosAtivos = projetos.filter(p => p.status === 'EM_ANDAMENTO').length;
    const projetosFinalizados = projetos.filter(p => p.status === 'FINALIZADO').length;

    const totalAtividades = atividades.length;
    const atividadesConcluidas = atividades.filter(a => a.status === 'CONCLUIDA').length;
    const atividadesPendentes = atividades.filter(a => a.status === 'PENDENTE').length;

    let totalMinutos = 0;
    let receitaTotal = 0;
    let receitaPendente = 0;

    atividades.forEach(atividade => {
      const valorHora = Number(atividade.valorHora || 0);
      const minutosAtividade = atividade.registroHoras?.reduce((acc, reg) => acc + (reg.duracaoMinutos || 0), 0) || 0;
      
      totalMinutos += minutosAtividade;
      const valorAtividade = (minutosAtividade / 60) * valorHora;

      if (atividade.status === 'CONCLUIDA') {
        receitaTotal += valorAtividade;
      } else {
        receitaPendente += valorAtividade;
      }
    });

    const atividadesData = [
      { name: 'Concluídas', value: atividadesConcluidas, color: '#10b981' },
      { name: 'Pendentes', value: atividadesPendentes, color: '#f59e0b' },
      { name: 'Pausadas', value: atividades.filter(a => a.status === 'PAUSADA').length, color: '#6b7280' },
    ].filter(d => d.value > 0);

    const receitaPorProjeto = projetos.map(p => {
      const atividadesDoProjeto = atividades.filter(a => a.projetoId === p.id);
      const receita = atividadesDoProjeto.reduce((acc, a) => {
        const mins = a.registroHoras?.reduce((rAcc, r) => rAcc + (r.duracaoMinutos || 0), 0) || 0;
        return acc + (mins / 60) * Number(a.valorHora || 0);
      }, 0);
      return { name: p.nome, receita };
    }).sort((a, b) => b.receita - a.receita).slice(0, 5);

    return {
      totalProjetos,
      projetosAtivos,
      projetosFinalizados,
      totalAtividades,
      atividadesConcluidas,
      atividadesPendentes,
      horasTrabalhadas: Math.floor(totalMinutos / 60),
      minutosRestantes: totalMinutos % 60,
      receitaTotal,
      receitaPendente,
      atividadesData,
      receitaPorProjeto
    };
  }, [projetos, atividades]);

  const projetosComProgresso = useMemo(() => {
    return projetos
      .filter(p => p.status === 'EM_ANDAMENTO')
      .map(p => {
        const atividadesDoProjeto = atividades.filter(a => a.projetoId === p.id);
        const total = atividadesDoProjeto.length;
        const concluidas = atividadesDoProjeto.filter(a => a.status === 'CONCLUIDA').length;
        const progresso = total > 0 ? Math.round((concluidas / total) * 100) : 0;
        return { ...p, progresso, totalAtividades: total };
      })
      .sort((a, b) => b.progresso - a.progresso)
      .slice(0, 4);
  }, [projetos, atividades]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!stats) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardLayout>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          nav, aside, button, .no-print { display: none !important; }
          main { margin: 0 !important; padding: 0 !important; }
          .grid { display: block !important; }
          .card { break-inside: avoid; margin-bottom: 1rem; border: 1px solid #e2e8f0 !important; }
          .p-6 { padding: 0 !important; }
          h1 { font-size: 24pt !important; }
          .recharts-responsive-container { height: 300px !important; width: 100% !important; }
        }
      `}} />
      <div className="p-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              {isFreelancer 
                ? "Visão geral do seu desempenho e finanças." 
                : "Acompanhe o progresso dos seus projetos contratados."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handlePrint}>
              <Printer className="w-4 h-4" />
              Exportar PDF
            </Button>
          </div>
        </div>

        <div className="hidden print:block border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold">Relatório de Desempenho</h1>
          <p className="text-sm text-muted-foreground">Gerado em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isFreelancer ? (
            <>
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Faturamento Total</CardTitle>
                  <DollarSign className="w-4 h-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ {stats.receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  <p className="text-xs text-muted-foreground mt-1">Projetos concluídos</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-amber-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Receita Pendente</CardTitle>
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ {stats.receitaPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  <p className="text-xs text-muted-foreground mt-1">Em atividades abertas</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-emerald-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Tempo Total</CardTitle>
                  <Clock className="w-4 h-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.horasTrabalhadas}h {stats.minutosRestantes}m</div>
                  <p className="text-xs text-muted-foreground mt-1">Registrados no sistema</p>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Investimento Total</CardTitle>
                  <DollarSign className="w-4 h-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ {(stats.receitaTotal + stats.receitaPendente).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  <p className="text-xs text-muted-foreground mt-1">Valor total dos projetos</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-emerald-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Atividades Concluídas</CardTitle>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.atividadesConcluidas}</div>
                  <p className="text-xs text-muted-foreground mt-1">De {stats.totalAtividades} tarefas totais</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-amber-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Progresso Médio</CardTitle>
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalAtividades > 0 ? Math.round((stats.atividadesConcluidas / stats.totalAtividades) * 100) : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Conclusão geral</p>
                </CardContent>
              </Card>
            </>
          )}

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Projetos Ativos</CardTitle>
              <Briefcase className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.projetosAtivos}</div>
              <p className="text-xs text-muted-foreground mt-1">De {stats.totalProjetos} projetos totais</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {isFreelancer ? "Receita por Projeto" : "Investimento por Projeto"}
              </CardTitle>
              <CardDescription>Top 5 projetos com maior valor</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.receitaPorProjeto}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => `R$${value}`} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Valor']}
                  />
                  <Bar dataKey="receita" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Status das Atividades</CardTitle>
              <CardDescription>Distribuição de tarefas</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.atividadesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.atividadesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2">
                {stats.atividadesData.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Progresso dos Projetos Ativos</CardTitle>
              <CardDescription>Acompanhamento em tempo real</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {projetosComProgresso.length > 0 ? (
                projetosComProgresso.map(projeto => (
                  <div key={projeto.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{projeto.nome}</span>
                      <span className="text-muted-foreground">{projeto.progresso}%</span>
                    </div>
                    <Progress value={projeto.progresso} className="h-2" />
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  Nenhum projeto em andamento no momento.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Resumo de Atividades</CardTitle>
              <CardDescription>Status atual das tarefas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm font-medium">Concluídas</span>
                  </div>
                  <span className="text-lg font-bold text-emerald-600">{stats.atividadesConcluidas}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <span className="text-sm font-medium">Pendentes</span>
                  </div>
                  <span className="text-lg font-bold text-amber-600">{stats.atividadesPendentes}</span>
                </div>
                <div className="mt-6 p-4 border border-dashed rounded-lg">
                  <p className="text-xs text-muted-foreground text-center italic">
                    {isFreelancer 
                      ? "Dica: Mantenha suas atividades atualizadas para um faturamento preciso."
                      : "Acompanhe o status das tarefas para saber a previsão de entrega."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
