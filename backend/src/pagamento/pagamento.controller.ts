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
import { PagamentoService } from './pagamento.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';
import { PagamentoStatus } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/jwt.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('pagamentos')
@UseGuards(JwtGuard)
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPagamentoDto: CreatePagamentoDto) {
    return this.pagamentoService.create(createPagamentoDto);
  }

  @Get()
  @Roles('FREELANCER', 'CLIENTE')
  findAll(
    @Query('projetoId') projetoId?: string,
    @Query('status') status?: PagamentoStatus,
  ) {
    if (projetoId) {
      return this.pagamentoService.findByProjeto(projetoId);
    }

    if (status) {
      return this.pagamentoService.findByStatus(status);
    }

    return this.pagamentoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagamentoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePagamentoDto: UpdatePagamentoDto,
  ) {
    return this.pagamentoService.update(id, updatePagamentoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.pagamentoService.remove(id);
  }
}
