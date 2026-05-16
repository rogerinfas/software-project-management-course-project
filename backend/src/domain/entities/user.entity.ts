export class UserEntity {
  id: string;
  email: string;
  emailVerified: boolean;
  password?: string;
  name?: string | null;
  image?: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
