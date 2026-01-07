import { MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UserDto {
  @ApiProperty({ description: 'The name of the user', example: 'John Doe' })
  @MinLength(3)
  name: string;
  @ApiProperty({ description: 'The email of the user', example: 'crickter' })
  type: string;
}
