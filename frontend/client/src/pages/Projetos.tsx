import { useState, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Search, 
  Filter, 
  Briefcase, 
  User, 
  DollarSign, 
  MoreHorizontal,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Pencil,
  Trash2,
  Folder,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useProjetos, Projeto } from '@/hooks/useProjetos';
import { useAtividades } from '@/hooks/useAtividades';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProjetoForm from '@/components/ProjetoForm';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import { Progress } from '@/components/ui/progress';

export default function Projetos() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { projetos, isLoading: loadingProjetos, updateProjeto, deleteProjeto, fetchProjetos } = useProjetos();
  const { atividades, isLoading: loadingAtividades } = useAtividades();
  
  const isFreelancer = user?.tipo?.toUpperCase() === 'FREELANCER';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProjeto, setEditingProjeto] = useState<Projeto | null>(null);
  const [expandedProjetoId, setExpandedProjetoId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isLoading = loadingProjetos || loadingAtividades;

  const stats = useMemo(() => {
    const totalProjetos = projetos.length;
    const emAndamento = projetos.filter(p => p.status === 'EM_ANDAMENTO').length;
    const finalizados = projetos.filter(p => p.status === 'FINALIZADO').length;
    const valorTotal = projetos.reduce((acc, curr) => acc + Number(curr.valorTotal), 0);

    return { totalProjetos, emAndamento, finalizados, valorTotal };
  }, [projetos]);

  const projetosFiltrados = useMemo(() => {
    return projetos.filter(p => {
      const matchesSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'todos' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projetos, searchTerm, statusFilter]);

  const getProjetoStats = (projetoId: string) => {
    const atividadesDoProjeto = atividades.filter(a => a.projetoId === projetoId);
    const total = atividadesDoProjeto.length;
    const concluidas = atividadesDoProjeto.filter(a => a.status === 'CONCLUIDA').length;
    const progresso = total > 0 ? Math.round((concluidas / total) * 100) : 0;
    
    const totalMinutos = atividadesDoProjeto.reduce((acc, a) => {
      return acc + (a.registroHoras?.reduce((rAcc, r) => rAcc + (r.duracaoMinutos || 0), 0) || 0);
    }, 0);

    return {
      progresso,
      totalAtividades: total,
      concluidas,
      horas: Math.floor(totalMinutos / 60),
      minutos: totalMinutos % 60,
      atividades: atividadesDoProjeto
    };
  };

  const handleOpenForm = (projeto: Projeto | null = null) => {
    setEditingProjeto(projeto);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProjeto(null);
    fetchProjetos();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este projeto? Esta ação não pode ser desfeita.')) {
      setDeletingId(id);
      try {
        await deleteProjeto(id);
        toast.success('Projeto deletado com sucesso!');
      } catch (error) {
        toast.error('Erro ao deletar projeto');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleUpdateStatus = async (id: string, status: 'EM_ANDAMENTO' | 'FINALIZADO' | 'CANCELADO') => {
    try {
      await updateProjeto(id, { status });
      toast.success(`Status do projeto atualizado para ${status.replace('_', ' ')}!`);
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'EM_ANDAMENTO':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Em Andamento</Badge>;
      case 'FINALIZADO':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Finalizado</Badge>;
      case 'CANCELADO':
        return <Badge className="bg-rose-100 text-rose-800 border-rose-200">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Projetos</h1>
            <p className="text-muted-foreground mt-1">Gerencie todos os seus projetos e clientes.</p>
          </div>
          {isFreelancer && (
            <Button onClick={() => handleOpenForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Projeto
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-secondary/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Total de Projetos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalProjetos}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Em Andamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {stats.emAndamento}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Finalizados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                {stats.finalizados}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Valor Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {stats.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome do projeto ou cliente..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select 
              className="bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="todos">Todos os Status</option>
              <option value="EM_ANDAMENTO">Em Andamento</option>
              <option value="FINALIZADO">Finalizado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Projetos</CardTitle>
            <CardDescription>Projetos ativos e concluídos.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : projetosFiltrados.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Nenhum projeto encontrado para os filtros aplicados.
              </div>
            ) : (
              <div className="space-y-4">
                {projetosFiltrados.map((projeto) => {
                  const stats = getProjetoStats(projeto.id);
                  const isExpanded = expandedProjetoId === projeto.id;

                  return (
                    <div key={projeto.id} className="border border-border rounded-lg overflow-hidden">
                      <div
                        className={`flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-secondary/50 transition-colors cursor-pointer gap-6 ${isExpanded ? 'bg-secondary/30 border-b' : ''}`}
                        onClick={() => setExpandedProjetoId(isExpanded ? null : projeto.id)}
                      >
                        <div className="flex items-start gap-4 flex-1 min-w-[250px]">
                          <div className="p-2 bg-primary/10 rounded-lg mt-1 shrink-0">
                            <Folder className="w-5 h-5 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-foreground">{projeto.nome}</h3>
                              {getStatusBadge(projeto.status)}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {projeto.descricao || 'Sem descrição'}
                            </p>
                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                              <User className="w-3 h-3" />
                              <span className="font-medium text-foreground">{projeto.cliente?.nome || 'Não informado'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 max-w-md w-full space-y-2">
                          <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {stats.horas}h {stats.minutos}m trabalhados
                            </span>
                            <span>{stats.progresso}% concluído</span>
                          </div>
                          <Progress value={stats.progresso} className="h-2 w-full" />
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-6 shrink-0">
                          <div className="text-right">
                            <div className="text-sm font-bold text-primary">
                              R$ {Number(projeto.valorTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                            <p className="text-[10px] text-muted-foreground">Valor Total</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="gap-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                setLocation(`/atividades?projetoId=${projeto.id}`);
                              }}
                            >
                              <ArrowUpRight className="w-4 h-4" />
                              Ver Atividades
                            </Button>
                            
                            {isFreelancer && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleOpenForm(projeto)}>
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Editar Projeto
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleUpdateStatus(projeto.id, 'FINALIZADO')}>
                                    <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
                                    Marcar como Finalizado
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleUpdateStatus(projeto.id, 'CANCELADO')}>
                                    <XCircle className="w-4 h-4 mr-2 text-rose-600" />
                                    Marcar como Cancelado
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-rose-600"
                                    onClick={() => handleDelete(projeto.id)}
                                    disabled={deletingId === projeto.id}
                                  >
                                    {deletingId === projeto.id ? (
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                      <Trash2 className="w-4 h-4 mr-2" />
                                    )}
                                    Deletar Projeto
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="bg-secondary/10 p-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Atividades do Projeto ({stats.totalAtividades})
                          </h4>
                          {stats.atividades.length > 0 ? (
                            <div className="grid gap-2">
                              {stats.atividades.map((atividade) => (
                                <div key={atividade.id} className="flex items-center justify-between p-3 bg-background border rounded-lg text-sm">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${
                                      atividade.status === 'CONCLUIDA' ? 'bg-emerald-500' : 
                                      atividade.status === 'PENDENTE' ? 'bg-amber-500' : 'bg-gray-400'
                                    }`} />
                                    <span className="font-medium">{atividade.descricao}</span>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    {isFreelancer && <span>R$ {Number(atividade.valorHora).toFixed(2)}/h</span>}
                                    <Badge variant="outline" className="text-[10px] py-0 h-5">
                                      {atividade.status}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground py-2 italic">Nenhuma atividade vinculada a este projeto.</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ProjetoForm 
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        projeto={editingProjeto}
      />
    </DashboardLayout>
  );
}
