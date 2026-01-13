import { Module } from '@nestjs/common';
import { socketService } from './socket.service';
import { SocketController } from './socket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entity/message.entity';
import { socketGateway } from './socket.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  providers: [socketService, socketGateway],
  controllers: [SocketController],
})
export class SocketModule {}
