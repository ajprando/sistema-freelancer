import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';

export interface Pagamento {
  id: string;
  valor: number;
  status: 'PENDENTE' | 'PAGO' | 'FALHOU' | 'PAID' | 'PENDING' | 'EXPIRED' | 'CANCELLED';
  codigoPix?: string;
  qrCodeBase64?: string;
  abacatePayId?: string;
  gateway?: 'MERCADO_PAGO' | 'ABACATEPAY';
  criadoEm: string;
  projetoId: string;
    projeto?: {
    id: string;
    nome: string;
    cliente?: {
      id: string;
      nome: string;
      email: string;
      taxId?: string;
      telefone?: string;
    };
  };
}

export function usePagamentos() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPagamentos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/pagamentos');
      setPagamentos(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar pagamentos');
    } finally {
      setIsLoading(false);
    }
  };

  const createPagamento = async (data: Omit<Pagamento, 'id' | 'criadoEm'>) => {
    try {
      const response = await apiClient.post('/pagamentos', data);
      setPagamentos([...pagamentos, response.data]);
      return response.data;
    } catch (err: any) {
      throw err.response?.data?.message || 'Erro ao criar pagamento';
    }
  };

  const updatePagamento = async (id: string, data: Partial<Pagamento>) => {
    try {
      const response = await apiClient.patch(`/pagamentos/${id}`, data);
      setPagamentos(pagamentos.map(p => p.id === id ? response.data : p));
      return response.data;
    } catch (err: any) {
      throw err.response?.data?.message || 'Erro ao atualizar pagamento';
    }
  };

  const deletePagamento = async (id: string) => {
    try {
      await apiClient.delete(`/pagamentos/${id}`);
      setPagamentos(pagamentos.filter(p => p.id !== id));
    } catch (err: any) {
      throw err.response?.data?.message || 'Erro ao deletar pagamento';
    }
  };

  useEffect(() => {
    fetchPagamentos();
  }, []);

  return {
    pagamentos,
    isLoading,
    error,
    fetchPagamentos,
    createPagamento,
    updatePagamento,
    deletePagamento,
  };
}
