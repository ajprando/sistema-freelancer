import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { FreelancerModule } from './freelancer/freelancer.module';
import { ClienteModule } from './cliente/cliente.module';
import { ProjetoModule } from './projeto/projeto.module';
import { AtividadeModule } from './atividade/atividade.module';
import { RegistroHorasModule } from './registro-horas/registro-horas.module';

@Module({
  imports: [PrismaModule, FreelancerModule, ClienteModule, ProjetoModule, AtividadeModule, RegistroHorasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
