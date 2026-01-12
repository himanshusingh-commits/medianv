import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class StocksService {
  constructor(
    @InjectRepository(Stock) private stockRepo: Repository<Stock>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async seed() {
    const stocks = [
      { symbol: 'AAPL', name: 'Apple Inc.', currentPrice: 150.00 },
      { symbol: 'TSLA', name: 'Tesla Inc.', currentPrice: 900.00 },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', currentPrice: 2800.00 },
      { symbol: 'AMZN', name: 'Amazon.com', currentPrice: 3400.00 },
      { symbol: 'MSFT', name: 'Microsoft Corp.', currentPrice: 300.00 },
    ];
    
    for (const s of stocks) {
      const exists = await this.stockRepo.findOne({ where: { symbol: s.symbol } });
      if (!exists) await this.stockRepo.save(s);
    }
    return 'Stocks Seeded!';
  }

  async findAll() {
    return this.stockRepo.find();
  }

  async toggleBookmark(userId: number, stockId: number) {

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const stock = await this.stockRepo.findOne({ where: { id: stockId } });
    if (!stock) throw new NotFoundException('Stock not found');

    const isBookmarked = user.bookmarks.some((s) => s.id === stock.id);

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter((s) => s.id !== stock.id);
    } else {
      user.bookmarks.push(stock);
    }

    await this.userRepo.save(user);
    return { bookmarked: !isBookmarked, currentBookmarks: user.bookmarks };
  }

  async getMyBookmarks(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });

    if (!user) {
        throw new NotFoundException('User not found');
    }

    return user.bookmarks;
  }
}