import { IsEnum, IsIn, IsNumber, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { PagamentoStatus } from '@prisma/client';

export class UpdatePagamentoDto {
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  valor?: number;

  @IsOptional()
  @IsUUID()
  projetoId?: string;

  @IsOptional()
  @IsEnum(PagamentoStatus)
  status?: PagamentoStatus;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Código PIX deve ter no máximo 255 caracteres' })
  codigoPix?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Referência deve ter no máximo 255 caracteres' })
  referencia?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30, { message: 'Método deve ter no máximo 30 caracteres' })
  metodo?: string;

  @IsOptional()
  @IsIn(['MERCADO_PAGO', 'ABACATEPAY'])
  gateway?: 'MERCADO_PAGO' | 'ABACATEPAY';

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'ID do Mercado Pago deve ter no máximo 255 caracteres' })
  mercadoPagoId?: string;

  @IsOptional()
  @IsString()
  qrCodeBase64?: string;
}
