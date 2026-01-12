import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';
import { Stock } from './entities/stock.entity';
import { User } from '../users/entities/user.entity';
import { StockScheduler } from './stock.scheduler';
@Module({
  imports: [TypeOrmModule.forFeature([Stock, User])], 
  controllers: [StocksController],
  providers: [StocksService, StockScheduler],
  exports: [StocksService],
})
export class StocksModule {}
