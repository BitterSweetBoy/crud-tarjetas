export interface CardLog {
  id?: string;
  action: LogAction;
  entity_type: EntityType;
  entity_id: string;
  old_data?: any;
  new_data?: any;
  created_at?: Date;
}

export enum LogAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  READ = 'READ'
}

export enum EntityType {
  CARD = 'CARD'
}