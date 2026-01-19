import { IsString, IsOptional, IsUUID, MaxLength, IsDecimal, IsNumber, Min } from 'class-validator';

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

  @IsString()
  @IsOptional()
  @MaxLength(20, { message: 'Telefone deve ter no máximo 20 caracteres' })
  telefone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20, { message: 'Tax ID deve ter no máximo 20 caracteres' })
  taxId?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  valorTotal?: number;
}
