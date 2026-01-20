import { ConflictException, NotFoundException } from '@nestjs/common';
import { PagamentoStatus } from '@prisma/client';
import { PagamentoService } from './pagamento.service';

const createMock = jest.fn();
const getMock = jest.fn();
const fetchMock = jest.fn();

global.fetch = fetchMock as unknown as typeof fetch;

jest.mock('mercadopago', () => ({
  MercadoPagoConfig: jest.fn().mockImplementation(() => ({})),
  Payment: jest.fn().mockImplementation(() => ({
    create: createMock,
    get: getMock,
  })),
}));

describe('PagamentoService', () => {
  const prisma = {
    projeto: {
      findUnique: jest.fn(),
    },
    pagamento: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  let service: PagamentoService;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.MERCADO_PAGO_ACCESS_TOKEN = 'test-token';
    process.env.ABACATE_PAY_TOKEN = 'abacate-token';
    service = new PagamentoService(prisma as any);
  });

  it('throws when projeto does not exist', async () => {
    prisma.projeto.findUnique.mockResolvedValue(null);

    await expect(
      service.create({ valor: 120, projetoId: 'proj-1' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(createMock).not.toHaveBeenCalled();
  });

  it('throws when pagamento already exists', async () => {
    prisma.projeto.findUnique.mockResolvedValue({
      id: 'proj-1',
      nome: 'Projeto',
      cliente: { email: 'cliente@exemplo.com' },
    });
    prisma.pagamento.findUnique.mockResolvedValue({ id: 'pay-1' });

    await expect(
      service.create({ valor: 120, projetoId: 'proj-1' }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(createMock).not.toHaveBeenCalled();
  });

  it('creates pagamento using Mercado Pago', async () => {
    prisma.projeto.findUnique.mockResolvedValue({
      id: 'proj-1',
      nome: 'Projeto',
      cliente: { email: 'cliente@exemplo.com' },
    });
    prisma.pagamento.findUnique.mockResolvedValue(null);
    createMock.mockResolvedValue({
      id: 123,
      status: 'pending',
      point_of_interaction: {
        transaction_data: {
          qr_code: 'pix-code',
          qr_code_base64: 'pix-base64',
        },
      },
    });
    prisma.pagamento.create.mockResolvedValue({ id: 'local-1' });

    await service.create({ valor: 120, projetoId: 'proj-1' });

    expect(createMock).toHaveBeenCalledWith({
      body: expect.objectContaining({
        transaction_amount: 120,
        payment_method_id: 'pix',
        payer: { email: 'cliente@exemplo.com' },
      }),
    });
    expect(prisma.pagamento.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          metodo: 'PIX',
          codigoPix: 'pix-code',
          qrCodeBase64: 'pix-base64',
          mercadoPagoId: '123',
          status: PagamentoStatus.PENDENTE,
        }),
      }),
    );
  });

  it('updates pagamento status on webhook', async () => {
    prisma.pagamento.findFirst.mockResolvedValue({ id: 'local-1' });
    getMock.mockResolvedValue({
      id: 321,
      status: 'approved',
      point_of_interaction: {
        transaction_data: {
          qr_code: 'pix-code',
          qr_code_base64: 'pix-base64',
        },
      },
    });

    await service.handleWebhook({ data: { id: 321 } });

    expect(prisma.pagamento.update).toHaveBeenCalledWith({
      where: { id: 'local-1' },
      data: expect.objectContaining({
        status: PagamentoStatus.PAGO,
        codigoPix: 'pix-code',
        qrCodeBase64: 'pix-base64',
      }),
    });
  });

  it('creates pagamento using AbacatePay', async () => {
    prisma.projeto.findUnique.mockResolvedValue({
      id: 'proj-1',
      nome: 'Projeto',
      cliente: {
        nome: 'Cliente',
        email: 'cliente@exemplo.com',
        telefone: '(11) 99999-0000',
        taxId: '123.456.789-01',
      },
    });
    prisma.pagamento.findUnique.mockResolvedValue(null);
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          id: 'pix_123',
          status: 'PENDING',
          brCode: 'pix-code',
          brCodeBase64: 'pix-base64',
        },
        error: null,
      }),
    });
    prisma.pagamento.create.mockResolvedValue({ id: 'local-2' });

    await service.create({
      valor: 120,
      projetoId: 'proj-1',
      gateway: 'ABACATEPAY',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/v1/pixQrCode/create'),
      expect.objectContaining({
        method: 'POST',
      }),
    );
    expect(prisma.pagamento.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          gateway: 'ABACATEPAY',
          abacatePayId: 'pix_123',
          codigoPix: 'pix-code',
          qrCodeBase64: 'pix-base64',
        }),
      }),
    );
  });
});
