import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';

export enum UserType {
  FREELANCER = 'FREELANCER',
  CLIENTE = 'CLIENTE',
}

export class RegisterDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  nome: string;

  @IsEmail({}, { message: 'Email deve ser um endereço de email válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  senha: string;

  @IsEnum(UserType, {
    message: 'Tipo de usuário deve ser FREELANCER ou CLIENTE',
  })
  @IsNotEmpty({ message: 'Tipo de usuário é obrigatório' })
  tipo: UserType;

  @IsString({ message: 'Telefone deve ser uma string' })
  @IsOptional()
  telefone?: string;
}
