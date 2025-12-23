import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class CreateFreelancerDto {
  @IsString()
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  @MaxLength(255, { message: 'Nome deve ter no máximo 255 caracteres' })
  nome: string;

  @IsEmail({}, { message: 'Email deve ser válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  @MaxLength(255, { message: 'Senha deve ter no máximo 255 caracteres' })
  senha: string;
}
