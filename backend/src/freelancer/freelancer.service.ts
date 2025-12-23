import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFreelancerDto } from './dto/create-freelancer.dto';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';

@Injectable()
export class FreelancerService {
  constructor(private prisma: PrismaService) {}

  async create(createFreelancerDto: CreateFreelancerDto) {
    const existingFreelancer = await this.prisma.freelancer.findUnique({
      where: { email: createFreelancerDto.email },
    });

    if (existingFreelancer) {
      throw new ConflictException('Email já está em uso');
    }

    return this.prisma.freelancer.create({
      data: createFreelancerDto,
    });
  }

  async findAll() {
    return this.prisma.freelancer.findMany({
      include: {
        projetos: true,
      },
    });
  }

  async findOne(id: string) {
    const freelancer = await this.prisma.freelancer.findUnique({
      where: { id },
      include: {
        projetos: true,
      },
    });

    if (!freelancer) {
      throw new NotFoundException(`Freelancer com ID ${id} não encontrado`);
    }

    return freelancer;
  }

  async update(id: string, updateFreelancerDto: UpdateFreelancerDto) {
    const freelancer = await this.findOne(id);

    if (updateFreelancerDto.email && updateFreelancerDto.email !== freelancer.email) {
      const existingFreelancer = await this.prisma.freelancer.findUnique({
        where: { email: updateFreelancerDto.email },
      });

      if (existingFreelancer) {
        throw new ConflictException('Email já está em uso');
      }
    }

    return this.prisma.freelancer.update({
      where: { id },
      data: updateFreelancerDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.freelancer.delete({
      where: { id },
    });
  }
}
