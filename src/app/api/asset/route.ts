import type { NextRequest } from 'next/server';
import { db_Provider } from '@/app/api/Api_Provider';
import type {
  GetAsset_DTO,
  AddAsset_DTO,
  UpAsset_DTO,
} from '@/models/asset.model';
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageIndex = Number(searchParams.get('pageIndex')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const orderType = (searchParams.get('orderType') as 'ASC' | 'DESC') || 'ASC';
  const AssetName = searchParams.get('assetName') || undefined;
  const DivisionId=searchParams.get('divisionId') || undefined;
  try {
    const result = await db_Provider<GetAsset_DTO[]>(
      'CALL GetAssetsByPageOrder(?, ?, ?, ?,?)',
      [pageIndex, pageSize, orderType, AssetName || null,DivisionId|| null],
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
  const Description = body.Description ? body.Description : null;
  const Quantity=body.Quantity?body.Quantity:null;
  return db_Provider<any>(
    'CALL InsertAsset(?,?,?,?,?,?,?,?,?,?)',
    [
     body.Id,body.AssetName.trim(),
     body.AssetType.trim(),body.DivisionId,Quantity,
     PersonnelId,body.Price,StatDate,body.StatusAsset,Description?.trim()
    ],
    true,
  );
}

export async function PATCH(request: NextRequest) {
  const body: UpAsset_DTO = await request.json();
  const PersonnelId = body.PersonnelId ? body.PersonnelId : null;
  const StatDate = body.StatDate ? body.StatDate : null;
  const Description = body.Description ? body.Description : null;
  const Quantity=body.Quantity?body.Quantity:null;

  return db_Provider<any>(
    'CALL UpdateAsset(?,?,?,?,?,?,?,?,?,?)',
    [
      body.Id,body.AssetName.trim(),
      body.AssetType.trim(),body.DivisionId,
      PersonnelId,Quantity,body.Price,StatDate,body.StatusAsset,Description?.trim()
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
