import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';

export interface Atividade {
  id: string;
  descricao: string;
  valorHora: number | string;
  status: 'PENDENTE' | 'CONCLUIDA' | 'PAUSADA';
  projetoId: string;
  projeto?: {
    id: string;
    nome: string;
  };
  registroHoras?: {
    id: string;
    inicio: string;
    fim?: string;
    duracaoMinutos?: number;
  }[];
}

export function useAtividades() {
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAtividades = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/atividades');
      
      setAtividades(response.data);
    } catch (err: any) {
      console.error('Erro ao buscar atividades:', err);
      setError(err.response?.data?.message || 'Erro ao carregar atividades');
    } finally {
      setIsLoading(false);
    }
  };

  const createAtividade = async (data: Omit<Atividade, 'id'>) => {
    try {
      const response = await apiClient.post('/atividades', data);
      await fetchAtividades(); 
      return response.data;
    } catch (err: any) {
      throw err.response?.data?.message || 'Erro ao criar atividade';
    }
  };

  const updateAtividade = async (id: string, data: Partial<Atividade>) => {
    try {
      const response = await apiClient.patch(`/atividades/${id}`, data);
      await fetchAtividades(); 
      return response.data;
    } catch (err: any) {
      throw err.response?.data?.message || 'Erro ao atualizar atividade';
    }
  };

  const deleteAtividade = async (id: string) => {
    try {
      await apiClient.delete(`/atividades/${id}`);
      await fetchAtividades(); 
    } catch (err: any) {
      throw err.response?.data?.message || 'Erro ao deletar atividade';
    }
  };

  useEffect(() => {
    fetchAtividades();
  }, []);

  return {
    atividades,
    isLoading,
    error,
    fetchAtividades,
    createAtividade,
    updateAtividade,
    deleteAtividade,
  };
}
