import type { Application } from '../entities/application.entity'
import type { CreateApplicationDto } from '../dtos/create-application.dto'
import type { UpdateApplicationDto } from '../dtos/update-application.dto'
import type { HttpResult } from '~~/infra/http/http-client.interface'

export interface IApplicationRepository {
  create(freightId: string, data: CreateApplicationDto): Promise<HttpResult<Application>>
  findByFreight(freightId: string): Promise<HttpResult<Application[]>>
  findOne(id: string): Promise<HttpResult<Application>>
  update(id: string, data: UpdateApplicationDto): Promise<HttpResult<Application>>
  accept(id: string): Promise<HttpResult<Application>>
  reject(id: string): Promise<HttpResult<Application>>
  complete(id: string): Promise<HttpResult<Application>>
  withdraw(id: string): Promise<HttpResult<Application>>
}
