export interface AddCustomer_Link{
    CustomerId:number;
    RelatedId:number | undefined;
    RelatedType:string;
}
export interface GetCustomer_Link{
    Id:number;
    RelatedId:number;
    RelatedType:string;
    CustomerName:string;
    TotalRecords:number;
}