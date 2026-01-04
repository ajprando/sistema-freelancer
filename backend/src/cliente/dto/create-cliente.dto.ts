import { IsString, IsEmail, IsOptional, MaxLength, IsUUID, IsNotEmpty } from 'class-validator';

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

  @IsUUID('4', { message: 'freelancerId deve ser um UUID válido' })
  @IsNotEmpty({ message: 'freelancerId é obrigatório' })
  freelancerId: string;
}
