import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api';

export interface Projeto {
  id: string;
  nome: string;
  descricao?: string;
  status: 'EM_ANDAMENTO' | 'FINALIZADO' | 'CANCELADO';
  valorTotal: number;
  criadoEm: string;
  freelancerId: string;
  clienteId: string;
  cliente?: {
    id: string;
    nome: string;
    email: string;
    taxId?: string;
    telefone?: string;
  };
}

export function useProjetos() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjetos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/projetos');
      setProjetos(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar projetos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProjeto = async (data: any) => {
    try {
      const response = await apiClient.post('/projetos', data);
      await fetchProjetos();
      return response.data;
    } catch (err: any) {
      throw err.response?.data?.message || 'Erro ao criar projeto';
    }
  };

  const updateProjeto = async (id: string, data: any) => {
    try {
      const response = await apiClient.patch(`/projetos/${id}`, data);
      await fetchProjetos();
      return response.data;
    } catch (err: any) {
      throw err.response?.data?.message || 'Erro ao atualizar projeto';
    }
  };

  const deleteProjeto = async (id: string) => {
    try {
      await apiClient.delete(`/projetos/${id}`);
      await fetchProjetos();
    } catch (err: any) {
      throw err.response?.data?.message || 'Erro ao deletar projeto';
    }
  };

  useEffect(() => {
    fetchProjetos();
  }, [fetchProjetos]);

  return {
    projetos,
    isLoading,
    error,
    fetchProjetos,
    createProjeto,
    updateProjeto,
    deleteProjeto,
  };
}
