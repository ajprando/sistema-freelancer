import { IsDecimal, IsUUID, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { PagamentoStatus } from '@prisma/client';

export class CreatePagamentoDto {
  @IsDecimal({ decimal_digits: '1,2' })
  valor: number;

  @IsUUID()
  projetoId: string;

  @IsEnum(PagamentoStatus)
  @IsOptional()
  status?: PagamentoStatus;

  @IsOptional()
  @MaxLength(255, { message: 'Código PIX deve ter no máximo 255 caracteres' })
  codigoPix?: string;
}
