import { Estate } from "@/app/imovel/page";

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
  data: Estate;
}

export interface ImovelDatasProps {
  datas: Estate[];
  openDeletePopUp: (estate: Estate) => void;
}

export interface ImovelIntDatasProps {
  datas: Estate[];
}
