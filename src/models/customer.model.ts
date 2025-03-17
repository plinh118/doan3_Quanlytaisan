export interface GetCustomer {
  Id: number;
  CustomerName: string;
  PhoneNumber: string | null;
  Email: string | null;
  Address: string | null;
  CustomerStatut:string;
  TotalRecords: number;
}

export interface AddCustomer {
  Id: number;
  CustomerName: string;
  PhoneNumber: string | null;
  CustomerStatut:string;
  Email: string | null;
  Address: string | null;
}
