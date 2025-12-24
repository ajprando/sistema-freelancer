import { IsString, IsOptional, IsUUID, MaxLength, IsDecimal } from 'class-validator';

export class CreateProjetoDto {
  @IsString()
  @MaxLength(255, { message: 'Nome deve ter no máximo 255 caracteres' })
  nome: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsUUID()
  freelancerId: string;

  @IsUUID()
  clienteId: string;

  @IsDecimal({ decimal_digits: '1,2' })
  @IsOptional()
  valorTotal?: number;
}
