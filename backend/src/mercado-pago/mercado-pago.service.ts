import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MercadoPagoService {
  private readonly baseUrl = 'https://api.mercadopago.com';

  async criarLinkPagamento(dados: {
    referencia: string;
    valor: number;
  }) {
    const response = await axios.post(
      `${this.baseUrl}/checkout/preferences`,
      {
        items: [
          {
            title: `Pagamento ${dados.referencia}`,
            quantity: 1,
            unit_price: dados.valor,
            currency_id: 'BRL',
          },
        ],
        external_reference: dados.referencia,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      },
    );

    return {
      mercadoPagoId: response.data.id,
      initPoint: response.data.init_point,
    };
  }
}
