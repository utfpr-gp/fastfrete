import { FreightPhoto as PrismaFreightPhoto } from '../../../generated/prisma/client.js';
import { FreightPhoto } from '../entities/freight-photo.entity.js';
import { FreightPhotoResponseDto } from '../dto/freight-photo-response.dto.js';

export class FreightPhotoMapper {
  static toDomain(prismaPhoto: PrismaFreightPhoto): FreightPhoto {
    return new FreightPhoto({
      id: prismaPhoto.id,
      freightId: prismaPhoto.freightId,
      url: prismaPhoto.url,
      order: prismaPhoto.order,
      createdAt: prismaPhoto.createdAt,
    });
  }

  static toDomainList(prismaPhotos: PrismaFreightPhoto[]): FreightPhoto[] {
    return prismaPhotos.map((p) => this.toDomain(p));
  }

  static toResponse(photo: FreightPhoto): FreightPhotoResponseDto {
    return {
      id: photo.id,
      freightId: photo.freightId,
      url: photo.url,
      order: photo.order,
      createdAt: photo.createdAt,
    };
  }

  static toResponseList(photos: FreightPhoto[]): FreightPhotoResponseDto[] {
    return photos.map((p) => this.toResponse(p));
  }
}
