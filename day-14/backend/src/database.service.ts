import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity'; 

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
  ) {}

  async saveMessage(messageData: { user: string; content: string }) {
    const newMessage = this.messageRepo.create(messageData);
    return await this.messageRepo.save(newMessage);
  }
  async findAllMessages() {
  return await this.messageRepo.find({ order: { id: 'ASC' } });
}

}