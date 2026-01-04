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
  UseGuards,
} from '@nestjs/common';
import { ProjetoService } from './projeto.service';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guards';

@Controller('projetos')
@UseGuards(JwtGuard)
export class ProjetoController {
  constructor(private readonly projetoService: ProjetoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProjetoDto: CreateProjetoDto) {
    return this.projetoService.create(createProjetoDto);
  }

  @Get()
  findAll(
    @Query('freelancerId') freelancerId?: string,
    @Query('clienteId') clienteId?: string,
  ) {
    if (freelancerId) {
      return this.projetoService.findByFreelancer(freelancerId);
    }

    if (clienteId) {
      return this.projetoService.findByCliente(clienteId);
    }

    return this.projetoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projetoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjetoDto: UpdateProjetoDto,
  ) {
    return this.projetoService.update(id, updateProjetoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.projetoService.remove(id);
  }
}
