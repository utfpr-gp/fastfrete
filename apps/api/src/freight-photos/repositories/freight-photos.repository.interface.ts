import { FreightPhoto } from '../entities/freight-photo.entity.js';

export const FREIGHT_PHOTOS_REPOSITORY = Symbol('FREIGHT_PHOTOS_REPOSITORY');

export interface CreateFreightPhotoData {
  freightId: string;
  url: string;
  order: number;
}

export interface IFreightPhotosRepository {
  create(data: CreateFreightPhotoData): Promise<FreightPhoto>;
  findById(id: string): Promise<FreightPhoto | null>;
  findByFreight(freightId: string): Promise<FreightPhoto[]>;
  countByFreight(freightId: string): Promise<number>;
  delete(id: string): Promise<void>;
}
