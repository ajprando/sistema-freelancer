import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto, UserType } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { BCRYPT_ROUNDS } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { nome, email, senha, tipo, telefone } = registerDto;

    const usuarioExistente = await this.prisma.freelancer.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      throw new BadRequestException('Email já está registrado');
    }

    const senhaHash = await bcrypt.hash(senha, BCRYPT_ROUNDS);

    const novoUsuario = await this.prisma.freelancer.create({
      data: {
        nome,
        email,
        senha: senhaHash,
      },
    });

    if (tipo === UserType.CLIENTE) {
      await this.prisma.cliente.create({
        data: {
          nome,
          email,
          telefone: telefone || null,
          freelancerId: novoUsuario.id,
        },
      });
    }

    const access_token = this.jwtService.sign({
      sub: novoUsuario.id,
      email: novoUsuario.email,
      tipo,
    });

    return {
      access_token,
      user: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        tipo,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, senha } = loginDto;

    const usuario = await this.prisma.freelancer.findUnique({
      where: { email },
    });

    if (!usuario) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const cliente = await this.prisma.cliente.findFirst({
      where: { freelancerId: usuario.id },
    });

    const tipo = cliente ? UserType.CLIENTE : UserType.FREELANCER;

    const access_token = this.jwtService.sign({
      sub: usuario.id,
      email: usuario.email,
      tipo,
    });

    return {
      access_token,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo,
      },
    };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  async getUserById(userId: string) {
    const usuario = await this.prisma.freelancer.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
        criadoEm: true,
      },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return usuario;
  }
}
