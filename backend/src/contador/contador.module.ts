import { Module } from '@nestjs/common';
import { ContadorService } from './contador.service';
import { ContadorController } from './contador.controller';
import { ContadorGateway } from './contador.gateway';

@Module({
  providers: [ContadorService, ContadorGateway],
  controllers: [ContadorController],
  exports: [ContadorService],
})
export class ContadorModule {}
