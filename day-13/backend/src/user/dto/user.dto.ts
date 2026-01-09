import { Exclude, Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly Name: string;

  @Expose()
  readonly email: string;

  @Exclude()
  readonly password: string;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
