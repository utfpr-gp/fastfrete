import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '../entities/user.entity';

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

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [UserRoleResponseDto] })
  roles: UserRoleResponseDto[];
}
