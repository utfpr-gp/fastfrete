import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import type { IUsersRepository } from './repositories/users.repository.interface.js';
import { USERS_REPOSITORY } from './repositories/users.repository.interface.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UsersFilterDto } from './dto/users-filter.dto.js';
import { User, UserStatus } from './entities/user.entity.js';
import { CryptoService } from '../common/crypto/crypto.service.js';
import { PaginatedResponseDto } from '../common/pagination/index.js';
import { UserMapper } from './mappers/user.mapper.js';
import { UserResponseDto } from './dto/user-response.dto.js';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await this.cryptoService.hashPassword(
      createUserDto.password,
    );

    // Create user with role assignment
    return this.usersRepository.create(
      {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
        phoneNumber: createUserDto.phoneNumber,
        cityId: createUserDto.cityId,
      },
      createUserDto.roleType,
    );
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findAllPaginated(
    filterDto: UsersFilterDto,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const { page = 1, limit = 10, name, email, status } = filterDto;

    const result = await this.usersRepository.findAllPaginated(
      { name, email, status },
      { page, limit },
    );

    const responseData = UserMapper.toResponseList(result.data);

    return PaginatedResponseDto.create({
      data: responseData,
      total: result.total,
      page,
      limit,
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id);

    if (updateUserDto.email) {
      const existingUser = await this.usersRepository.findByEmail(
        updateUserDto.email,
      );

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already exists');
      }
    }

    const dataToUpdate = { ...updateUserDto };

    if (updateUserDto.password) {
      dataToUpdate.password = await this.cryptoService.hashPassword(
        updateUserDto.password,
      );
    }

    return this.usersRepository.update(id, dataToUpdate);
  }

  async remove(id: string): Promise<User> {
    await this.findOne(id);

    return this.usersRepository.delete(id);
  }

  async suspend(id: string, reason: string, adminId: string): Promise<User> {
    if (id === adminId) {
      throw new BadRequestException('Admin cannot suspend themselves');
    }

    const user = await this.findOne(id);

    if (user.status === UserStatus.SUSPENDED) {
      throw new ConflictException('User is already suspended');
    }

    return this.usersRepository.update(id, {
      status: UserStatus.SUSPENDED,
      suspensionReason: reason,
    });
  }

  async reactivate(id: string): Promise<User> {
    const user = await this.findOne(id);

    if (user.status === UserStatus.ACTIVE) {
      throw new ConflictException('User is already active');
    }

    return this.usersRepository.update(id, {
      status: UserStatus.ACTIVE,
      suspensionReason: null,
    });
  }
}
