import { CallApi } from '@/libs/call_API';
import { API_URL } from '@/libs/call_API';
interface User {
  id: number;
  email: string;
  role: 'admin' | 'user';
}
type LoginResponse = number;

export const authAPI = {
  register: async (
    email: string,
    password: string,
    fullName: string,
  ): Promise<number> => {
    try {
      const data = await CallApi.create<number>('auth/register', {
        email,
        password,
        fullName,
      });
      return data;
    } catch (error) {
      throw new Error(
        `Đăng ký thất bại: ${error instanceof Error ? error.message : 'Không xác định'}`,
      );
    }
  },

  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      if (!email || !password) {
        return 5;
      }

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        return errorData.errorCode || response.status;
      }

      const data = await response.json();
      console.log(data);
      localStorage.setItem('ID', data.user.id);
      localStorage.setItem('ACCESS_TOKEN', data.token);
      localStorage.setItem('ROLE', data.user.role);
      localStorage.setItem('Email', data.user.email);

      localStorage.setItem('FullName', data.user.fullName);

      return 0;
    } catch (error) {
      return 8;
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const data = await CallApi.getAll<User>('auth/me');
      return data[0];
    } catch (error) {
      throw new Error(
        `Lấy thông tin user thất bại: ${error instanceof Error ? error.message : 'Không xác định'}`,
      );
    }
  },

  logout: () => {
    localStorage.clear();
  },
};
