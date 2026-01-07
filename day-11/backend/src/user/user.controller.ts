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
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'getting all data ' })
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'For gettring data' })
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
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  addUser(@Body() userDto: UserDto) {
    return this.userService.addUser(userDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'deleete all dataa' })
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
