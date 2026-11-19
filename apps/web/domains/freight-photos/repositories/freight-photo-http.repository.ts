import type { IFreightPhotoRepository } from './freight-photo.repository.interface'
import type { FreightPhoto } from '../entities/freight-photo.entity'
import type { IHttpClient, HttpResult } from '~~/infra/http/http-client.interface'

export class FreightPhotoHttpRepository implements IFreightPhotoRepository {
  private httpClient: IHttpClient

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async upload(freightId: string, file: File): Promise<HttpResult<FreightPhoto>> {
    const formData = new FormData()
    formData.append('file', file)

    return this.httpClient.post<FreightPhoto>(`/api/freights/${freightId}/photos`, formData)
  }

  async findByFreight(freightId: string): Promise<HttpResult<FreightPhoto[]>> {
    return this.httpClient.get<FreightPhoto[]>(`/api/freights/${freightId}/photos`)
  }

  async delete(freightId: string, photoId: string): Promise<HttpResult<void>> {
    return this.httpClient.delete<void>(`/api/freights/${freightId}/photos/${photoId}`)
  }
}
