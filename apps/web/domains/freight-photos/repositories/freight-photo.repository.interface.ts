import type { FreightPhoto } from '../entities/freight-photo.entity'
import type { HttpResult } from '~~/infra/http/http-client.interface'

export interface IFreightPhotoRepository {
  upload(freightId: string, file: File): Promise<HttpResult<FreightPhoto>>
  findByFreight(freightId: string): Promise<HttpResult<FreightPhoto[]>>
  delete(freightId: string, photoId: string): Promise<HttpResult<void>>
}
