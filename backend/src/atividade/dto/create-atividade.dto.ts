import { IsString, IsUUID, IsDecimal, IsOptional, MaxLength, IsEnum } from 'class-validator';
import { AtividadeStatus } from '@prisma/client';

export class CreateAtividadeDto {
  @IsString()
  @MaxLength(255, { message: 'Descrição deve ter no máximo 255 caracteres' })
  descricao: string;

  @IsDecimal({ decimal_digits: '1,2' })
  valorHora: number;

  @IsUUID()
  projetoId: string;

  @IsEnum(AtividadeStatus)
  @IsOptional()
  status?: AtividadeStatus;
}
