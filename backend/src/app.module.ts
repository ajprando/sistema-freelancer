import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { FreelancerModule } from './freelancer/freelancer.module';
import { ClienteModule } from './cliente/cliente.module';

@Module({
  imports: [PrismaModule, FreelancerModule, ClienteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
