import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagamento, usePagamentos } from '@/hooks/usePagamentos';
import { useProjetos } from '@/hooks/useProjetos';
import { useCalculoPagamento } from '@/hooks/useCalculoPagamento';
import { toast } from 'sonner';
import { Loader2, DollarSign, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PagamentoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (pagamento: Pagamento) => void;
}

export default function PagamentoFormModal({ isOpen, onClose, onSuccess }: PagamentoFormModalProps) {
  const [projetoId, setProjetoId] = useState<string>('');
  const [gateway, setGateway] = useState<'MERCADO_PAGO' | 'ABACATEPAY'>('ABACATEPAY');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createPagamento } = usePagamentos();
  const { projetos, isLoading: isLoadingProjetos } = useProjetos();
  const { valorTotal, detalhes, isLoading: isLoadingCalculo } = useCalculoPagamento(projetoId);

  const isLoading = isLoadingProjetos || isLoadingCalculo;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projetoId) {
      toast.error('Selecione um projeto.');
      return;
    }
    if (valorTotal <= 0) {
      toast.error('O valor da cobrança deve ser maior que zero. Verifique as atividades e registros de horas.');
      return;
    }

    setIsSubmitting(true);
    try {
     
      const pagamento = await createPagamento({
        projetoId,
        valor: valorTotal,
        status: 'PENDENTE',
        gateway,
      });

      toast.success('Cobrança criada com sucesso!');
      onSuccess(pagamento);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao criar cobrança. Verifique se o projeto já tem uma cobrança pendente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const projetoSelecionado = projetos.find(p => p.id === projetoId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gerar Cobrança por Projeto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="projetoId">Projeto</Label>
            <Select onValueChange={setProjetoId} value={projetoId} disabled={isLoading || isSubmitting}>
              <SelectTrigger id="projetoId">
                <SelectValue placeholder={isLoadingProjetos ? "Carregando projetos..." : "Selecione um projeto"} />
              </SelectTrigger>
              <SelectContent>
                {projetos.map((projeto) => (
                  <SelectItem key={projeto.id} value={projeto.id}>
                    {projeto.nome} ({projeto.cliente?.nome})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="gateway">Gateway</Label>
            <Select
              onValueChange={(value) => setGateway(value as 'MERCADO_PAGO' | 'ABACATEPAY')}
              value={gateway}
              disabled={isLoading || isSubmitting}
            >
              <SelectTrigger id="gateway">
                <SelectValue placeholder="Selecione o gateway" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ABACATEPAY">AbacatePay</SelectItem>
                <SelectItem value="MERCADO_PAGO">Mercado Pago</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {projetoId && (
            <div className="space-y-3 p-4 border rounded-lg bg-secondary/50">
              <h3 className="text-sm font-semibold text-foreground">Detalhes da Cobrança</h3>
              
              {isLoadingCalculo ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Calculando valor...</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center text-lg font-bold text-primary">
                    <span>Valor Total a Cobrar:</span>
                    <span>R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="font-medium">Baseado nas seguintes atividades:</p>
                    {detalhes.length > 0 ? (
                      detalhes.map((detalhe, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {detalhe.descricao}
                          </span>
                          <span>
                            R$ {detalhe.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({Math.round(detalhe.minutos / 60)}h {detalhe.minutos % 60}m)
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-center italic">Nenhuma hora registrada ou valor de atividade zero.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting || !projetoId || valorTotal <= 0 || isLoading}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Gerar Cobrança'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}