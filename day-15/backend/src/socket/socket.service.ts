import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entity/message.entity';

@Injectable()
export class socketService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async findAllMessages(): Promise<Message[]> {
    return await this.messageRepository.find({
      order: { timestamp: 'ASC' },
    });
  }

  async saveMessage(user: string, content: string): Promise<Message> {
    const newMessage = this.messageRepository.create({ user, content });
    return this.messageRepository.save(newMessage);
  }

}
