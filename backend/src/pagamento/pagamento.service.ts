import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';
import { PagamentoStatus } from '@prisma/client';

@Injectable()
export class PagamentoService {
  constructor(private prisma: PrismaService) {}

  async create(createPagamentoDto: CreatePagamentoDto) {
    const projeto = await this.prisma.projeto.findUnique({
      where: { id: createPagamentoDto.projetoId },
    });

    if (!projeto) {
      throw new NotFoundException('Projeto não encontrado');
    }

    const pagamentoExistente = await this.prisma.pagamento.findUnique({
      where: { projetoId: createPagamentoDto.projetoId },
    });

    if (pagamentoExistente) {
      throw new ConflictException('Já existe um pagamento para este projeto');
    }

    return this.prisma.pagamento.create({
      data: {
        referencia: `PAG-${Date.now()}`, 
        metodo: 'PIX',
        valor: createPagamentoDto.valor,
        projetoId: createPagamentoDto.projetoId,
        status: createPagamentoDto.status || PagamentoStatus.PENDENTE,
        codigoPix: createPagamentoDto.codigoPix,
      },
      include: {
        projeto: {
          include: {
            freelancer: true,
            cliente: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.pagamento.findMany({
      include: {
        projeto: {
          include: {
            freelancer: true,
            cliente: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const pagamento = await this.prisma.pagamento.findUnique({
      where: { id },
      include: {
        projeto: {
          include: {
            freelancer: true,
            cliente: true,
          },
        },
      },
    });

    if (!pagamento) {
      throw new NotFoundException(`Pagamento com ID ${id} não encontrado`);
    }

    return pagamento;
  }

  async findByProjeto(projetoId: string) {
    const projeto = await this.prisma.projeto.findUnique({
      where: { id: projetoId },
    });

    if (!projeto) {
      throw new NotFoundException('Projeto não encontrado');
    }

    return this.prisma.pagamento.findUnique({
      where: { projetoId },
      include: {
        projeto: {
          include: {
            freelancer: true,
            cliente: true,
          },
        },
      },
    });
  }

  async findByStatus(status: PagamentoStatus) {
    return this.prisma.pagamento.findMany({
      where: { status },
      include: {
        projeto: {
          include: {
            freelancer: true,
            cliente: true,
          },
        },
      },
    });
  }

  async update(id: string, updatePagamentoDto: UpdatePagamentoDto) {
    await this.findOne(id);

    if (updatePagamentoDto.projetoId) {
      const projeto = await this.prisma.projeto.findUnique({
        where: { id: updatePagamentoDto.projetoId },
      });

      if (!projeto) {
        throw new NotFoundException('Projeto não encontrado');
      }

      const pagamentoExistente = await this.prisma.pagamento.findUnique({
        where: { projetoId: updatePagamentoDto.projetoId },
      });

      if (pagamentoExistente) {
        throw new ConflictException('Já existe um pagamento para este projeto');
      }
    }

    return this.prisma.pagamento.update({
      where: { id },
      data: updatePagamentoDto,
      include: {
        projeto: {
          include: {
            freelancer: true,
            cliente: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.pagamento.delete({
      where: { id },
    });
  }
}
