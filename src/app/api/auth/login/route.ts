import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { executeQuery } from '@/libs/db';

const JWT_SECRET = process.env.JWT_SECRET || 'pham-thanh-long-2003004';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    // Kiểm tra dữ liệu đầu vào
    if (!email || !password) {
      return NextResponse.json(
        { errorCode: 5 }, // Thiếu email hoặc mật khẩu
        { status: 400 },
      );
    }

    // Tìm user trong DB
    const users = await executeQuery<any[]>(
      'SELECT * FROM users WHERE email = ?',
      [email],
    );

    const user = users[0];
    if (!user) {
      return NextResponse.json(
        { errorCode: 6 }, // Email không tồn tại
        { status: 401 },
      );
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.Password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { errorCode: 7 }, // Mật khẩu không đúng
        { status: 401 },
      );
    }

    // Tạo JWT
    const token = jwt.sign(
      { id: user.Id, email: user.Email, role: user.Role },
      JWT_SECRET,
      { expiresIn: '1h' },
    );

    return NextResponse.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.Id,
        email: user.Email,
        role: user.Role,
        fullName: user.FullName,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { errorCode: 8 }, // Lỗi server
      { status: 500 },
    );
  }
}
