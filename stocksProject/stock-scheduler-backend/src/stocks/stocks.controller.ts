import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { StocksService } from './stocks.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get('seed')
  seedData() {
    return this.stocksService.seed();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.stocksService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-bookmarks')
  getMyBookmarks(@Request() req) {
    return this.stocksService.getMyBookmarks(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/bookmark')
  toggleBookmark(@Request() req, @Param('id') id: string) {
    return this.stocksService.toggleBookmark(req.user.userId, +id);
  }
}
