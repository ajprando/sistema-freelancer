import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  taxId?: string;
  telefone?: string;
}

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchClientes = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/clientes');
      setClientes(response.data);
    } catch (err: any) {
      console.error('Erro ao carregar clientes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchClientes(); }, []);

  return { clientes, isLoading, fetchClientes };
}
