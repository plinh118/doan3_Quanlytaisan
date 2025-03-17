export interface Add_project {
  ProjectName: string;
  DepartmentId: number;
  PartnerId: number | null;
  Description: string | null;
  ProjectStartDate: string;
  ProjectEndDate: string | null;
  CustomerId:number | null;
  ProjectStatus: string;
}

export interface Up_project {
  Id: number;
  ProjectName: string;
  DepartmentId: number;
  PartnerId: number | null;
  Description: string | null;
  ProjectStartDate: string;
  ProjectEndDate: string | null;
  CustomerId:number | null;
  ProjectStatus: string;
}

export interface Get_project {
  Id: number;
  ProjectName: string;
  DepartmentId: number;
  DepartmentName: string;
  PartnerId: number | null;
  PartnerName: string;
  Description: string | null;
  ProjectStartDate: string;
  ProjectEndDate: string | null;
  ProjectStatus: string;
  CustomerId:number | null;
  TotalRecords: number;
}
