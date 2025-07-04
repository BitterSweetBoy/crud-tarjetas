import { Module } from '@nestjs/common';
import { CardsModule } from './cards/cards.module';
import { DatabaseService } from './database/database.service';
import { ActivityModule } from './activity/activity.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      //envFilePath: ['.env', '../.env']
    }),
    CardsModule, ActivityModule],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class AppModule {}
