import { IsUUID, IsDecimal } from 'class-validator';

export class CreatePagamentoDto {
  @IsDecimal({ decimal_digits: '1,2' })
  valor: number;

  @IsUUID()
  projetoId: string;
}