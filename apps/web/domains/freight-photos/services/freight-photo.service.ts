import type { IFreightPhotoRepository } from '../repositories/freight-photo.repository.interface'
import type { FreightPhoto } from '../entities/freight-photo.entity'
import type { HttpResult } from '~~/infra/http/http-client.interface'

export class FreightPhotoService {
  private repository: IFreightPhotoRepository

  constructor(repository: IFreightPhotoRepository) {
    this.repository = repository
  }

  async upload(freightId: string, file: File): Promise<HttpResult<FreightPhoto>> {
    return this.repository.upload(freightId, file)
  }

  async findByFreight(freightId: string): Promise<HttpResult<FreightPhoto[]>> {
    return this.repository.findByFreight(freightId)
  }

  async delete(freightId: string, photoId: string): Promise<HttpResult<void>> {
    return this.repository.delete(freightId, photoId)
  }
}
