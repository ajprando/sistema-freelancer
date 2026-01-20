import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';

@Injectable()
export class ProjetoService {
  constructor(private prisma: PrismaService) {}

  async create(createProjetoDto: CreateProjetoDto) {
    const { taxId, telefone, ...projetoData } = createProjetoDto;

    const freelancer = await this.prisma.freelancer.findUnique({
      where: { id: projetoData.freelancerId },
    });

    if (!freelancer) {
      throw new NotFoundException('Freelancer não encontrado');
    }

    const cliente = await this.prisma.cliente.findUnique({
      where: { id: projetoData.clienteId },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    if (taxId || telefone) {
      await this.prisma.cliente.update({
        where: { id: projetoData.clienteId },
        data: {
          taxId: taxId || cliente.taxId,
          telefone: telefone || cliente.telefone,
        },
      });
    }

    return this.prisma.projeto.create({
      data: projetoData,
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
    const { taxId, telefone, clienteId, freelancerId, ...projetoData } = updateProjetoDto;

    const projetoExistente = await this.findOne(id);

    if (taxId !== undefined || telefone !== undefined) {
      const clienteIdToUpdate = clienteId || projetoExistente.clienteId;
      const cliente = await this.prisma.cliente.findUnique({
        where: { id: clienteIdToUpdate },
      });

      if (!cliente) {
        throw new NotFoundException('Cliente não encontrado');
      }

      await this.prisma.cliente.update({
        where: { id: clienteIdToUpdate },
        data: {
          taxId: taxId !== undefined ? taxId : cliente.taxId,
          telefone: telefone !== undefined ? telefone : cliente.telefone,
        },
      });
    }

    const dataToUpdate: any = projetoData;

    if (clienteId) {
      dataToUpdate.cliente = { connect: { id: clienteId } };
      delete dataToUpdate.clienteId;
    }

    if (freelancerId) {
      dataToUpdate.freelancer = { connect: { id: freelancerId } };
      delete dataToUpdate.freelancerId;
    }

    return this.prisma.projeto.update({
      where: { id },
      data: dataToUpdate,
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
