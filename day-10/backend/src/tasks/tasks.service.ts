import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  @Cron(CronExpression.EVERY_MINUTE)
  handleCron() {
   /* this.logger.debug(
      'Cron job started: Called every minute to perform a task',
    );
*/
    console.log('Cron is working');
/*
    try {
      const data = await this.fetchSomeData();

      this.logger.debug(`Successfully fetched data: ${JSON.stringify(data)}`);

      this.logger.debug('Cron job completed successfully.');
    } catch (error) {
      this.logger.error('Error during cron job execution', error.stack);
      */
    }
}

 /* private async fetchSomeData(): Promise<{ timestamp: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ timestamp: Date.now() });
      }, 1000);
    });
  }
}*/
