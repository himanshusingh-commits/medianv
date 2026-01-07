import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
//import { User } from './entity/user.entity';
//import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
