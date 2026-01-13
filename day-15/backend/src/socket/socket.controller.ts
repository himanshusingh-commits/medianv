import { Controller, Get, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { socketService } from './socket.service';
import { socketGateway } from './socket.gateway';
import express from 'express';

@Controller('socket')
export class SocketController {
  constructor(
    private readonly chatService: socketService,
    private readonly chatGateway: socketGateway,
  ) {}

  @Get('messages')
  async getAllMessages(@Res() res: express.Response) {
    try {
      const messages = await this.chatService.findAllMessages();
      return res.status(HttpStatus.OK).json(messages);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error fetching messages', error: error.message });
    }
  }

  @Post('messages')
  async postMessage(
    @Body() body: { user: string; content: string },
    @Res() res: express.Response,
  ) {
    if (!body.user || !body.content) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'User and content are required' });
    }
    try {
      await this.chatService.saveMessage(body.user, body.content);
      this.chatGateway.broadcastMessage(body.user, body.content);
      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'Message saved successfully' });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error saving message', error: error.message });
    }
  }

  @Post('webhook')
  async handleWebhook(@Body() body: any, @Res() res: express.Response) {
    try {
      console.log('Webhook received:', body);

      const sender = 'System-Webhook';
      const content = JSON.stringify(body); 

      // 1. Save to DB
      await this.chatService.saveMessage(sender, content);

      // 2. Broadcast to all WebSocket clients
      this.chatGateway.broadcastMessage(sender, content);

      return res
        .status(HttpStatus.OK)
        .json({ status: 'Webhook received and broadcasted' });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
