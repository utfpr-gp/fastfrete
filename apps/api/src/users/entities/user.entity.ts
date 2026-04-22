export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface UserRole {
  readonly name: string;
  readonly roleType: string;
  readonly permissions: string[];
}

export class User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly phoneNumber: string;
  readonly status: UserStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly roles: UserRole[];

  constructor(props: User) {
    Object.assign(this, props);
  }
}
