import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ContadorService } from './contador.service';

@Controller('contador')
export class ContadorController {
  constructor(private readonly contadorService: ContadorService) {}

  @Get('status')
  @HttpCode(HttpStatus.OK)
  getStatus() {
    const startTime = this.contadorService.getStartTime();

    return {
      isRunning: !!startTime,
      startTime: startTime ? startTime.toISOString() : null,
    };
  }
}