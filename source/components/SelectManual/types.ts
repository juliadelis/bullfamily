import { Estate } from "@/@types/estate";

export interface SelectProps {
  label?: string;
  options: Estate[];
  classNameSelect?: string;
  classNameContainer?: string;
  value: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}
type MesSelectOption = {
  label: string;
  value: number;
};
export interface SelectMesProps {
  label?: string;
  options: MesSelectOption[];
  classNameSelect?: string;
  classNameContainer?: string;
  value: number;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

type YearOption = {
  label: number;
  value: number;
};

export interface SelectYearProps {
  label?: string;
  options: YearOption[];
  classNameSelect?: string;
  classNameContainer?: string;
  value: number;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}
