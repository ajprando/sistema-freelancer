import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProjetos, Projeto } from '@/hooks/useProjetos';
import { useClientes, Cliente } from '@/hooks/useClientes';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProjetoFormProps {
  projeto?: Projeto | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjetoForm({ projeto, isOpen, onClose }: ProjetoFormProps) {
  const { createProjeto, updateProjeto } = useProjetos();
  const { clientes } = useClientes();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    valorTotal: '',
    status: 'EM_ANDAMENTO' as 'EM_ANDAMENTO' | 'FINALIZADO' | 'CANCELADO',
    clienteId: '',
    taxId: '',
    telefone: '',
  });

  useEffect(() => {
    if (projeto && isOpen) {
      setFormData({
        nome: projeto.nome,
        descricao: projeto.descricao || '',
        valorTotal: projeto.valorTotal.toString(),
        status: projeto.status,
        clienteId: projeto.clienteId,
        taxId: projeto.cliente?.taxId || '',
        telefone: projeto.cliente?.telefone || '',
      });
    } else if (isOpen) {
      setFormData({
        nome: '',
        descricao: '',
        valorTotal: '',
        status: 'EM_ANDAMENTO',
        clienteId: '',
        taxId: '',
        telefone: '',
      });
    }
  }, [projeto, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const data = {
        ...formData,
        valorTotal: parseFloat(formData.valorTotal) || 0,
        freelancerId: user.id,
      } as any;

      // Se o cliente já existe, atualizamos os dados dele (taxId e telefone)
      // O backend do AbacatePay exige esses dados
      if (formData.clienteId) {
        await apiClient.patch(`/clientes/${formData.clienteId}`, {
          taxId: formData.taxId,
          telefone: formData.telefone,
        });
      }

      if (projeto) {
        await updateProjeto(projeto.id, data);
        toast.success('Projeto atualizado com sucesso!');
      } else {
        await createProjeto(data);
        toast.success('Projeto criado com sucesso!');
      }
      onClose();
    } catch (error: any) {
      toast.error(error || 'Erro ao salvar projeto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{projeto ? 'Editar Projeto' : 'Novo Projeto'}</DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo para {projeto ? 'atualizar' : 'criar'} seu projeto.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome do Projeto</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Website E-commerce"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descreva o projeto..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="valor">Valor Total (R$)</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={formData.valorTotal}
                  onChange={(e) => setFormData({ ...formData, valorTotal: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
                    <SelectItem value="FINALIZADO">Finalizado</SelectItem>
                    <SelectItem value="CANCELADO">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cliente">Cliente</Label>
              <Select
                value={formData.clienteId}
                onValueChange={(value) => {
                  const selectedCliente = clientes.find(c => c.id === value);
                  setFormData({ 
                    ...formData, 
                    clienteId: value,
                    taxId: selectedCliente?.taxId || '',
                    telefone: selectedCliente?.telefone || ''
                  });
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.clienteId && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 p-3 rounded-lg space-y-3">
                <p className="text-[10px] font-medium text-amber-800 dark:text-amber-300">
                  Dados obrigatórios para cobrança via AbacatePay:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="taxId" className="text-[10px]">CPF/CNPJ</Label>
                    <Input
                      id="taxId"
                      value={formData.taxId}
                      onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                      placeholder="000.000.000-00"
                      className="h-8 text-xs"
                      required
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="telefone" className="text-[10px]">Telefone</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      placeholder="(00) 00000-0000"
                      className="h-8 text-xs"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Projeto'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
