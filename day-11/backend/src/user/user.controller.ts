import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUsers(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.userService.getUsers(id);
    } catch (error) {

      if (error.message === 'user not found') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error;
    }
  }

  @Post()
  addUser(@Body() userDto: UserDto) {
    return this.userService.addUser(userDto);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
/*
Get(/user)
get(/user/:id)
post(/user)
delete
*/
