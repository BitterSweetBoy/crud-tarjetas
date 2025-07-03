import { Injectable } from '@nestjs/common';
import { LogRepository } from '../repositories/log-repository';
import { CardLog, LogAction, EntityType } from '../interfaces/log.interface';

@Injectable()
export class LogService {
  constructor(private readonly logRepository: LogRepository) {}

  async logCardOperation( action: LogAction, entityId: string, newData?: any, oldData?: any): Promise<void> {
    const logData: Omit<CardLog, 'id' | 'created_at'> = {
      action,
      entity_type: EntityType.CARD,
      entity_id: entityId,
      old_data: oldData,
      new_data: newData,
    };
    await this.logRepository.createLog(logData);
  }

}
