import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { DatabaseService } from 'src/database/database.service';
import { LogRepository } from 'src/repositories';

@Module({
  controllers: [ActivityController],
  providers: [DatabaseService, LogRepository, ActivityService],
  exports: [LogRepository, ActivityService]
})
export class ActivityModule {}
