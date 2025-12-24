import { IsString, IsUUID, IsDecimal, IsOptional, MaxLength } from 'class-validator';

export class CreateAtividadeDto {
  @IsString()
  @MaxLength(255, { message: 'Descrição deve ter no máximo 255 caracteres' })
  descricao: string;

  @IsDecimal({ decimal_digits: '1,2' })
  valorHora: number;

  @IsUUID()
  projetoId: string;

  @IsString()
  @IsOptional()
  status?: string;
}
