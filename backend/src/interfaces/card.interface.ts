export interface Card {
  id?: string;
  title: string;
  descriptions?: CardDescription[];
  created_at?: Date;
}

export interface CardDescription {
  id?: string;
  card_id: string;
  description: string;
  created_at?: Date;
}