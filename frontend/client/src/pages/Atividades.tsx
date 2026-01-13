import { useState, useMemo, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Loader2, Trash2, Search, Filter, Edit2, Play, Square, Clock, Briefcase, DollarSign } from 'lucide-react';
import { useAtividades, Atividade } from '@/hooks/useAtividades';
import { useRegistroHoras } from '@/hooks/useRegistroHoras';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import AtividadeForm from '@/components/AtividadeForm';
import RegistroHorasModal from '@/components/RegistroHorasModal';
import LancamentoManualModal from '@/components/LancamentoManualModal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Atividades() {
  const { atividades, isLoading, deleteAtividade, fetchAtividades } = useAtividades();
  const { createRegistro, updateRegistro, registros } = useRegistroHoras();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [selectedAtividade, setSelectedAtividade] = useState<Atividade | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const [activeTimer, setActiveTimer] = useState<{ atividadeId: string; registroId: string; inicio: Date } | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');

  useEffect(() => {
    const registroAtivo = registros.find(r => !r.fim);
    if (registroAtivo) {
      setActiveTimer({
        atividadeId: registroAtivo.atividadeId,
        registroId: registroAtivo.id,
        inicio: new Date(registroAtivo.inicio)
      });
    }
  }, [registros]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTimer) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = now.getTime() - activeTimer.inicio.getTime();
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setElapsedTime(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);
    } else {
      setElapsedTime('00:00:00');
    }
    return () => clearInterval(interval);
  }, [activeTimer]);

  const handleStartTimer = async (atividadeId: string) => {
    if (activeTimer) {
      toast.error('Já existe um cronômetro ativo. Pare-o antes de iniciar outro.');
      return;
    }
    try {
      const novoRegistro = await createRegistro({
        atividadeId,
        inicio: new Date().toISOString(),
      });
      setActiveTimer({
        atividadeId,
        registroId: novoRegistro.id,
        inicio: new Date(novoRegistro.inicio)
      });
      toast.success('Cronômetro iniciado!');
    } catch (error) {
      toast.error('Erro ao iniciar cronômetro');
    }
  };

  const handleStopTimer = async () => {
    if (!activeTimer) return;
    try {
      await updateRegistro(activeTimer.registroId, {
        fim: new Date().toISOString(),
      });
      setActiveTimer(null);
      fetchAtividades(); 
      toast.success('Cronômetro parado e horas registradas!');
    } catch (error) {
      toast.error('Erro ao parar cronômetro');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta atividade?')) return;
    setDeletingId(id);
    try {
      await deleteAtividade(id);
      toast.success('Atividade deletada com sucesso');
    } catch (error) {
      toast.error('Erro ao deletar atividade');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (atividade: Atividade) => {
    setSelectedAtividade(atividade);
    setIsFormOpen(true);
  };

  const handleHistory = (atividade: Atividade) => {
    setSelectedAtividade(atividade);
    setIsHistoryOpen(true);
  };

  const handleManual = (atividade: Atividade) => {
    setSelectedAtividade(atividade);
    setIsManualOpen(true);
  };

  const handleNewAtividade = () => {
    setSelectedAtividade(null);
    setIsFormOpen(true);
  };

  const filteredAtividades = useMemo(() => {
    return atividades.filter((atividade) => {
      const matchesSearch = atividade.descricao.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'todos' || atividade.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [atividades, searchTerm, statusFilter]);

  const currentSelectedAtividade = useMemo(() => {
    if (!selectedAtividade) return null;
    return atividades.find(a => a.id === selectedAtividade.id) || selectedAtividade;
  }, [atividades, selectedAtividade]);

  const stats = useMemo(() => {
    const totalMinutos = filteredAtividades.reduce((acc, curr) => {
      const minutos = curr.registroHoras?.reduce((sum, reg) => sum + (reg.duracaoMinutos || 0), 0) || 0;
      return acc + minutos;
    }, 0);

    const valorTotal = filteredAtividades.reduce((acc, curr) => {
      const minutos = curr.registroHoras?.reduce((sum, reg) => sum + (reg.duracaoMinutos || 0), 0) || 0;
      const valor = (minutos / 60) * Number(curr.valorHora);
      return acc + valor;
    }, 0);

    return {
      horas: Math.floor(totalMinutos / 60),
      minutos: totalMinutos % 60,
      valor: valorTotal,
      quantidade: filteredAtividades.length
    };
  }, [filteredAtividades]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDENTE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CONCLUIDA': return 'bg-green-100 text-green-800 border-green-200';
      case 'PAUSADA': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDENTE': return 'Pendente';
      case 'CONCLUIDA': return 'Concluída';
      case 'PAUSADA': return 'Pausada';
      default: return status;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Atividades</h1>
            <p className="text-muted-foreground mt-1">Gerencie suas atividades e tarefas</p>
          </div>
          <Button onClick={handleNewAtividade} className="gap-2 w-full md:w-auto">
            <Plus className="w-4 h-4" />
            Nova Atividade
          </Button>
        </div>

        {/* Totalizadores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tempo Total</p>
                  <h3 className="text-2xl font-bold">{stats.horas}h {stats.minutos}m</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-green-500/5 border-green-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Valor Acumulado</p>
                  <h3 className="text-2xl font-bold text-green-600">
                    R$ {stats.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Atividades</p>
                  <h3 className="text-2xl font-bold">{stats.quantidade}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por descrição..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="gap-2">
                <Filter className="w-4 h-4" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="PENDENTE">Pendente</SelectItem>
                <SelectItem value="CONCLUIDA">Concluída</SelectItem>
                <SelectItem value="PAUSADA">Pausada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Minhas Atividades</CardTitle>
            <CardDescription>
              Lista de atividades com registro de horas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : filteredAtividades.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                Nenhuma atividade encontrada.
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredAtividades.map((atividade) => {
                  const isTimerRunning = activeTimer?.atividadeId === atividade.id;
                  const totalMinutosAtividade = atividade.registroHoras?.reduce((sum, reg) => sum + (reg.duracaoMinutos || 0), 0) || 0;
                  const horas = Math.floor(totalMinutosAtividade / 60);
                  const minutos = totalMinutosAtividade % 60;

                  return (
                    <div
                      key={atividade.id}
                      className={`flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg transition-all ${
                        isTimerRunning ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:bg-secondary/50'
                      }`}
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{atividade.descricao}</h3>
                          {isTimerRunning && (
                            <Badge className="animate-pulse bg-primary text-primary-foreground">
                              Em execução: {elapsedTime}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Briefcase className="w-3 h-3" />
                            {atividade.projeto?.nome || 'Sem projeto'}
                          </div>
                          <Badge variant="outline" className={getStatusColor(atividade.status)}>
                            {getStatusLabel(atividade.status)}
                          </Badge>
                          <span className="text-sm font-medium text-muted-foreground">
                            R$ {Number(atividade.valorHora).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/h
                          </span>
                          <span className="text-sm font-medium text-primary flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {horas}h {minutos}m registrados
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-4 md:mt-0">
                        {isTimerRunning ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleStopTimer}
                            className="gap-2"
                          >
                            <Square className="w-4 h-4 fill-current" />
                            Parar
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStartTimer(atividade.id)}
                              className="gap-2 hover:bg-primary/10 text-primary border-primary/20"
                              disabled={!!activeTimer}
                            >
                              <Play className="w-4 h-4 fill-current" />
                              Iniciar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleManual(atividade)}
                              className="gap-2 hover:bg-secondary"
                              disabled={!!activeTimer}
                            >
                              <Plus className="w-4 h-4" />
                              Manual
                            </Button>
                          </div>
                        )}
                        <div className="h-8 w-px bg-border mx-1" />
                        
                        <button
                          onClick={() => handleHistory(atividade)}
                          className="p-2 hover:bg-primary/10 rounded-lg transition-colors group/btn"
                          title="Ver Histórico"
                        >
                          <Clock className="w-4 h-4 text-primary" />
                        </button>
                        
                        <button
                          onClick={() => handleEdit(atividade)}
                          className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                          title="Editar Atividade"
                        >
                          <Edit2 className="w-4 h-4 text-primary" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(atividade.id)}
                          disabled={deletingId === atividade.id}
                          className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Excluir Atividade"
                        >
                          {deletingId === atividade.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-destructive" />
                          ) : (
                            <Trash2 className="w-4 h-4 text-destructive" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AtividadeForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          fetchAtividades();
        }}
        atividade={selectedAtividade}
      />

      <RegistroHorasModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onUpdate={fetchAtividades}
        atividade={currentSelectedAtividade}
      />

      <LancamentoManualModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        onUpdate={fetchAtividades}
        atividade={currentSelectedAtividade}
      />
    </DashboardLayout>
  );
}
