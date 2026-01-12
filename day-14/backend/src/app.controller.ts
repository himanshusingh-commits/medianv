import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('message')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('send-http')
  sendMessageViaHttp(@Body('message') message: string): string {
    if (!message) {
      return 'Error: Please provide "message" in the request body.';
    }

    this.appService.emitToWebsockets(message);
    return `Message received via HTTP: "${message}". Check WebSocket clients.`;
  }

  @Get('history')
  async getChatHistory() {
    return this.appService.getMessages();
  }
}

