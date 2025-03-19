import type { NextRequest } from 'next/server';
import { db_Provider } from '@/app/api/Api_Provider';
import type { AddCustomer_Link,GetCustomer_Link } from '@/models/customer_Linh.model';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageIndex = Number(searchParams.get('pageIndex')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const orderType = (searchParams.get('orderType') as 'ASC' | 'DESC') || 'ASC';
  const CustomerName =(searchParams.get('CustomerName') ) || undefined ;
  const p_RelatedId=(searchParams.get('RelatedId') ) || undefined;
  const RelatedType = searchParams.get('RelatedType') || undefined;
  const CustomerId=searchParams.get('CustomerId') || undefined;
  const RelatedName=searchParams.get('RelatedName') || undefined;

  try {
    const result = await db_Provider<GetCustomer_Link[]>(
      'CALL GetCustomerLinksByPageOrder(?, ?, ?, ?,?,?,?,?)',
      [
        pageIndex,
        pageSize,
        orderType,
        CustomerName || null,
        p_RelatedId || null,
        RelatedType || null,
        CustomerId || null,
        RelatedName || null
      ],
    );
    return result;
  } catch (error) {
    throw new Error('Không thể lấy danh sách bộ phận.');
  }
}

export async function POST(request: NextRequest) {
  const body: AddCustomer_Link = await request.json();

  return db_Provider<any>(
    'CALL AddCustomerLink(?,?,?)',
    [body.CustomerId, body.RelatedId, body.RelatedType],
    true,
  );
}

export async function DELETE(request: NextRequest) {
    const body: AddCustomer_Link | null = await request.json().catch(() => null);

    if (!body || !body.CustomerId || !body.RelatedId || !body.RelatedType) {
        return new Response(JSON.stringify({ error: "Thiếu thông tin trong request body" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
  return db_Provider<any>('CALL DeleteCustomerLink(?,?,?)',  [body.CustomerId, body.RelatedId, body.RelatedType], true);
}
