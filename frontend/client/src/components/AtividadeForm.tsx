import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { useAtividades, Atividade } from '@/hooks/useAtividades';
import { useProjetos } from '@/hooks/useProjetos';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AtividadeFormProps {
  atividade?: Atividade | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AtividadeForm({ atividade, isOpen, onClose }: AtividadeFormProps) {
  const { createAtividade, updateAtividade } = useAtividades();
  const { projetos } = useProjetos();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    descricao: '',
    valorHora: '',
    status: 'PENDENTE' as 'PENDENTE' | 'CONCLUIDA' | 'PAUSADA',
    projetoId: '',
  });

  useEffect(() => {
    if (atividade && isOpen) {
      setFormData({
        descricao: atividade.descricao,
        valorHora: atividade.valorHora.toString(),
        status: atividade.status,
        projetoId: atividade.projetoId,
      });
    } else if (isOpen) {
      setFormData({
        descricao: '',
        valorHora: '',
        status: 'PENDENTE',
        projetoId: '',
      });
    }
  }, [atividade, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const valorLimpo = formData.valorHora.replace(',', '.');
      const valorNumerico = parseFloat(valorLimpo);
      
      if (isNaN(valorNumerico)) {
        toast.error('Por favor, insira um valor válido para o valor/hora');
        setIsLoading(false);
        return;
      }

      const data = {
        ...formData,
        valorHora: valorNumerico.toFixed(2), 
      };

      if (atividade) {
        await updateAtividade(atividade.id, data);
        toast.success('Atividade atualizada com sucesso!');
      } else {
        await createAtividade(data);
        toast.success('Atividade criada com sucesso!');
      }
      onClose();
    } catch (error: any) {
      toast.error(error || 'Erro ao salvar atividade');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{atividade ? 'Editar Atividade' : 'Nova Atividade'}</DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo para {atividade ? 'atualizar' : 'criar'} sua atividade.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Ex: Desenvolvimento de API"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="valorHora">Valor/Hora (R$)</Label>
                <Input
                  id="valorHora"
                  type="number"
                  step="0.01"
                  value={formData.valorHora}
                  onChange={(e) => setFormData({ ...formData, valorHora: e.target.value })}
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
                    <SelectItem value="PENDENTE">Pendente</SelectItem>
                    <SelectItem value="CONCLUIDA">Concluída</SelectItem>
                    <SelectItem value="PAUSADA">Pausada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="projeto">Projeto</Label>
              <Select
                value={formData.projetoId}
                onValueChange={(value) => setFormData({ ...formData, projetoId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um projeto" />
                </SelectTrigger>
                <SelectContent>
                  {projetos.map((projeto) => (
                    <SelectItem key={projeto.id} value={projeto.id}>
                      {projeto.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                'Salvar Atividade'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
