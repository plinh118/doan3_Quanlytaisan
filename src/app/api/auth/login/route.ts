import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { executeQuery } from '@/libs/db';
const JWT_SECRET = process.env.JWT_SECRET || 'pham-thanh-long-2003004';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    console.log(email, password);
    // Kiểm tra dữ liệu đầu vào
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Thiếu email hoặc mật khẩu' },
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
        { error: 'Email không tồn tại' },
        { status: 401 },
      );
    }
    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.Password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Mật khẩu không đúng' },
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
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Không thể đăng nhập' }, { status: 500 });
  }
}
