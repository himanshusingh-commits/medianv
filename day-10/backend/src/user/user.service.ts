import { Injectable } from '@nestjs/common';
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
    //id
    const id = Date.now();
    this.users.push({
      id,
      ...user,
    });
    return this.getUsers(id);
  }
}
