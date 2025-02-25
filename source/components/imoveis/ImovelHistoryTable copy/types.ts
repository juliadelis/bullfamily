export interface ImovelHistory {
  created_at?: string;
  data?: Date;
  id: number;
  estate_id: number;
}

export type ImovelDataProps = ImovelHistory[] | null;
