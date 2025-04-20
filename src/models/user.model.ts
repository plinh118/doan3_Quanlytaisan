export interface GetUser {
  Id: number;
  Email: string;
  Password: string;
  FullName: string;
  Role: string;
  Created_at: Date;
  updated_at: Date;
  TotalRecords: number;
}
export interface AddUser {
  Email: string;
  Password: string;
  FullName: string;
  Role: string;
}
export interface UpUser {
  Id: number;
  Email: string;
  Password: string;
  FullName: string;
  Role: string;
}
