export interface GetDepartment {
  Id: number;
  DepartmentName: string;
  Description: string | null;
  TotalDivisions: number;
  TotalRecords: number;
}

export interface AddDepartment {
  DepartmentName: string;
  Description: string | null;
}

export interface Department_DTO {
  DepartmentId: number;
  DepartmentName: string;
  Description: string | null;
  TotalDivisions: number;
  TotalRecords: number;
}
