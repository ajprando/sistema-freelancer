import { Module } from '@nestjs/common';
import { PagamentoService } from './pagamento.service';
import { PagamentoController } from './pagamento.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { MercadoPagoModule } from 'src/mercado-pago/mercado-pago.module';

@Module({
  imports: [MercadoPagoModule, PrismaModule],
  providers: [PagamentoService, PrismaService],
  controllers: [PagamentoController]
})
export class PagamentoModule {}
