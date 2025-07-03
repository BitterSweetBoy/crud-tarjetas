import { Module } from '@nestjs/common';
import { CardsModule } from './cards/cards.module';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [CardsModule],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class AppModule {}
