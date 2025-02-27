export interface UpAsset_DTO {
  Id: number;
  AssetName: string;
  TypeAsset: string;
  StatusAsset: string;
  Quantity: number;
  DivisionId: number;
  Price: number | null;
}
export interface AddAsset_DTO {
  AssetName: string;
  TypeAsset: string;
  StatusAsset: string;
  Quantity: number;
  DivisionId: number;
  Price: number | null;
}
export interface GetAsset_DTO {
  Id: number;
  AssetName: string;
  TypeAsset: string;
  StatusAsset: string;
  Quantity: number;
  DivisionId: number;
  DivisionName: string;
  Price: number | null;
  TotalRecords: number;
}
