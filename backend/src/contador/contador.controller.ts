import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ContadorService } from './contador.service';
import { IncrementContadorDto } from './dto/increment-contador.dto';
import { ContadorResponseDto } from './dto/contador-response.dto';

@Controller('contador')
export class ContadorController {
    constructor(private readonly contadorService: ContadorService) {}

    @Post('increment')
    @HttpCode(HttpStatus.OK)
    increment(@Body() incrementContadorDto: IncrementContadorDto): ContadorResponseDto {
        const amount = incrementContadorDto.amount || 1;
        const value = this.contadorService.increment(amount);

        return {
            value,
            timestamp: new Date(),
        };
    }

    @Get()
    getValue(): ContadorResponseDto {
        const value = this.contadorService.getValue();

        return {
            value,
            timestamp: new Date(),
        };
    }

    @Post('reset')
    @HttpCode(HttpStatus.OK)
    reset(): ContadorResponseDto {
        const value = this.contadorService.reset();

        return {
            value, 
            timestamp: new Date(),
        };
    }
}
