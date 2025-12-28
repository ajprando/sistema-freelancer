import { Module } from '@nestjs/common';
import { ContadorService } from './contador.service';
import { ContadorController } from './contador.controller';

@Module({
  providers: [ContadorService],
  controllers: [ContadorController],
  exports: [ContadorService],
})
export class ContadorModule {}
