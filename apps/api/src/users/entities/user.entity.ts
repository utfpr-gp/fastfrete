export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface UserRole {
  readonly name: string;
  readonly roleType: string;
  readonly permissions: string[];
}

export interface UserCity {
  readonly id: string;
  readonly name: string;
  readonly state: string;
}

export class User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly phoneNumber: string;
  readonly status: UserStatus;
  readonly suspensionReason?: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly roles: UserRole[];
  readonly city: UserCity;

  constructor(props: User) {
    Object.assign(this, props);
  }
}
