import { NextResponse, type NextRequest } from 'next/server';
import { db_Provider } from '@/app/api/Api_Provider';
import type {
  GetDepartment,
  AddDepartment,
  Department_DTO,
} from '@/models/department.model';
import { executeQuery } from '@/libs/db';
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageIndex = Number(searchParams.get('pageIndex')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const orderType = (searchParams.get('orderType') as 'ASC' | 'DESC') || 'ASC';
  const departmentName = searchParams.get('departmentName') || undefined;

  try {

    const result = await db_Provider<Department_DTO[]>(
      'CALL GetDepartmentByPageOrder(?, ?, ?, ?)',
      [pageIndex, pageSize, orderType, departmentName || null],
    );
    return result;
  } catch (error) {
    throw new Error('Không thể lấy danh sách đơn vị.');
  }
}

export async function POST(request: NextRequest) {
  const body: AddDepartment = await request.json();
  const Description = body.Description ? body.Description : null;
  const users = await executeQuery<any[]>(
    `SELECT * FROM Department WHERE DepartmentName = ? AND IsDeleted = 0`,
    [body.DepartmentName.trim()]
  );

  if (users.length > 0) {
    return NextResponse.json({ result: -1 }, { status: 200 }); 
  }
  return db_Provider<any>(
    'CALL AddDepartment(?,?)',
    [body.DepartmentName.trim(), Description],
    true,
  );
}

export async function PATCH(request: NextRequest) {
  const body: GetDepartment = await request.json();
  const Description = body.Description ? body.Description : null;

  return db_Provider<any>(
    'CALL UpdateDepartment(?,?,?)',
    [body.Id, body.DepartmentName.trim(), Description],
    true,
  );
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return new Response('Missing ID', { status: 400 });
  }
  return db_Provider<any>('CALL DeleteDepartment(?)', [id], true);
}
