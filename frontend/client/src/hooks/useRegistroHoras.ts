import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';

export interface RegistroHoras {
  id: string;
  inicio: string;
  fim?: string;
  duracaoMinutos?: number;
  atividadeId: string;
}

export function useRegistroHoras() {
  const [registros, setRegistros] = useState<RegistroHoras[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRegistros = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/registro-horas');
      setRegistros(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar registros de horas');
    } finally {
      setIsLoading(false);
    }
  };

  const createRegistro = async (data: Omit<RegistroHoras, 'id'>) => {
    try {
      const response = await apiClient.post('/registro-horas', data);
      setRegistros([...registros, response.data]);
      return response.data;
    } catch (err: any) {
      throw err.response?.data?.message || 'Erro ao criar registro de horas';
    }
  };

  const updateRegistro = async (id: string, data: Partial<RegistroHoras>) => {
    try {
      const response = await apiClient.patch(`/registro-horas/${id}`, data);
      setRegistros(registros.map(r => r.id === id ? response.data : r));
      return response.data;
    } catch (err: any) {
      throw err.response?.data?.message || 'Erro ao atualizar registro de horas';
    }
  };

  const deleteRegistro = async (id: string) => {
    try {
      await apiClient.delete(`/registro-horas/${id}`);
      setRegistros(registros.filter(r => r.id !== id));
    } catch (err: any) {
      throw err.response?.data?.message || 'Erro ao deletar registro de horas';
    }
  };

  useEffect(() => {
    fetchRegistros();
  }, []);

  return {
    registros,
    isLoading,
    error,
    fetchRegistros,
    createRegistro,
    updateRegistro,
    deleteRegistro,
  };
}
