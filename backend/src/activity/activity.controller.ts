import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CardLog } from 'src/interfaces/log.interface';
import { ActivityService } from './activity.service';

@Controller('activity')
export class ActivityController {
  constructor(private readonly logService: ActivityService) {}

  @Get('recent')
  @ApiOperation({ summary: 'Obtener logs recientes paginados' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Número de página (>=1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 100,
    description: 'Número de items por página (>=1)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de logs recientes',
    type: [Object],
  })
  @ApiResponse({ status: 400, description: 'Parámetros inválidos' })
  @ApiResponse({ status: 500, description: 'Error del servidor' })
  async getRecentLogs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
  ): Promise<CardLog[]> {
    return this.logService.getRecentLogs(page, limit);
  }

  @Get(':entityType/:entityId')
  @ApiOperation({ summary: 'Obtener logs de una entidad específica' })
  @ApiParam({
    name: 'entityType',
    type: String,
    example: 'card',
    description: 'Tipo de entidad (por ejemplo, "card")',
  })
  @ApiParam({
    name: 'entityId',
    type: String,
    example: 'id-de-la-entidad',
    description: 'Id de la entidad',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de logs para la entidad',
    type: [Object],
  })
  @ApiResponse({ status: 400, description: 'Parámetros inválidos' })
  @ApiResponse({
    status: 500,
    description: 'Error al obtener los logs de entidad',
  })
  async getLogsByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ): Promise<CardLog[]> {
    return this.logService.getLogsByEntity(entityType, entityId);
  }
}
