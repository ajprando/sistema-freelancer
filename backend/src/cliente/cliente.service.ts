import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(private prisma: PrismaService) {}

  async create(createClienteDto: CreateClienteDto) {
    const existingCliente = await this.prisma.cliente.findUnique({
      where: { email: createClienteDto.email },
    });

    if (existingCliente) {
      throw new ConflictException('Email já está em uso');
    }

    return this.prisma.cliente.create({
      data: createClienteDto,
    });
  }

  async findAll() {
    return this.prisma.cliente.findMany({
      include: {
        projetos: true,
      },
    });
  }

  async findOne(id: string) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
      include: {
        projetos: true,
      },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    return cliente;
  }

  async update(id: string, updateClienteDto: UpdateClienteDto) {
    const cliente = await this.findOne(id);

    if (updateClienteDto.email && updateClienteDto.email !== cliente.email) {
      const existingCliente = await this.prisma.cliente.findUnique({
        where: { email: updateClienteDto.email },
      });

      if (existingCliente) {
        throw new ConflictException('Email já está em uso');
      }
    }

    return this.prisma.cliente.update({
      where: { id },
      data: updateClienteDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.cliente.delete({
      where: { id },
    });
  }
}
