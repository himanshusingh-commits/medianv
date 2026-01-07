import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  private users = [
    {
      id: 1,
      name: 'lavesh',
      type: 'normal',
    },
    {
      id: 2,
      name: 'kiara',
      type: 'not normal',
    },
  ];
  getAllUsers() {
    return this.users;
  }

  getUsers(id: number) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new Error('user not found');
    }
    return user;
  }

  addUser(user: UserDto) {
    const id = Date.now();
    this.users.push({
      id,
      ...user,
    });
    return this.getUsers(id);
  }

  deleteUser(id: number) {
    const initialLength = this.users.length;
    this.users = this.users.filter((u) => u.id !== id);

    if (this.users.length === initialLength) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { message: `User with ID ${id} deleted successfully` };
  }
}
