import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CardRepository } from '../repositories/card-repository';
import { CardService } from './card.service';
import { CardController } from './card.controller';

@Module({
  controllers: [CardController],
  providers: [DatabaseService, CardRepository, CardService],
  exports: [CardRepository, CardService],
})
export class CardsModule {}
