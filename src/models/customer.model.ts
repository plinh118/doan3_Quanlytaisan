export interface GetCustomer {
  Id: number;
  CustomerName: string;
  PhoneNumber: string;
  Email: string;
  Address: string;
  CustomerStatut:string;
  TotalRecords: number;
}

export interface AddCustomer {
  Id: number;
  CustomerName: string;
  PhoneNumber: string;
  CustomerStatut:string;
  Email: string;
  Address: string;
}
