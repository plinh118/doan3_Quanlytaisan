import { UploadFile } from 'antd';

export interface GetPersonnel {
  Id: number;
  PersonnelName: string;
  DivisionId: string;
  PositionId: string;
  DivisionName: string;
  PositionName: string;
  DateOfBirth: string | null;
  Gender:string|null;
  Email: string;
  PhoneNumber: string;
  JoinDate: string | null;
  EndDate: string | null;
  WorkStatus: string;
  Picture?: string | UploadFile[];
  TotalRecords: number;
}

export interface AddPersonnel {
  DivisionId: number;
  PersonnelName: string;
  PositionId: number;
  DateOfBirth: string | null;
  Picture: string | null;
  Email: string;
  Description: string | null;
  Gender:string|null;
  PhoneNumber: string |null;
  JoinDate: string | null;
  EndDate: string | null;
  WorkStatus: string;
}

export interface UpPersonnel {
  Id: number;
  DivisionId: number;
  PersonnelName: string;
  PositionId: number;
  DateOfBirth: string | null;
  Picture: string;
  Email: string;
  Gender:string|null;
  Description: string;
  PhoneNumber: string| null;
  JoinDate: string | null;
  EndDate: string | null;
  WorkStatus: string;
}
