import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { LoginUserDto } from '../dto/login.dto';
import { Role } from '../enums/role.enum';

@Entity()
export class User {
  validatePassword(password: LoginUserDto) {
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Name: string;

  @IsNotEmpty()
  @Column()
  email: string;

  @IsNotEmpty()
  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;


  @Column({ nullable: true, default: true })
  isGraduate: boolean;

  
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  roles: Role[];
}
