import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Atividade } from '@/hooks/useAtividades';
import { useRegistroHoras } from '@/hooks/useRegistroHoras';
import { Calendar, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface LancamentoManualModalProps {
  atividade: Atividade | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function LancamentoManualModal({ atividade, isOpen, onClose, onUpdate }: LancamentoManualModalProps) {
  const { createRegistro } = useRegistroHoras();
  const [isLoading, setIsLoading] = useState(false);
  
  const initialData = {
    data: new Date().toISOString().split('T')[0],
    inicio: '09:00',
    fim: '10:00',
  };

  const [manualData, setManualData] = useState(initialData);

  if (!atividade) return null;

  const handleClose = () => {
    setManualData(initialData);
    onClose();
  };

  const handleAddManual = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const inicio = new Date(`${manualData.data}T${manualData.inicio}:00`).toISOString();
      const fim = new Date(`${manualData.data}T${manualData.fim}:00`).toISOString();

      if (new Date(fim) <= new Date(inicio)) {
        toast.error('O horário de término deve ser após o início');
        setIsLoading(false);
        return;
      }

      await createRegistro({
        atividadeId: atividade.id,
        inicio,
        fim,
      });

      toast.success('Horas adicionadas manualmente!');
      onUpdate();
      handleClose();
    } catch (error) {
      toast.error('Erro ao adicionar horas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleAddManual}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Lançamento Manual
            </DialogTitle>
            <DialogDescription>
              Adicione horas trabalhadas para: <strong>{atividade.descricao}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="data">Data</Label>
              <Input 
                id="data"
                type="date" 
                value={manualData.data} 
                onChange={e => setManualData({...manualData, data: e.target.value})}
                required 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="inicio">Início</Label>
                <Input 
                  id="inicio"
                  type="time" 
                  value={manualData.inicio} 
                  onChange={e => setManualData({...manualData, inicio: e.target.value})}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fim">Término</Label>
                <Input 
                  id="fim"
                  type="time" 
                  value={manualData.fim} 
                  onChange={e => setManualData({...manualData, fim: e.target.value})}
                  required 
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Horas'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
