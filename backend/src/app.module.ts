import { Module } from '@nestjs/common';
import { CardsModule } from './cards/cards.module';
import { DatabaseService } from './database/database.service';
import { ActivityModule } from './activity/activity.module';

@Module({
  imports: [CardsModule, ActivityModule],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class AppModule {}
