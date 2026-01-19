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
  DollarSign, 
  Clock, 
  CheckCircle2, 
  QrCode, 
  MoreHorizontal,
  ArrowUpRight,
  Calendar,
  CreditCard,
  Plus
} from 'lucide-react';
import { usePagamentos, Pagamento } from '@/hooks/usePagamentos';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CheckoutPixModal from '@/components/CheckoutPixModal';
import PagamentoFormModal from '@/components/PagamentoFormModal';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function Pagamentos() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { pagamentos, isLoading, updatePagamento, deletePagamento, fetchPagamentos } = usePagamentos();
  
  const isFreelancer = user?.tipo?.toUpperCase() === 'FREELANCER';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [selectedPagamento, setSelectedPagamento] = useState<Pagamento | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const stats = useMemo(() => {
    const totalRecebido = pagamentos
      .filter(p => (p.status as string) === 'PAGO' || (p.status as string) === 'PAID')
      .reduce((acc, curr) => acc + Number(curr.valor), 0);
    
    const totalPendente = pagamentos
      .filter(p => (p.status as string) === 'PENDENTE' || (p.status as string) === 'PENDING')
      .reduce((acc, curr) => acc + Number(curr.valor), 0);

    const faturamentoMes = pagamentos
      .filter(p => {
        const data = new Date(p.criadoEm);
        const hoje = new Date();
        return ((p.status as string) === 'PAGO' || (p.status as string) === 'PAID') && 
               data.getMonth() === hoje.getMonth() && 
               data.getFullYear() === hoje.getFullYear();
      })
      .reduce((acc, curr) => acc + Number(curr.valor), 0);

    return { totalRecebido, totalPendente, faturamentoMes };
  }, [pagamentos]);

  const pagamentosFiltrados = useMemo(() => {
    return pagamentos.filter(p => {
      const matchesSearch = p.projeto?.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.projeto?.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'todos' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [pagamentos, searchTerm, statusFilter]);

  const handleMarkAsPaid = async (id: string) => {
    try {
      await updatePagamento(id, { status: 'PAGO' });
      toast.success('Pagamento marcado como pago!');
      fetchPagamentos();
    } catch (error) {
      toast.error('Erro ao atualizar pagamento');
    }
  };

  const handleOpenCheckout = (pagamento: Pagamento) => {
    setSelectedPagamento(pagamento);
    setIsCheckoutOpen(true);
  };

  const handleViewProject = (projetoId?: string) => {
    if (projetoId) {
      setLocation(`/projetos`); 
    } else {
      toast.error('Projeto não identificado');
    }
  };

  const handleCancelInvoice = async (id: string) => {
    if (confirm('Tem certeza que deseja cancelar esta fatura? Esta ação não pode ser desfeita.')) {
      try {
        await deletePagamento(id);
        toast.success('Fatura cancelada com sucesso');
        fetchPagamentos();
      } catch (error) {
        toast.error('Erro ao cancelar fatura');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAGO':
      case 'PAID':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Pago</Badge>;
      case 'PENDENTE':
      case 'PENDING':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pendente</Badge>;
      case 'FALHOU':
      case 'EXPIRED':
      case 'CANCELLED':
        return <Badge className="bg-rose-100 text-rose-800 border-rose-200">Falhou/Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
	        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
	          <div>
	            <h1 className="text-3xl font-bold text-foreground tracking-tight">Pagamentos</h1>
	            <p className="text-muted-foreground mt-1">Gestão financeira e faturamento de projetos.</p>
	          </div>
	          {isFreelancer && (
	            <Button onClick={() => setIsFormOpen(true)} className="gap-2">
	              <Plus className="w-4 h-4" />
	              Nova Cobrança
	            </Button>
	          )}
	        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Total Recebido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                R$ {stats.totalRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50/50 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Aguardando Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                R$ {stats.totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                {isFreelancer ? "Faturamento do Mês" : "Investimento do Mês"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                R$ {stats.faturamentoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por projeto ou cliente..."
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
              <option value="PENDENTE">Pendentes</option>
              <option value="PAGO">Pagos</option>
              <option value="FALHOU">Falhou</option>
            </select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Faturas e Cobranças</CardTitle>
            <CardDescription>Gerencie as faturas enviadas aos seus clientes.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : pagamentosFiltrados.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Nenhum pagamento encontrado para os filtros aplicados.
              </div>
            ) : (
              <div className="space-y-4">
                {pagamentosFiltrados.map((pagamento) => (
                  <div 
                    key={pagamento.id} 
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-xl hover:bg-secondary/30 transition-colors gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-secondary rounded-lg">
                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {pagamento.projeto?.nome || 'Projeto não identificado'}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" />
                            Cliente: <span className="text-foreground font-medium">{pagamento.projeto?.cliente?.nome || 'N/A'}</span>
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(pagamento.criadoEm).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6">
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                          R$ {Number(pagamento.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        {getStatusBadge(pagamento.status)}
                      </div>

                      <div className="flex items-center gap-2">
                        {!isFreelancer && ((pagamento.status as string) === 'PENDENTE' || (pagamento.status as string) === 'PENDING') && (
                          <Button 
                            size="sm" 
                            className="gap-2 bg-primary hover:bg-primary/90"
                            onClick={() => handleOpenCheckout(pagamento)}
                          >
                            <QrCode className="w-4 h-4" />
                            Pagar Pix
                          </Button>
                        )}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {isFreelancer && pagamento.status === 'PENDENTE' && (
                              <DropdownMenuItem onClick={() => handleMarkAsPaid(pagamento.id)}>
                                Marcar como Pago
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleViewProject(pagamento.projetoId)}>
                              Ver Detalhes do Projeto
                            </DropdownMenuItem>
                            {isFreelancer && (
                              <DropdownMenuItem 
                                className="text-rose-600"
                                onClick={() => handleCancelInvoice(pagamento.id)}
                              >
                                Cancelar Fatura
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CheckoutPixModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        pagamento={selectedPagamento}
        onSuccess={async (pagamentoId: string) => {
          await updatePagamento(pagamentoId, { status: 'PAID' });
          fetchPagamentos();
          toast.success('Pagamento simulado e atualizado com sucesso!');
        }}
	      />

	      {isFreelancer && (
	        <PagamentoFormModal
	          isOpen={isFormOpen}
	          onClose={() => setIsFormOpen(false)}
	          onSuccess={() => {
	            fetchPagamentos();
	            toast.success('Cobrança criada com sucesso!');
	          }}
	        />
	      )}
	    </DashboardLayout>
	  );
	}
