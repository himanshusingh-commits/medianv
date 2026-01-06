import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUser() {
    // const userService = new UserService();

    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.userService.getUsers(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
    // const userService = new UserService();
  }
  @Post()
  addUser(@Body(new ValidationPipe()) user: UserDto) {
    return this.userService.addUser(user);
  }
}
/*
Get(/user)
get(/user/:id)
post(/user)

*/
