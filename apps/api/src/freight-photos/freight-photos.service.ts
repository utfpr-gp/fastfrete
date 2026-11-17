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
import type { IApplicationsRepository } from '../applications/repositories/applications.repository.interface.js';
import { APPLICATIONS_REPOSITORY } from '../applications/repositories/applications.repository.interface.js';
import { FreightPhotoMapper } from './mappers/freight-photo.mapper.js';
import { FreightPhotoResponseDto } from './dto/freight-photo-response.dto.js';
import * as fs from 'fs';
import * as path from 'path';
import { CurrentUserData } from 'src/authorization/decorators/current-user.decorator.js';
import { FreightStatus } from '../freights/entities/freight.entity.js';

const MAX_PHOTOS_PER_FREIGHT = 3;
const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'freight-photos');

@Injectable()
export class FreightPhotosService {
  constructor(
    @Inject(FREIGHT_PHOTOS_REPOSITORY)
    private readonly photosRepository: IFreightPhotosRepository,
    @Inject(FREIGHTS_REPOSITORY)
    private readonly freightsRepository: IFreightsRepository,
    @Inject(APPLICATIONS_REPOSITORY)
    private readonly applicationsRepository: IApplicationsRepository,
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

    if (!file) {
      throw new BadRequestException('Arquivo é obrigatório');
    }

    const extension = (
      (file as Express.Multer.File & { detectedExtension?: string })
        .detectedExtension ?? path.extname(file.originalname)
    ).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

    if (!allowedExtensions.includes(extension)) {
      throw new BadRequestException(
        'Formato de arquivo não permitido. Use JPG, PNG, GIF ou WEBP',
      );
    }

    // Confere o limite antes de gravar qualquer arquivo em disco
    const currentPhotos = await this.photosRepository.countByFreight(freightId);
    if (currentPhotos >= MAX_PHOTOS_PER_FREIGHT) {
      throw new BadRequestException(
        `Limite de ${MAX_PHOTOS_PER_FREIGHT} fotos por frete atingido`,
      );
    }

    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${extension}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    await fs.promises.writeFile(filepath, file.buffer);

    const url = `/uploads/freight-photos/${filename}`;

    try {
      const photo = await this.photosRepository.createWithLimitCheck(
        freightId,
        url,
        MAX_PHOTOS_PER_FREIGHT,
      );

      return FreightPhotoMapper.toResponse(photo);
    } catch (error) {
      fs.unlinkSync(filepath);
      throw new BadRequestException(error.message);
    }
  }

  async findByFreight(
    freightId: string,
    currentUser: CurrentUserData,
  ): Promise<FreightPhotoResponseDto[]> {
    const freight = await this.freightsRepository.findById(freightId);

    if (!freight) {
      throw new NotFoundException(`Frete com ID ${freightId} não encontrado`);
    }

    const isOwner = freight.clientId === currentUser.id;
    const isAdmin = currentUser.roleTypes.includes('ADMIN');
    const isCarrier = currentUser.roleTypes.includes('CARRIER');
    const isOpenForCarriers =
      isCarrier && freight.status === FreightStatus.OPEN;

    let hasApplication = false;
    if (isCarrier && !isOpenForCarriers) {
      const applications =
        await this.applicationsRepository.findByFreight(freightId);
      hasApplication = applications.some(
        (app) => app.freighterId === currentUser.id,
      );
    }

    if (!isOwner && !isAdmin && !isOpenForCarriers && !hasApplication) {
      throw new ForbiddenException(
        'Você não tem permissão para visualizar as fotos deste frete',
      );
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
      throw new ForbiddenException('Apenas o dono do frete pode remover fotos');
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
