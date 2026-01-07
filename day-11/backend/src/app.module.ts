import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
  OnModuleInit,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MiddlewareModule } from './middleware/middleware.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    UserModule,
    MiddlewareModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '12345',
      database: 'testDb',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule, OnModuleInit {
  constructor(private dataSource: DataSource) {}

  onModuleInit() {
    if (this.dataSource.isInitialized) {
      console.log('---------------------------------');
      console.log('✅  Database Connected Successfully');
      console.log('---------------------------------');
    }
  }
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      //.forRoutes('user');
      .forRoutes({ path: 'user', method: RequestMethod.GET });
  }
}
/*
 TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '12345',
      database: 'testDb',
      autoLoadEntities: true,
      synchronize: true,
    })
      */
