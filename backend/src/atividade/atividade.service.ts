import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAtividadeDto } from './dto/create-atividade.dto';
import { UpdateAtividadeDto } from './dto/update-atividade.dto';

@Injectable()
export class AtividadeService {
  constructor(private prisma: PrismaService) {}

  async create(createAtividadeDto: CreateAtividadeDto) {
    const projeto = await this.prisma.projeto.findUnique({
      where: { id: createAtividadeDto.projetoId },
    });

    if (!projeto) {
      throw new NotFoundException('Projeto não encontrado');
    }

    return this.prisma.atividade.create({
      data: createAtividadeDto,
      include: {
        projeto: true,
        registroHoras: true,
      },
    });
  }

  async findAll() {
    return this.prisma.atividade.findMany({
      include: {
        projeto: true,
        registroHoras: true,
      },
    });
  }

  async findOne(id: string) {
    const atividade = await this.prisma.atividade.findUnique({
      where: { id },
      include: {
        projeto: true,
        registroHoras: true,
      },
    });

    if (!atividade) {
      throw new NotFoundException(`Atividade com ID ${id} não encontrado`);
    }

    return atividade;
  }

  async findByProjeto(projetoId: string) {
    const projeto = await this.prisma.projeto.findUnique({
      where: { id: projetoId },
    });

    if (!projeto) {
      throw new NotFoundException('Projeto não encontrado');
    }

    return this.prisma.atividade.findMany({
      where: { projetoId },
      include: {
        projeto: true,
        registroHoras: true,
      },
    });
  }

  async update(id: string, updateAtividadeDto: UpdateAtividadeDto) {
    await this.findOne(id);

    if (updateAtividadeDto.projetoId) {
      const projeto = await this.prisma.projeto.findUnique({
        where: { id: updateAtividadeDto.projetoId },
      });

      if (!projeto) {
        throw new NotFoundException('Projeto não encontrado');
      }
    }

    return this.prisma.atividade.update({
      where: { id },
      data: updateAtividadeDto,
      include: {
        projeto: true,
        registroHoras: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.atividade.delete({
      where: { id },
    });
  }
}
