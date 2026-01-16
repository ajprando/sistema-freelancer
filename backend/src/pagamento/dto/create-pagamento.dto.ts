import { IsIn, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreatePagamentoDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  valor: number;

  @IsUUID()
  projetoId: string;

  @IsOptional()
  @IsIn(['MERCADO_PAGO', 'ABACATEPAY'])
  gateway?: 'MERCADO_PAGO' | 'ABACATEPAY';
}
