import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip, body } = req;
    const userAgent = req.get('user-agent') || '';
    const now = new Date();
    const logDetails = {
      timestamp: now.toISOString(),
      method,
      url: originalUrl,
      ip,
      userAgent,
      body:
        method === 'POST' || method === 'PUT'
          ? JSON.stringify(body)
          : undefined,
    };
    const logMessage = JSON.stringify(logDetails) + '\n';
    const logFilePath = path.join(process.cwd(), 'user-activity.txt');

    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error('Failed to write to log file', err);
      }
    });
    next();
  }
}
