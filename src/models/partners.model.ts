export interface Partner_DTO {
  Id: number;
  PartnerName: String;
  PhoneNumber: string;
  Email: string;
  Address: string;
  StartDate: string;
  EndDate: string | null;
  PartnershipStatus: string;
  TotalRecords: number;
}

export interface AddPartner_DTO {
  PartnerName: string;
  PhoneNumber: string | null;
  Email: string | null;
  Address: string | null;
  StartDate: string | null;
  EndDate: string | null;
  PartnershipStatus: string;
}
