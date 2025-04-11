export interface GetConsult{
    Consult_Id: number;
    FullName: string;
    PhoneNumber: string;
    Status:string;
    Email: string;
    RelatedId?: number | null;
    RelatedType?: 'product' | 'service' | 'training_course' | string | null;
    Description?: string | null;
    Created_at: Date;
    Updated_at: Date;
    TotalRecords:number;
    RelatedName?: string | null;
}

  export interface AddConsultationDto {
    FullName: string;
    PhoneNumber: string;
    Status:string;
    Email: string;
    RelatedId?: number | null;
    RelatedType?: 'product' | 'service' | 'training_course' | string | null;
    Description?: string | null;
  }
  
  export interface UpdateConsultationDto extends Partial<AddConsultationDto> {
    Consult_id: number;
  }
  