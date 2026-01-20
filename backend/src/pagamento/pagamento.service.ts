import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';
import { PagamentoStatus } from '@prisma/client';
import { MercadoPagoConfig, Payment } from 'mercadopago';

@Injectable()
export class PagamentoService {
  constructor(private prisma: PrismaService) {}

  private paymentClient?: Payment;
  private abacatePayBaseUrl =
    process.env.ABACATE_PAY_BASE_URL || 'https://api.abacatepay.com';

  private getPaymentClient() {
    if (this.paymentClient) {
      return this.paymentClient;
    }

    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!accessToken) {
      throw new InternalServerErrorException(
        'MERCADO_PAGO_ACCESS_TOKEN não configurado',
      );
    }

    const config = new MercadoPagoConfig({ accessToken });
    this.paymentClient = new Payment(config);
    return this.paymentClient;
  }

  private mapMercadoPagoStatus(status?: string): PagamentoStatus {
    switch (status) {
      case 'approved':
        return PagamentoStatus.PAGO;
      case 'rejected':
      case 'cancelled':
      case 'refunded':
      case 'charged_back':
        return PagamentoStatus.FALHOU;
      case 'pending':
      case 'in_process':
      case 'in_mediation':
      default:
        return PagamentoStatus.PENDENTE;
    }
  }

  private mapAbacatePayStatus(status?: string): PagamentoStatus {
    switch (status) {
      case 'PAID':
        return PagamentoStatus.PAGO;
      case 'EXPIRED':
      case 'CANCELED':
      case 'FAILED':
        return PagamentoStatus.FALHOU;
      case 'PENDING':
      default:
        return PagamentoStatus.PENDENTE;
    }
  }

  private getAbacatePayToken() {
    const token = process.env.ABACATE_PAY_TOKEN;
    if (!token) {
      throw new InternalServerErrorException(
        'ABACATE_PAY_TOKEN não configurado',
      );
    }
    return token;
  }

  private async callAbacatePay<T>(
    path: string,
    body?: Record<string, unknown>,
    method: 'POST' | 'GET' = 'POST',
  ): Promise<T> {
    const token = this.getAbacatePayToken();
    const url = `${this.abacatePayBaseUrl}${path}`;
    const response = await fetch(url, {
      method,
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: method === 'POST' ? JSON.stringify(body ?? {}) : undefined,
    });

    const payload = (await response.json()) as {
      data?: T;
      error?: { message?: string } | null;
    };

    if (!response.ok || payload?.error) {
      console.error('AbacatePay error response', {
        status: response.status,
        statusText: response.statusText,
        payload,
      });
      throw new InternalServerErrorException(
        payload?.error?.message || 'Erro ao comunicar com AbacatePay',
      );
    }

    if (!payload?.data) {
      throw new InternalServerErrorException(
        'Resposta inválida da AbacatePay',
      );
    }

    return payload.data;
  }

  async create(createPagamentoDto: CreatePagamentoDto) {
    const projeto = await this.prisma.projeto.findUnique({
      where: { id: createPagamentoDto.projetoId },
      include: { cliente: true },
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

    const gateway = createPagamentoDto.gateway || 'MERCADO_PAGO';
    const referencia = `PAG-${Date.now()}`;
    if (gateway === 'ABACATEPAY') {
      if (!projeto.cliente.taxId || !projeto.cliente.telefone) {
        throw new BadRequestException(
          'Cliente precisa de taxId e telefone para AbacatePay',
        );
      }

      const amount = Math.round(Number(createPagamentoDto.valor) * 100);
      const description = `Pagamento do projeto ${projeto.nome}`.slice(0, 140);
      const pixData = await this.callAbacatePay<{
        id: string;
        status: string;
        brCode: string;
        brCodeBase64: string;
      }>('/v1/pixQrCode/create', {
        amount,
        description,
        customer: {
          name: projeto.cliente.nome,
          cellphone: projeto.cliente.telefone,
          email: projeto.cliente.email,
          taxId: projeto.cliente.taxId,
        },
        metadata: {
          projetoId: projeto.id,
          referencia,
        },
      });

      return this.prisma.pagamento.create({
        data: {
          referencia,
          metodo: 'PIX',
          gateway,
          valor: createPagamentoDto.valor,
          projetoId: createPagamentoDto.projetoId,
          status: this.mapAbacatePayStatus(pixData.status),
          codigoPix: pixData.brCode,
          qrCodeBase64: pixData.brCodeBase64,
          abacatePayId: pixData.id,
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

    const paymentClient = this.getPaymentClient();

    const payment = await paymentClient.create({
      body: {
        transaction_amount: Number(createPagamentoDto.valor),
        description: `Pagamento do projeto ${projeto.nome}`,
        payment_method_id: 'pix',
        payer: {
          email: projeto.cliente.email,
        },
        external_reference: referencia,
      },
    });

    const transactionData = payment?.point_of_interaction?.transaction_data;
    const codigoPix = transactionData?.qr_code ?? null;
    const qrCodeBase64 = transactionData?.qr_code_base64 ?? null;
    const mercadoPagoId = payment?.id ? String(payment.id) : null;
    const status = this.mapMercadoPagoStatus(payment?.status);

    return this.prisma.pagamento.create({
      data: {
        referencia,
        metodo: 'PIX',
        gateway,
        valor: createPagamentoDto.valor,
        projetoId: createPagamentoDto.projetoId,
        status,
        codigoPix,
        qrCodeBase64,
        mercadoPagoId,
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

  async handleWebhook(payload: {
    data?: { id?: string | number };
    id?: string | number;
  }) {
    const paymentId = payload?.data?.id ?? payload?.id;
    if (!paymentId) {
      return { received: true, ignored: true };
    }

    const paymentClient = this.getPaymentClient();
    const payment = await paymentClient.get({ id: String(paymentId) });
    const mercadoPagoId = payment?.id ? String(payment.id) : null;

    if (!mercadoPagoId) {
      return { received: true, ignored: true };
    }

    const existing = await this.prisma.pagamento.findFirst({
      where: { mercadoPagoId },
    });

    if (!existing) {
      return { received: true, ignored: true };
    }

    const transactionData = payment?.point_of_interaction?.transaction_data;
    const codigoPix = transactionData?.qr_code ?? null;
    const qrCodeBase64 = transactionData?.qr_code_base64 ?? null;
    const status = this.mapMercadoPagoStatus(payment?.status);

    await this.prisma.pagamento.update({
      where: { id: existing.id },
      data: {
        status,
        codigoPix,
        qrCodeBase64,
      },
    });

    return { received: true };
  }

  async handleAbacatePayWebhook(payload: {
    data?: { id?: string };
    id?: string;
  }) {
    const abacatePayId = payload?.data?.id ?? payload?.id;
    if (!abacatePayId) {
      return { received: true, ignored: true };
    }

    const pixData = await this.callAbacatePay<{
      status: string;
      expiresAt?: string;
    }>(`/v1/pixQrCode/check?id=${encodeURIComponent(abacatePayId)}`, undefined, 'GET');

    const existing = await this.prisma.pagamento.findFirst({
      where: { abacatePayId },
    });

    if (!existing) {
      return { received: true, ignored: true };
    }

    await this.prisma.pagamento.update({
      where: { id: existing.id },
      data: {
        status: this.mapAbacatePayStatus(pixData.status),
      },
    });

    return { received: true };
  }
}
