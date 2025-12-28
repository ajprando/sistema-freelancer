import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegistroHorasDto } from './dto/create-registro-horas.dto';
import { UpdateRegistroHorasDto } from './dto/update-registro-horas.dto';

@Injectable()
export class RegistroHorasService {
  constructor(private prisma: PrismaService) {}

  async create(createRegistroHorasDto: CreateRegistroHorasDto) {
    const atividade = await this.prisma.atividade.findUnique({
      where: { id: createRegistroHorasDto.atividadeId },
    });

    if (!atividade) {
      throw new NotFoundException('Atividade não encontrada');
    }

    let duracaoMinutos = createRegistroHorasDto.duracaoMinutos;

    if (createRegistroHorasDto.fim && !duracaoMinutos) {
      const inicio = new Date(createRegistroHorasDto.inicio);
      const fim = new Date(createRegistroHorasDto.fim);
      duracaoMinutos = Math.round((fim.getTime() - inicio.getTime()) / (1000 * 60));
    }

    return this.prisma.registroHoras.create({
      data: {
        inicio: new Date(createRegistroHorasDto.inicio),
        fim: createRegistroHorasDto.fim ? new Date(createRegistroHorasDto.fim) : null,
        duracaoMinutos,
        atividadeId: createRegistroHorasDto.atividadeId,
      },
      include: {
        atividade: true,
      },
    });
  }

  async findAll() {
    return this.prisma.registroHoras.findMany({
      include: {
        atividade: true,
      },
    });
  }

  async findOne(id: string) {
    const registroHoras = await this.prisma.registroHoras.findUnique({
      where: { id },
      include: {
        atividade: true,
      },
    });

    if (!registroHoras) {
      throw new NotFoundException(`Registro de horas com ID ${id} não encontrado`);
    }

    return registroHoras;
  }

  async findByAtividade(atividadeId: string) {
    const atividade = await this.prisma.atividade.findUnique({
      where: { id: atividadeId },
    });

    if (!atividade) {
      throw new NotFoundException('Atividade não encontrada');
    }

    return this.prisma.registroHoras.findMany({
      where: { atividadeId },
      include: {
        atividade: true,
      },
    });
  }

  async update(id: string, updateRegistroHorasDto: UpdateRegistroHorasDto) {
    await this.findOne(id);

    if (updateRegistroHorasDto.atividadeId) {
      const atividade = await this.prisma.atividade.findUnique({
        where: { id: updateRegistroHorasDto.atividadeId },
      });

      if (!atividade) {
        throw new NotFoundException('Atividade não encontrada');
      }
    }

    let duracaoMinutos = updateRegistroHorasDto.duracaoMinutos;

    if (updateRegistroHorasDto.fim && !duracaoMinutos) {
      const inicio = updateRegistroHorasDto.inicio 
        ? new Date(updateRegistroHorasDto.inicio)
        : (await this.findOne(id)).inicio;
      const fim = new Date(updateRegistroHorasDto.fim);
      duracaoMinutos = Math.round((fim.getTime() - inicio.getTime()) / (1000 * 60));
    }

    const data: any = { ...updateRegistroHorasDto };
    
    if (updateRegistroHorasDto.inicio) {
      data.inicio = new Date(updateRegistroHorasDto.inicio);
    }
    
    if (updateRegistroHorasDto.fim) {
      data.fim = new Date(updateRegistroHorasDto.fim);
    }

    if (duracaoMinutos !== undefined) {
      data.duracaoMinutos = duracaoMinutos;
    }

    return this.prisma.registroHoras.update({
      where: { id },
      data,
      include: {
        atividade: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.registroHoras.delete({
      where: { id },
    });
  }
}
