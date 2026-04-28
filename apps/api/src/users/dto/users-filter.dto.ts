import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/pagination/index.js';
import { UserStatus } from '../entities/user.entity.js';

/**
 * Filter DTO for listing users with pagination.
 * Extends PaginationQueryDto to include page and limit.
 *
 * Filter behaviors:
 * - name: Partial match, case insensitive (contains)
 * - email: Exact match
 * - status: Exact match (enum)
 */
export class UsersFilterDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by name (partial match, case insensitive)',
    example: 'John',
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by email (exact match)',
    example: 'john@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Status must be ACTIVE or SUSPENDED' })
  status?: UserStatus;
}
