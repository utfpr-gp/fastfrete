import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '../entities/user.entity';

export class CityResponseDto {
  @ApiProperty({ example: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Guarapuava' })
  name!: string;

  @ApiProperty({ example: 'Paraná' })
  state!: string;
}

export class UserRoleResponseDto {
  @ApiProperty({ example: 'CUSTOMER' })
  name: string;

  @ApiProperty({ example: 'CUSTOMER' })
  roleType: string;

  @ApiProperty({
    example: ['profile:read', 'profile:update'],
    type: [String],
  })
  permissions: string[];
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty({ enum: UserStatus })
  status: UserStatus;

  @ApiPropertyOptional({
    description: 'Motivo da suspensão (apenas presente quando status = SUSPENDED)',
    example: 'Violação das regras da plataforma',
  })
  suspensionReason: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [UserRoleResponseDto] })
  roles: UserRoleResponseDto[];

  @ApiProperty({ type: CityResponseDto })
  city!: CityResponseDto;
}
