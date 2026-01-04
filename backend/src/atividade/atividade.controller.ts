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
import { AtividadeService } from './atividade.service';
import { CreateAtividadeDto } from './dto/create-atividade.dto';
import { UpdateAtividadeDto } from './dto/update-atividade.dto';
import { JwtGuard } from '../auth/guards/jwt.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('atividades')
@UseGuards(JwtGuard)
export class AtividadeController {
  constructor(private readonly atividadeService: AtividadeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAtividadeDto: CreateAtividadeDto) {
    return this.atividadeService.create(createAtividadeDto);
  }

  @Get()
  @Roles('FREELANCER')
  findAll(@Query('projetoId') projetoId?: string) {
    if (projetoId) {
      return this.atividadeService.findByProjeto(projetoId);
    }

    return this.atividadeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.atividadeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAtividadeDto: UpdateAtividadeDto,
  ) {
    return this.atividadeService.update(id, updateAtividadeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.atividadeService.remove(id);
  }
}
