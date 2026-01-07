import { MinLength } from 'class-validator';

export class UserDto {
  @MinLength(3)
  name: string;
  type: string;
}
