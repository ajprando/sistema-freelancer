import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { FreelancerModule } from './freelancer/freelancer.module';

@Module({
  imports: [PrismaModule, FreelancerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
