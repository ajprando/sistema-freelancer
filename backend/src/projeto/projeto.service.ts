import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';

@Injectable()
export class ProjetoService {
  constructor(private prisma: PrismaService) {}

  async create(createProjetoDto: CreateProjetoDto) {
    const freelancer = await this.prisma.freelancer.findUnique({
      where: { id: createProjetoDto.freelancerId },
    });

    if (!freelancer) {
      throw new NotFoundException('Freelancer não encontrado');
    }

    const cliente = await this.prisma.cliente.findUnique({
      where: { id: createProjetoDto.clienteId },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return this.prisma.projeto.create({
      data: createProjetoDto,
      include: {
        freelancer: true,
        cliente: true,
        atividades: true,
      },
    });
  }

  async findAll() {
    return this.prisma.projeto.findMany({
      include: {
        freelancer: true,
        cliente: true,
        atividades: true,
        pagamento: true,
      },
    });
  }

  async findOne(id: string) {
    const projeto = await this.prisma.projeto.findUnique({
      where: { id },
      include: {
        freelancer: true,
        cliente: true,
        atividades: true,
        pagamento: true,
      },
    });

    if (!projeto) {
      throw new NotFoundException(`Projeto com ID ${id} não encontrado`);
    }

    return projeto;
  }

  async findByFreelancer(freelancerId: string) {
    const freelancer = await this.prisma.freelancer.findUnique({
      where: { id: freelancerId },
    });

    if (!freelancer) {
      throw new NotFoundException('Freelancer não encontrado');
    }

    return this.prisma.projeto.findMany({
      where: { freelancerId },
      include: {
        freelancer: true,
        cliente: true,
        atividades: true,
        pagamento: true,
      },
    });
  }

  async findByCliente(clienteId: string) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: clienteId },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return this.prisma.projeto.findMany({
      where: { clienteId },
      include: {
        freelancer: true,
        cliente: true,
        atividades: true,
        pagamento: true,
      },
    });
  }

  async update(id: string, updateProjetoDto: UpdateProjetoDto) {
    await this.findOne(id);

    if (updateProjetoDto.freelancerId) {
      const freelancer = await this.prisma.freelancer.findUnique({
        where: { id: updateProjetoDto.freelancerId },
      });

      if (!freelancer) {
        throw new NotFoundException('Freelancer não encontrado');
      }
    }

    if (updateProjetoDto.clienteId) {
      const cliente = await this.prisma.cliente.findUnique({
        where: { id: updateProjetoDto.clienteId },
      });

      if (!cliente) {
        throw new NotFoundException('Cliente não encontrado');
      }
    }

    return this.prisma.projeto.update({
      where: { id },
      data: updateProjetoDto,
      include: {
        freelancer: true,
        cliente: true,
        atividades: true,
        pagamento: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.projeto.delete({
      where: { id },
    });
  }
}
