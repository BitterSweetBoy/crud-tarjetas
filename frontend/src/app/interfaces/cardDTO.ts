export interface PagedResponse<T> {
  page: number;
  limit: number;
  total: number;
  data: T[];
}

export interface CardDto {
  id: string;
  title: string;
  created_at: string;
  descriptions: CardDescriptionDto[];
}

export interface CardDescriptionDto {
  id: string;
  description: string;
  Created_at: string;
}

export interface createCardDTO{
    title: string,
    descriptions: string[]
}