import { NextResponse, type NextRequest } from 'next/server';
import { db_Provider } from '@/app/api/Api_Provider';
import type { GetPosition, AddPosistion } from '@/models/position.model';
import { executeQuery } from '@/libs/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageIndex = Number(searchParams.get('pageIndex')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const orderType = (searchParams.get('orderType') as 'ASC' | 'DESC') || 'ASC';
  const positionName = searchParams.get('positionName') || undefined;

  try {
    const result = await db_Provider<GetPosition[]>(
      'CALL GetPositionsByPageOrder(?, ?, ?, ?)',
      [pageIndex, pageSize, orderType, positionName || null],
    );
    console.log(result);
    return result;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách chức vụ:', error);
    throw new Error('Không thể lấy danh sách chức vụ.');
  }
}


export async function POST(request: NextRequest) {
  const body: AddPosistion = await request.json();
   const users = await executeQuery<any[]>(
      `SELECT * FROM Position WHERE PositionName = ? AND IsDeleted = 0`,
      [body.PositionName.trim()]
    );
  
    if (users.length > 0) {
      return NextResponse.json({ result: -1 }, { status: 200 }); 
    }
  return db_Provider<any>('CALL AddPosition(?)', [body.PositionName.trim()], true);
}

export async function PATCH(request: NextRequest) {
  const body: GetPosition = await request.json();
  return db_Provider<any>(
    'CALL UpdatePosition(?,?)',
    [body.Id, body.PositionName.trim()],
    true,
  );
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return new Response('Missing ID', { status: 400 });
  }
  return db_Provider<any>('CALL DeletePosition(?)', [id], true);
}
