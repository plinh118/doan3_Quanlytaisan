import { type NextRequest, NextResponse } from 'next/server';
import { db_Provider } from '@/app/api/Api_Provider';
import {
  AddIntellectualProperty,
  GetIntellectualProperty,
  UpIntellectualProperty,
} from '@/models/IntellectualProperty.model';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageIndex = Number(searchParams.get('pageIndex')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const orderType = (searchParams.get('orderType') as 'ASC' | 'DESC') || 'ASC';
  const IntellectualPropertyName =
    searchParams.get('intellectualPropertyName') || undefined;

  try {
    return db_Provider<GetIntellectualProperty[]>(
      'CALL GetIntellectualPropertiesByPageOrder(?, ?, ?, ?)',
      [pageIndex, pageSize, orderType, IntellectualPropertyName || null],
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Không thể lấy danh sách bản quyền.' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AddIntellectualProperty = await request.json();
    const Description = body.Description ? body.Description : null;

    return db_Provider<any>(
      'CALL AddIntellectualProperty(?,?,?,?,?)',
      [
        body.DepartmentId,
        body.IntellectualPropertyName.trim(),
        body.IntellectualPropertyImage.trim(),
        Description?.trim(),
        body.IntellectualPropertyStatus,
      ],
      true,
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Không thể thêm bản quyền.' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body: UpIntellectualProperty = await request.json();
    if (!body.Id) {
      return NextResponse.json(
        { error: 'Thiếu ID bản quyền' },
        { status: 400 },
      );
    }
    const Description = body.Description ? body.Description : null;

    return db_Provider<any>(
      'CALL UpdateIntellectualProperty(?,?,?,?,?,?)',
      [
        body.Id,
        body.DepartmentId,
        body.IntellectualPropertyName.trim(),
        body.IntellectualPropertyImage,
        Description?.trim(),
        body.IntellectualPropertyStatus,
      ],
      true,
    );
  } catch (error) {
    console.error('Lỗi khi cập nhật bản quyền:', error);
    return NextResponse.json(
      { error: 'Không thể cập nhật bản quyền.' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'Thiếu ID bản quyền' },
        { status: 400 },
      );
    }

    return db_Provider<any>('CALL DeleteIntellectualProperty(?)', [id], true);
  } catch (error) {
    console.error('Lỗi khi xóa bản quyền:', error);
    return NextResponse.json(
      { error: 'Không thể xóa bản quyền.' },
      { status: 500 },
    );
  }
}
