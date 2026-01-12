import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StocksModule } from './stocks/stock.module';
import { User } from './users/entities/user.entity';
import { Stock } from './stocks/entities/stock.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [User, Stock],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    ScheduleModule.forRoot(),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('EMAIL_SVC_HOST_ADDRESS'), 
          port: 2525, 
          secure: false, 
          auth: {
            user: config.get('EMAIL_SVC_HOST_USER'),
            pass: config.get('EMAIL_SVC_HOST_PASS'),
          },
        },
        defaults: {
          from: `"${config.get('EMAIL_SVC_SENDER_NAME')}" <${config.get('EMAIL_SVC_SENDER_ADDRESS')}>`,
        },
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    UsersModule,
    StocksModule,
  ],
})
export class AppModule {}