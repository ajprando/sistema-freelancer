import { Module } from '@nestjs/common';
import { RegistroHorasService } from './registro-horas.service';
import { RegistroHorasController } from './registro-horas.controller';

@Module({
  providers: [RegistroHorasService],
  controllers: [RegistroHorasController]
})
export class RegistroHorasModule {}
