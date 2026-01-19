import { useMemo } from 'react';
import { useAtividades } from './useAtividades';
import { Projeto } from './useProjetos';

const calculateTotalMinutes = (registroHoras: { duracaoMinutos?: number }[] | undefined): number => {
  if (!registroHoras) return 0;
  return registroHoras.reduce((total, registro) => total + (registro.duracaoMinutos || 0), 0);
};

export const useCalculoPagamento = (projetoId: string | undefined) => {
  const { atividades, isLoading: isLoadingAtividades } = useAtividades();

  const { valorTotal, detalhes } = useMemo(() => {
    if (!projetoId) {
      return { valorTotal: 0, detalhes: [] };
    }

    const atividadesDoProjeto = atividades.filter(a => a.projetoId === projetoId);

    let totalGeral = 0;
    const detalhesCalculo: { descricao: string; valor: number; minutos: number }[] = [];

    atividadesDoProjeto.forEach(atividade => {
      const minutosTrabalhados = calculateTotalMinutes(atividade.registroHoras);
      const valorHora = parseFloat(atividade.valorHora as string); 

      if (minutosTrabalhados > 0 && !isNaN(valorHora)) {

        const valorAtividade = (minutosTrabalhados / 60) * valorHora;
        totalGeral += valorAtividade;

        detalhesCalculo.push({
          descricao: atividade.descricao,
          valor: valorAtividade,
          minutos: minutosTrabalhados,
        });
      }
    });

    const valorTotalArredondado = parseFloat(totalGeral.toFixed(2));

    return { valorTotal: valorTotalArredondado, detalhes: detalhesCalculo };
  }, [projetoId, atividades]);

  return {
    valorTotal,
    detalhes,
    isLoading: isLoadingAtividades,
  };
};
