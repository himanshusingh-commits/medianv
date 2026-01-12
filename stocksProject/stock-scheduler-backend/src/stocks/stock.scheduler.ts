import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Stock } from './entities/stock.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class StockScheduler {
  private readonly logger = new Logger(StockScheduler.name);

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Stock) private stockRepo: Repository<Stock>,
    private readonly mailerService: MailerService,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleVolatilityCheck() {
    this.logger.log(' Checking for Market Volatility...');

    const users = await this.userRepo.find({ relations: ['bookmarks'] });

    for (const user of users) {
      if (!user.bookmarks || user.bookmarks.length === 0) continue;

      let alertBody = `<h3> High Volatility Alert for ${user.name}</h3><ul>`;
      let sendAlert = false;

      for (const stock of user.bookmarks) {
        const randomPercent = Math.random() * 12 - 6;
        const oldPrice = Number(stock.currentPrice);
        const newPrice = oldPrice + oldPrice * (randomPercent / 100);

        stock.currentPrice = parseFloat(newPrice.toFixed(2));
        await this.stockRepo.save(stock);

        if (Math.abs(randomPercent) >= 5) {
          sendAlert = true;
          const direction = randomPercent > 0 ? 'SKYROCKETED ' : 'CRASHED ';
          const color = randomPercent > 0 ? 'green' : 'red';

          alertBody += `
            <li>
              <b>${stock.symbol}</b> ${direction} by <span style="color:${color}">${randomPercent.toFixed(2)}%</span><br>
              Price: $${oldPrice.toFixed(2)} ➝ <b>$${stock.currentPrice}</b>
            </li>
          `;
        }
      }
      alertBody += `</ul>`;


      if (sendAlert) {
        await this.sendEmail(user.email, ' Stock Price Alert!', alertBody);
      }
    }
  }

  @Cron('0 8 * * *')
  async handleDailySummary() {
    this.logger.log(' Sending Morning Summaries...');

    const users = await this.userRepo.find({ relations: ['bookmarks'] });

    for (const user of users) {
      if (!user.bookmarks || user.bookmarks.length === 0) continue;

      let summaryBody = `
        <h3>Good Morning, ${user.name}! </h3>
        <p>Here is your daily portfolio summary:</p>
        <table border="1" cellpadding="5" style="border-collapse: collapse;">
          <tr>
            <th>Stock</th>
            <th>Price</th>
          </tr>
      `;

      for (const stock of user.bookmarks) {
        summaryBody += `
          <tr>
            <td><b>${stock.symbol}</b></td>
            <td>$${stock.currentPrice}</td>
          </tr>
        `;
      }
      summaryBody += `</table>`;

      await this.sendEmail(
        user.email,
        ' Your Morning Stock Summary',
        summaryBody,
      );
    }
  }

  private async sendEmail(to: string, subject: string, html: string) {
    try {
      await this.mailerService.sendMail({
        to: to,
        subject: subject,
        html: html,
      });
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      this.logger.error(` Failed to send email to ${to}`, error.stack);
    }
  }
}
