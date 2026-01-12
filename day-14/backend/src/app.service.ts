import { Injectable } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { DatabaseService } from './database.service';
@Injectable()
export class AppService {
  constructor(
    private readonly appGateway: AppGateway,
    private readonly databaseService: DatabaseService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  emitToWebsockets(message: string): void {
    this.appGateway.server.emit('room', `[HTTP POST] -> ${message}`);
  }
  async getMessages() {
    return this.databaseService.findAllMessages();
  }
}

