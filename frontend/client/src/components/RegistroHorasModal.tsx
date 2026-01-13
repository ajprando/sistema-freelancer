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
import { Badge } from '@/components/ui/badge';
import { Atividade } from '@/hooks/useAtividades';
import { useRegistroHoras } from '@/hooks/useRegistroHoras';
import { Clock, Calendar, Trash2, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface RegistroHorasModalProps {
  atividade: Atividade | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function RegistroHorasModal({ atividade, isOpen, onClose, onUpdate }: RegistroHorasModalProps) {
  const { createRegistro, deleteRegistro } = useRegistroHoras();
  if (!atividade) return null;

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este registro de tempo?')) return;
    try {
      await deleteRegistro(id);
      toast.success('Registro removido');
      onUpdate();
    } catch (error) {
      toast.error('Erro ao remover registro');
    }
  };

  const formatDuration = (minutes: number | undefined) => {
    if (!minutes) return '0m';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Histórico: {atividade.descricao}
          </DialogTitle>
          <DialogDescription>
            Visualize e gerencie os registros de tempo desta atividade.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Registros</h4>
          </div>

          <div className="space-y-2">
            {atividade.registroHoras && atividade.registroHoras.length > 0 ? (
              atividade.registroHoras
                .filter(r => r.fim) 
                .sort((a, b) => new Date(b.inicio).getTime() - new Date(a.inicio).getTime())
                .map((registro) => (
                  <div key={registro.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary/20 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-secondary rounded-full">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {new Date(registro.inicio).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(registro.inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - 
                          {new Date(registro.fim!).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="font-mono">
                        {formatDuration(registro.duracaoMinutos)}
                      </Badge>
                      <button 
                        onClick={() => handleDelete(registro.id)}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors group/btn"
                        title="Excluir registro"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Nenhum registro de tempo concluído.
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={onClose} className="w-full">Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
