import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { RegistroHorasService } from './registro-horas.service';
import { CreateRegistroHorasDto } from './dto/create-registro-horas.dto';
import { UpdateRegistroHorasDto } from './dto/update-registro-horas.dto';

@Controller('registro-horas')
export class RegistroHorasController {
  constructor(private readonly registroHorasService: RegistroHorasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRegistroHorasDto: CreateRegistroHorasDto) {
    return this.registroHorasService.create(createRegistroHorasDto);
  }

  @Get()
  findAll(@Query('atividadeId') atividadeId?: string) {
    if (atividadeId) {
      return this.registroHorasService.findByAtividade(atividadeId);
    }

    return this.registroHorasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registroHorasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRegistroHorasDto: UpdateRegistroHorasDto,
  ) {
    return this.registroHorasService.update(id, updateRegistroHorasDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.registroHorasService.remove(id);
  }
}
