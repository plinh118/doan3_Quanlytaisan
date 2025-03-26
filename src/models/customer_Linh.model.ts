export interface AddCustomer_Link{
    CustomerId:number | undefined;
    RelatedId:number | undefined;
    RelatedType:string;
}
export interface GetCustomer_Link{
    Id:number;
    RelatedId:number;
    RelatedType:string;
    RelatedName:string;
    RelatedStatus:string;
    CustomerId:number;
    CustomerName:string;
    TotalRecords:number;
}