import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import type { IFreightPhotosRepository } from './repositories/freight-photos.repository.interface.js';
import { FREIGHT_PHOTOS_REPOSITORY } from './repositories/freight-photos.repository.interface.js';
import type { IFreightsRepository } from '../freights/repositories/freights.repository.interface.js';
import { FREIGHTS_REPOSITORY } from '../freights/repositories/freights.repository.interface.js';
import { FreightPhotoMapper } from './mappers/freight-photo.mapper.js';
import { FreightPhotoResponseDto } from './dto/freight-photo-response.dto.js';
import * as fs from 'fs';
import * as path from 'path';

const MAX_PHOTOS_PER_FREIGHT = 3;
const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'freight-photos');

@Injectable()
export class FreightPhotosService {
  constructor(
    @Inject(FREIGHT_PHOTOS_REPOSITORY)
    private readonly photosRepository: IFreightPhotosRepository,
    @Inject(FREIGHTS_REPOSITORY)
    private readonly freightsRepository: IFreightsRepository,
  ) {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
  }

  async upload(
    freightId: string,
    clientId: string,
    file: Express.Multer.File,
  ): Promise<FreightPhotoResponseDto> {
    const freight = await this.freightsRepository.findById(freightId);

    if (!freight) {
      throw new NotFoundException(`Frete com ID ${freightId} não encontrado`);
    }

    if (freight.clientId !== clientId) {
      throw new ForbiddenException(
        'Apenas o dono do frete pode adicionar fotos',
      );
    }

    const count = await this.photosRepository.countByFreight(freightId);

    if (count >= MAX_PHOTOS_PER_FREIGHT) {
      throw new BadRequestException(
        `Limite de ${MAX_PHOTOS_PER_FREIGHT} fotos por frete atingido`,
      );
    }

    const extension = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

    if (!allowedExtensions.includes(extension)) {
      throw new BadRequestException(
        'Formato de arquivo não permitido. Use JPG, PNG, GIF ou WEBP',
      );
    }

    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${extension}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    fs.writeFileSync(filepath, file.buffer);

    const url = `/uploads/freight-photos/${filename}`;

    const photo = await this.photosRepository.create({
      freightId,
      url,
      order: count + 1,
    });

    return FreightPhotoMapper.toResponse(photo);
  }

  async findByFreight(
    freightId: string,
  ): Promise<FreightPhotoResponseDto[]> {
    const freight = await this.freightsRepository.findById(freightId);

    if (!freight) {
      throw new NotFoundException(`Frete com ID ${freightId} não encontrado`);
    }

    const photos = await this.photosRepository.findByFreight(freightId);

    return FreightPhotoMapper.toResponseList(photos);
  }

  async delete(
    freightId: string,
    photoId: string,
    clientId: string,
  ): Promise<void> {
    const freight = await this.freightsRepository.findById(freightId);

    if (!freight) {
      throw new NotFoundException(`Frete com ID ${freightId} não encontrado`);
    }

    if (freight.clientId !== clientId) {
      throw new ForbiddenException(
        'Apenas o dono do frete pode remover fotos',
      );
    }

    const photo = await this.photosRepository.findById(photoId);

    if (!photo || photo.freightId !== freightId) {
      throw new NotFoundException(
        `Foto com ID ${photoId} não encontrada neste frete`,
      );
    }

    const filename = path.basename(photo.url);
    const filepath = path.join(UPLOAD_DIR, filename);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    await this.photosRepository.delete(photoId);
  }
}
