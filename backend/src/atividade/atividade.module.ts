import { Module } from '@nestjs/common';
import { AtividadeService } from './atividade.service';
import { AtividadeController } from './atividade.controller';

@Module({
  providers: [AtividadeService],
  controllers: [AtividadeController]
})
export class AtividadeModule {}
