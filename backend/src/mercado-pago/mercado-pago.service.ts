import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MercadoPagoConfig, Payment } from 'mercadopago';

@Injectable()
export class MercadoPagoService {
  private client: MercadoPagoConfig;
  private payment: Payment;

  constructor() {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN as string,
    });
    this.payment = new Payment(this.client);
  }

  async createPixPayment(data: {
    transaction_amount: number;
    description: string;
    email: string;
    firstName: string;
    lastName: string;
    identificationType: string;
    identificationNumber: string;
  }) {
    try {
      const paymentData = {
        body: {
          transaction_amount: data.transaction_amount,
          description: data.description,
          payment_method_id: 'pix',
          payer: {
            email: data.email,
            first_name: data.firstName,
            last_name: data.lastName,
            identification: {
              type: data.identificationType,
              number: data.identificationNumber,
            },
          },
        },
      };

      const result = await this.payment.create(paymentData);
      return result;
    } catch (error) {
      console.error('Erro ao criar pagamento PIX:', error);
      throw new InternalServerErrorException('Erro ao processar pagamento com Mercado Pago');
    }
  }

  async getPaymentStatus(paymentId: string) {
    try {
      const result = await this.payment.get({ id: paymentId });
      return result;
    } catch (error) {
      console.error('Erro ao buscar status do pagamento:', error);
      throw new InternalServerErrorException('Erro ao buscar status do pagamento no Mercado Pago');
    }
  }
}
