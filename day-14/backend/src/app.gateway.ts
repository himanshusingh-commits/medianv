import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DatabaseService } from './database.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private connectedUsers: Map<string, string> = new Map();

  constructor(private readonly databaseService: DatabaseService) {}

  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    const userName = this.connectedUsers.get(client.id) || 'A user';
    console.log(`Client disconnected: ${client.id}`);
    this.server.emit('room', `${userName} left!`);
    this.connectedUsers.delete(client.id);
  }

  @SubscribeMessage('setName')
  handleSetName(
    @ConnectedSocket() client: Socket,
    @MessageBody() name: string,
  ): void {
    this.connectedUsers.set(client.id, name);
    this.server.emit('room', `${name} joined!`);
    console.log(`Client ${client.id} set name to: ${name}`);
  }

  @SubscribeMessage('customName')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: any,
  ): Promise<void>  {
    const userName = this.connectedUsers.get(client.id) || 'Anonymous';
    console.log(`Message from ${client.id} (${userName}): ${message}`);
    const messageData = {
    user: userName,
    content: message,
  };
    console.log('Saving to database:', messageData);
    
    await this.databaseService.saveMessage({
      user: userName,
      content: message,
    });
    this.server.emit('room', `[${userName}] -> ${message}`);
  }
}
