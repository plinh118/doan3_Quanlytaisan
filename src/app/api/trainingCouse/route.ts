import { type NextRequest, NextResponse } from 'next/server';
import { db_Provider } from '@/app/api/Api_Provider';
import {
  AddTrainingCourse,
  GetTrainingCourse,
  UpTrainingCourse,
} from '@/models/trainingCourse.api';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageIndex = Number(searchParams.get('pageIndex')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const orderType = (searchParams.get('orderType') as 'ASC' | 'DESC') || 'ASC';
  const TrainingCouseName = searchParams.get('trainingCouseName') || undefined;
  const InstructorId = searchParams.get('instructorId') || undefined;
  const ServiceStatus = searchParams.get('serviceStatus') || undefined;

  try {
    return db_Provider<GetTrainingCourse[]>(
      'CALL GetTrainingCoursesByPageOrder(?, ?, ?, ?,?,?)',
      [pageIndex, pageSize, orderType, TrainingCouseName || null, InstructorId || null ,ServiceStatus || null],
    );
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khóa học:', error);
    return NextResponse.json(
      { error: 'Không thể lấy danh sách khóa học.' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AddTrainingCourse = await request.json();
    const Description = body.Description ? body.Description.trim() : null;

    return db_Provider<any>(
      'CALL AddTrainingCourse(?,?,?,?,?)',
      [
        body.CourseName.trim(),
        body.ServiceStatus,
        Description,
        body.Duration,
        body.InstructorId,
      ],
      true,
    );
  } catch (error) {
    console.error('Lỗi khi thêm khóa học:', error);
    return NextResponse.json(
      { error: 'Không thể thêm khóa học.' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body: UpTrainingCourse = await request.json();
    if (!body.Id) {
      return NextResponse.json({ error: 'Thiếu ID khóa học' }, { status: 400 });
    }
    const Description = body.Description ? body.Description.trim() : null;

    return db_Provider<any>(
      'CALL UpdateTrainingCourse(?,?,?,?,?,?)',
      [
        body.Id,
        body.CourseName.trim(),
        body.ServiceStatus,
        Description,
        body.Duration,
        body.InstructorId,
      ],
      true,
    );
  } catch (error) {
    console.error('Lỗi khi cập nhật khóa học:', error);
    return NextResponse.json(
      { error: 'Không thể cập nhật khóa học.' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID khóa học' }, { status: 400 });
    }

    return db_Provider<any>('CALL DeleteTrainingCourse(?)', [id], true);
  } catch (error) {
    console.error('Lỗi khi xóa khóa học:', error);
    return NextResponse.json(
      { error: 'Không thể xóa khóa học.' },
      { status: 500 },
    );
  }
}
