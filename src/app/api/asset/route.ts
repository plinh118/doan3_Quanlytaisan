import { NextResponse, type NextRequest } from 'next/server';
import { db_Provider } from '@/app/api/Api_Provider';
import type {
  GetAsset_DTO,
  AddAsset_DTO,
  UpAsset_DTO,
} from '@/models/asset.model';
import { executeQuery } from '@/libs/db';
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageIndex = Number(searchParams.get('pageIndex')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const orderType = (searchParams.get('orderType') as 'ASC' | 'DESC') || 'ASC';
  const AssetStatust = searchParams.get('AssetStatust') || undefined;
  const DivisionId=searchParams.get('divisionId') || undefined;
  const AssetName=searchParams.get('assetName') || undefined;

  try {
    const result = await db_Provider<GetAsset_DTO[]>(
      'CALL GetAssetsByPageOrder(?, ?, ?, ?,?,?)',
      [pageIndex, pageSize, orderType, AssetStatust || null,DivisionId|| null, AssetName|| null],
    );
    return result;
  } catch (error) {
    throw new Error('Không thể lấy danh sách bộ phận.');
  }
}

export async function POST(request: NextRequest) {
  const body: AddAsset_DTO = await request.json();
  const PersonnelId = body.PersonnelId ? body.PersonnelId : null;
  const StatDate = body.StatDate ? body.StatDate : null;
  const Description = body.Description ? body.Description.trim() : null;
  const Quantity=body.Quantity?body.Quantity:null;
  const Price=body.Price?body.Price:null;
  const existingDepartment = await executeQuery<any[]>(
    `SELECT * FROM Asset WHERE Id = "${body.Id.trim()}" AND IsDeleted = 0`,
   );
   if (existingDepartment.length > 0) {
     return NextResponse.json({ result: -2 }, { status: 200 }); 
   }
  return db_Provider<any>(
    'CALL InsertAsset(?,?,?,?,?,?,?,?,?,?)',
    [
     body.Id,body.AssetName.trim(),
     body.AssetType.trim(),body.DivisionId,Quantity,
     PersonnelId,Price,StatDate,body.StatusAsset,Description
    ],
    true,
  );
}

export async function PATCH(request: NextRequest) {
  const body: UpAsset_DTO = await request.json();
  const PersonnelId = body.PersonnelId ? body.PersonnelId : null;
  const StatDate = body.StatDate ? body.StatDate : null;
  const Description = body.Description ? body.Description.trim() : null;
  const Quantity=body.Quantity?body.Quantity:null;
  const Price=body.Price?body.Price:null;
  return db_Provider<any>(
    'CALL UpdateAsset(?,?,?,?,?,?,?,?,?,?)',
    [
      body.Id,body.AssetName.trim(),
      body.AssetType.trim(),body.DivisionId,
      PersonnelId,Quantity,Price,StatDate,body.StatusAsset,Description
     ],
    true,
  );
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return new Response('Missing ID', { status: 400 });
  }
  return db_Provider<any>('CALL DeleteAsset(?)', [id], true);
}
