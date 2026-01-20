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
import { Pagamento } from '@/hooks/usePagamentos';
import { QrCode, Copy, Check, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface CheckoutPixModalProps {
  pagamento: Pagamento | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (pagamentoId: string) => void;
}

export default function CheckoutPixModal({ pagamento, isOpen, onClose, onSuccess }: CheckoutPixModalProps) {
  const [copied, setCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const pixCode = pagamento?.codigoPix || "";
  
  const qrCodeImage = pagamento?.qrCodeBase64 
    ? (pagamento.qrCodeBase64.startsWith('data:') ? pagamento.qrCodeBase64 : `data:image/png;base64,${pagamento.qrCodeBase64}`)
    : `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixCode || 'sem-dados')}`;

  const handleCopy = () => {
    if (!pixCode) {
      toast.error('Código Pix não disponível');
      return;
    }
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast.success('Código Pix copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  const simulatePayment = async () => {
    if (!pagamento) return;

    setIsSimulating(true);

    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      await onSuccess(pagamento.id);
      toast.success('Simulação de pagamento concluída!');
    } catch (error) {
      toast.error('Erro ao simular e atualizar pagamento.');
    } finally {
      setIsSimulating(false);
      onClose();
    }
  };

  if (!pagamento) return null;

  const isAbacatePay = pagamento.gateway === 'ABACATEPAY';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-primary" />
            Pagamento via Pix {isAbacatePay ? '(AbacatePay)' : '(Mercado Pago)'}
          </DialogTitle>
          <DialogDescription>
            Escaneie o QR Code ou copie o código para pagar.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-6 space-y-6">
          <div className="relative w-48 h-48 bg-white p-2 border-2 border-secondary rounded-xl flex items-center justify-center overflow-hidden">
            {pixCode || pagamento.qrCodeBase64 ? (
              <img 
                src={qrCodeImage} 
                alt="QR Code Pix"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
                <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-[10px]">QR Code indisponível</p>
              </div>
            )}
            
            {isSimulating && (
              <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center text-center p-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                <p className="text-xs font-medium text-foreground">Verificando pagamento...</p>
              </div>
            )}
          </div>

          <div className="text-center space-y-1">
            <p className="text-2xl font-bold text-foreground">
              R$ {Number(pagamento.valor).toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">
              {isAbacatePay ? 'Processado via AbacatePay' : 'Vencimento em 30 minutos'}
            </p>
          </div>

          <div className="w-full space-y-3">
            {pixCode && (
              <div className="relative">
                <input 
                  readOnly 
                  value={pixCode}
                  className="w-full bg-secondary/50 border border-border rounded-lg py-2 px-3 pr-10 text-xs font-mono truncate"
                />
                <button 
                  onClick={handleCopy}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
            )}
            
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 p-3 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
              <p className="text-[10px] text-blue-800 dark:text-blue-300 leading-relaxed">
                {isAbacatePay 
                  ? "Este QR Code foi gerado em tempo real pela API do AbacatePay. O status será atualizado automaticamente após a confirmação."
                  : "Esta é uma simulação de integração. Em um ambiente real, o status seria atualizado automaticamente via Webhook."}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="ghost" onClick={onClose} className="flex-1">Fechar</Button>
          <Button 
            onClick={simulatePayment} 
            disabled={isSimulating || (!pixCode && !pagamento.qrCodeBase64)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            {isSimulating ? 'Processando...' : 'Simular Pagamento'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
