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

  async createWithLimitCheck(
    freightId: string,
    url: string,
    maxPhotos: number,
  ): Promise<FreightPhoto> {
    return this.prisma.$transaction(async (tx) => {
      // Bloqueia a linha do frete: envios simultâneos esperam a vez e
      // contam as fotos já gravadas, sem ultrapassar o limite.
      await tx.$queryRaw`SELECT id FROM freights WHERE id = ${freightId} FOR UPDATE`;
      const count = await tx.freightPhoto.count({
        where: { freightId },
      });

      if (count >= maxPhotos) {
        throw new Error(`Limite de ${maxPhotos} fotos por frete atingido`);
      }

      const prismaPhoto = await tx.freightPhoto.create({
        data: {
          freightId,
          url,
          order: count + 1,
        },
      });

      return FreightPhotoMapper.toDomain(prismaPhoto);
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.freightPhoto.delete({
      where: { id },
    });
  }
}
