export interface ImovelHistory {
  created_at?: string;
  data?: Date;
  id: number;
}

export type ImovelDataProps = ImovelHistory[] | null;
