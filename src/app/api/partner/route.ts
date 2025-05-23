import { type NextRequest, NextResponse } from 'next/server';
import { db_Provider } from '@/app/api/Api_Provider';
import type { Partner_DTO, AddPartner_DTO } from '@/models/partners.model';
import { formatDate } from '@/utils/date';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageIndex = Number(searchParams.get('pageIndex')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const orderType = (searchParams.get('orderType') as 'ASC' | 'DESC') || 'ASC';
  const partnerName = searchParams.get('partnerName') || undefined;
  const phoneNumber = searchParams.get('phoneNumber') || undefined;

  try {
    return db_Provider<Partner_DTO[]>(
      'CALL GetPartnerByPageOrder(?, ?, ?, ?, ?)',
      [
        pageIndex,
        pageSize,
        orderType,
        partnerName || null,
        phoneNumber || null,
      ],
    );
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đối tác:', error);
    return NextResponse.json(
      { error: 'Không thể lấy danh sách đối tác.' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AddPartner_DTO = await request.json();

    const formattedEndDate = body.EndDate ? body.EndDate : null;
    const phone = body.PhoneNumber?body.PhoneNumber: null;
    const address = body.Address?body.Address.trim(): null;
    const Email = body.Email?body.Email.trim(): null;
    const startDate = body.StartDate ? body.StartDate :null;
    return db_Provider<any>(
      'CALL AddPartner(?,?,?,?,?,?,?)',
      [
        body.PartnerName.trim(),
        phone,
        Email,
        address,
        startDate,
        formattedEndDate,
        body.PartnershipStatus,
      ],
      true,
    );
  } catch (error) {
    console.error('Lỗi khi thêm đối tác:', error);
    return NextResponse.json(
      { error: 'Không thể thêm đối tác.' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body: Partner_DTO = await request.json();
    if (!body.Id) {
      return NextResponse.json({ error: 'Thiếu ID đối tác' }, { status: 400 });
    }

   
    const formattedEndDate = body.EndDate ? body.EndDate : null;
    const phone = body.PhoneNumber?body.PhoneNumber: null;
    const address = body.Address?body.Address.trim(): null;
    const Email = body.Email?body.Email.trim(): null;
    const startDate = body.StartDate ? body.StartDate :null;
    return db_Provider<any>(
      'CALL UpdatePartner(?,?,?,?,?,?,?,?)',
      [
        body.Id,
        body.PartnerName.trim(),
        phone,
        Email,
        address,
        startDate,
        formattedEndDate,
        body.PartnershipStatus,
      ],
      true,
    );
  } catch (error) {
    console.error('Lỗi khi cập nhật đối tác:', error);
    return NextResponse.json(
      { error: 'Không thể cập nhật đối tác.' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID đối tác' }, { status: 400 });
    }

    return db_Provider<any>('CALL DeletePartner(?)', [id], true);
  } catch (error) {
    console.error('Lỗi khi xóa đối tác:', error);
    return NextResponse.json(
      { error: 'Không thể xóa đối tác.' },
      { status: 500 },
    );
  }
}
