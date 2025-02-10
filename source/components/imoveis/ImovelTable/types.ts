import { EstateLike } from "@/app/imovel/page";

export interface ImovelProps {
  id: number;
  status: string;
  nickname: string;
  address: string;
  paymentDay?: number;
  paymentLocation?: string;
  rentalValue?: number;
  numOfRooms?: number;
  cleaning: boolean;
  elevator: boolean;
  garage?: boolean;
  contractWith?: string;
  startDate?: string;
  endDate?: string;
  reajustmentIndex?: string;
  administrator?: string;
  administratorPhoneNumber?: number;
  admistratorEmail?: string;
  administrateTax?: string;
  lessee?: string;
  lesseePhone?: number;
  optionalContactName?: string;
  optionalContactNumber?: number;
  guarantor?: string;
  guarantorData?: string;
  guarantorNumber?: string;
  condominium?: string;
  IPTU?: string;
  observation?: string;
  userId?: string;
  type?: string;
  registrationCertification?: string;
}

export interface ImovelDataProps {
  data: EstateLike;
}

export interface ImovelDatasProps {
  datas: EstateLike[];
  openDeletePopUp: (estate: EstateLike) => void;
}

export interface ImovelIntDatasProps {
  datas: EstateLike[];
}
