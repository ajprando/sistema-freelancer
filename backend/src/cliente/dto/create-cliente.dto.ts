import { IsString, IsEmail, IsOptional, MaxLength, IsUUID, IsNotEmpty, MinLength } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @MaxLength(255, { message: 'Nome deve ter no máximo 255 caracteres' })
  nome: string;

  @IsEmail({}, { message: 'Email deve ser válido' })
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(20, { message: 'Telefone deve ter no máximo 20 caracteres' })
  telefone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20, { message: 'Tax ID deve ter no máximo 20 caracteres' })
  taxId?: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  @MaxLength(255, { message: 'Senha deve ter no máximo 255 caracteres' })
  senha?: string; 

  @IsUUID('4', { message: 'freelancerId deve ser um UUID válido' })
  @IsNotEmpty({ message: 'freelancerId é obrigatório' })
  freelancerId: string;
}
