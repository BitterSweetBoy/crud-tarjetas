import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LogRepository } from '../repositories';
import { CardLog } from 'src/interfaces/log.interface';

@Injectable()
export class ActivityService {
  constructor(private readonly logRepository: LogRepository) {}

  async getRecentLogs(page: number, limit: number): Promise<CardLog[]> {
    if (page < 1) {
      throw new BadRequestException('El parámetro page debe ser >= 1');
    }
    if (limit < 1) {
      throw new BadRequestException('El parámetro limit debe ser >= 1');
    }

    const offset = (page - 1) * limit;

    try {
      return await this.logRepository.findAllLogs(limit, offset);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al recuperar logs recientes',
      );
    }
  }

  async getLogsByEntity(
    entityType: string,
    entityId: string,
  ): Promise<CardLog[]> {
    if (!entityType?.trim()) {
      throw new BadRequestException('El parámetro entityType es inválido');
    }
    if (!entityId?.trim()) {
      throw new BadRequestException(
        'El parámetro entityId no puede estar vacío',
      );
    }

    try {
      const logs = await this.logRepository.findLogsByEntity(
        entityType,
        entityId,
      );
      if (logs.length === 0) {
        throw new NotFoundException(
          `No se encontraron logs para la entidad "${entityType}" con Id "${entityId}"`,
        );
      }
      return logs;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al recuperar los logs de la entidad',
      );
    }
  }
}
