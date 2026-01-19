import { useState, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Loader2, Trash2, Pencil, Search, User, Folder, ChevronDown, ChevronUp, Clock, CheckCircle2 } from 'lucide-react';
import { useProjetos, Projeto } from '@/hooks/useProjetos';
import { useAtividades } from '@/hooks/useAtividades';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import ProjetoForm from '@/components/ProjetoForm';

export default function Projetos() {
  const { user } = useAuth();
  const isFreelancer = user?.tipo?.toUpperCase() === 'FREELANCER';
  const { projetos, isLoading: loadingProjetos, deleteProjeto, fetchProjetos } = useProjetos();
  const { atividades, isLoading: loadingAtividades } = useAtividades();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProjeto, setSelectedProjeto] = useState<Projeto | null>(null);
  const [expandedProjetoId, setExpandedProjetoId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [clientFilter, setClientFilter] = useState<string>('todos');

  const isLoading = loadingProjetos || loadingAtividades;

  const clientes = useMemo(() => {
    const uniqueClientes = new Set(projetos.map(p => p.cliente?.nome).filter(Boolean));
    return Array.from(uniqueClientes);
  }, [projetos]);

  const projetosFiltrados = useMemo(() => {
    return projetos.filter((projeto) => {
      const busca = searchTerm.toLowerCase();
      const matchesSearch = projeto.nome.toLowerCase().includes(busca) ||
        (projeto.descricao?.toLowerCase() || '').includes(busca) ||
        (projeto.cliente?.nome.toLowerCase() || '').includes(busca);
      
      const matchesClient = clientFilter === 'todos' || projeto.cliente?.nome === clientFilter;
      
      return matchesSearch && matchesClient;
    });
  }, [projetos, searchTerm, clientFilter]);

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

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;

    setDeletingId(id);
    try {
      await deleteProjeto(id);
      toast.success('Projeto deletado com sucesso');
    } catch (error) {
      toast.error('Erro ao deletar projeto');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (projeto: Projeto) => {
    setSelectedProjeto(projeto);
    setIsFormOpen(true);
  };

  const handleNewProject = () => {
    setSelectedProjeto(null);
    setIsFormOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EM_ANDAMENTO': return 'bg-blue-100 text-blue-800';
      case 'FINALIZADO': return 'bg-green-100 text-green-800';
      case 'CANCELADO': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'EM_ANDAMENTO': return 'Em Andamento';
      case 'FINALIZADO': return 'Finalizado';
      case 'CANCELADO': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Projetos</h1>
            <p className="text-muted-foreground mt-1">
              {isFreelancer ? "Gerencie seus projetos e clientes." : "Acompanhe o progresso dos seus projetos contratados."}
            </p>
          </div>
          {isFreelancer && (
            <Button className="gap-2" onClick={handleNewProject}>
              <Plus className="w-4 h-4" />
              Novo Projeto
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, descrição ou cliente..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <User className="w-4 h-4 text-muted-foreground" />
            <select 
              className="bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-48"
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
            >
              <option value="todos">Todos os Clientes</option>
              {clientes.map(cliente => (
                <option key={cliente} value={cliente}>{cliente}</option>
              ))}
            </select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Meus Projetos</CardTitle>
            <CardDescription>
              {searchTerm 
                ? `Encontrados ${projetosFiltrados.length} projetos para "${searchTerm}"`
                : 'Lista de todos os seus projetos'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : projetosFiltrados.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchTerm 
                  ? 'Nenhum projeto corresponde à sua busca.' 
                  : 'Nenhum projeto encontrado. Crie um novo projeto para começar!'}
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
                              <Badge className={getStatusColor(projeto.status)}>
                                {getStatusLabel(projeto.status)}
                              </Badge>
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
                          
                          {isFreelancer && (
                            <div className="flex items-center gap-1 no-print">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleEdit(projeto); }}
                                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                                title="Editar projeto"
                              >
                                <Pencil className="w-4 h-4 text-primary" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(projeto.id); }}
                                disabled={deletingId === projeto.id}
                                className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                                title="Excluir projeto"
                              >
                                {deletingId === projeto.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-destructive" />
                                ) : (
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                )}
                              </button>
                            </div>
                          )}
                          <div className="p-1 text-muted-foreground">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
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
        onClose={() => {
          setIsFormOpen(false);
          fetchProjetos();
        }}
        projeto={selectedProjeto}
      />
    </DashboardLayout>
  );
}
