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

  try {
    const result = await db_Provider<GetAsset_DTO[]>(
      'CALL GetAssetsByPageOrder(?, ?, ?, ?)',
      [pageIndex, pageSize, orderType, AssetName || null],
    );
    return result;
  } catch (error) {
    throw new Error('Không thể lấy danh sách bộ phận.');
  }
}

export async function POST(request: NextRequest) {
  const body: AddAsset_DTO = await request.json();
  const Price = body.Price ? body.Price : null;
  return db_Provider<any>(
    'CALL AddAsset(?,?,?,?,?,?)',
    [
      body.AssetName.trim(),
      body.TypeAsset.trim(),
      body.StatusAsset.trim(),
      body.Quantity,
      body.DivisionId,
      Price,
    ],
    true,
  );
}

export async function PATCH(request: NextRequest) {
  const body: UpAsset_DTO = await request.json();
  const Price = body.Price ? body.Price : null;

  return db_Provider<any>(
    'CALL UpdateAsset(?,?,?,?,?,?,?)',
    [
      body.Id,
      body.AssetName.trim(),
      body.TypeAsset.trim(),
      body.StatusAsset.trim(),
      body.Quantity,
      body.DivisionId,
      Price,
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
