import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  IFreightPhotosRepository,
  CreateFreightPhotoData,
} from './freight-photos.repository.interface.js';
import { FreightPhoto } from '../entities/freight-photo.entity.js';
import { FreightPhotoMapper } from '../mappers/freight-photo.mapper.js';

@Injectable()
export class FreightPhotosRepository implements IFreightPhotosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateFreightPhotoData): Promise<FreightPhoto> {
    const prismaPhoto = await this.prisma.freightPhoto.create({
      data: {
        freightId: data.freightId,
        url: data.url,
        order: data.order,
      },
    });

    return FreightPhotoMapper.toDomain(prismaPhoto);
  }

  async findById(id: string): Promise<FreightPhoto | null> {
    const prismaPhoto = await this.prisma.freightPhoto.findUnique({
      where: { id },
    });

    if (!prismaPhoto) return null;
    return FreightPhotoMapper.toDomain(prismaPhoto);
  }

  async findByFreight(freightId: string): Promise<FreightPhoto[]> {
    const prismaPhotos = await this.prisma.freightPhoto.findMany({
      where: { freightId },
      orderBy: { order: 'asc' },
    });

    return FreightPhotoMapper.toDomainList(prismaPhotos);
  }

  async countByFreight(freightId: string): Promise<number> {
    return this.prisma.freightPhoto.count({
      where: { freightId },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.freightPhoto.delete({
      where: { id },
    });
  }
}
