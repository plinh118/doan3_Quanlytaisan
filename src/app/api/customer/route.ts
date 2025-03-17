import { type NextRequest, NextResponse } from 'next/server';
import { db_Provider } from '@/app/api/Api_Provider';
import type { GetCustomer, AddCustomer } from '@/models/customer.model';
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageIndex = Number(searchParams.get('pageIndex')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const orderType = (searchParams.get('orderType') as 'ASC' | 'DESC') || 'ASC';
  const customerName = searchParams.get('customerName') || undefined;
  const phoneNumber = searchParams.get('phoneNumber') || undefined;
  const CustomerStatut = searchParams.get('customerStatut') || undefined;


  try {
    const customers = await db_Provider<GetCustomer[]>(
      'CALL GetCustomerByPageOrder(?, ?, ?, ?, ?,?)',
      [
        pageIndex,
        pageSize,
        orderType,
        customerName || null,
        phoneNumber || null,
        CustomerStatut || null
      ],
    );
    return customers;
  } catch (error) {
    return NextResponse.json(
      { error: 'Không thể lấy danh sách khách hàng.' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AddCustomer = await request.json();
    const Phone=body.PhoneNumber?body.PhoneNumber.trim(): null;
    const Email=body.Email?body.Email.trim(): null;
    const address=body.Address?body.Address.trim():null;
    return db_Provider<any>(
      'CALL AddCustomer(?,?,?,?,?)',
      [body.CustomerName.trim(), Phone, Email, address,body.CustomerStatut],
      true,
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Không thể thêm khách hàng.' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body: GetCustomer = await request.json();
    const Phone=body.PhoneNumber?body.PhoneNumber.trim(): null;
    const Email=body.Email?body.Email.trim(): null;
    const address=body.Address?body.Address.trim():null;
    return db_Provider<any>(
      'CALL UpdateCustomer(?,?,?,?,?,?)',
      [body.CustomerName.trim(), Phone, Email, address,body.CustomerStatut],
      true,
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Không thể cập nhật khách hàng.' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'Thiếu ID khách hàng' },
        { status: 400 },
      );
    }

    return db_Provider<any>('CALL DeleteCustomer(?)', [id], true);
  } catch (error) {
    return NextResponse.json(
      { error: 'Không thể xóa khách hàng.' },
      { status: 500 },
    );
  }
}
