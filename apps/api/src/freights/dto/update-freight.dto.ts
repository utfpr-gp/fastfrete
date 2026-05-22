import { PartialType } from '@nestjs/swagger';
import { CreateFreightDto } from './create-freight.dto.js';

export class UpdateFreightDto extends PartialType(CreateFreightDto) {}
