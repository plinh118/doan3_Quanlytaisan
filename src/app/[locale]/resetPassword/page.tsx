'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, Alert, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { authAPI } from '@/libs/api/auth.api';
import { useNotification } from '@/components/UI_shared/Notification';
import { userAPI } from '@/libs/api/user.api';
import { UpUser } from '@/models/user.model';
import Header_Children from '@/components/UI_shared/Children_Head';

const { Title, Text } = Typography;

export default function ResetPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { show } = useNotification();
  const [account, setAccount] = useState<any>(null); // Sửa SetStateAction thành setAccount
  const [userAfter, setUserAfter] = useState<any>(null);

  useEffect(() => {
    document.title="Thông tin cá nhân";
    const email = localStorage.getItem('Email');
    const fullName = localStorage.getItem('FullName');
    const Id = localStorage.getItem('ID');
    const Role = localStorage.getItem('Role');
    setUserAfter({ email, fullName, Id, Role });
  }, []);

  const onFinish = async (values: {
    email: string;
    password: string;
    fullName: string;
    newPassword: string;
  }) => {
    setError('');
    setLoading(true);

    try {
      const dataAccount = await authAPI.login(values.email, values.password);
      setAccount(dataAccount);

      if (dataAccount != 0) {
        show({
          result: dataAccount,
        });
        return;
      }

      const newUser: UpUser = {
        Id: userAfter?.Id,
        FullName: values.fullName,
        Password: values.newPassword,
        Email: values.email,
        Role: userAfter?.Role,
      };

      const userId: any = await userAPI.updateuser(newUser);
      show({
        result: userId.result,
        messageDone: 'Cập nhật người dùng thành công',
        messageError: 'Cập nhật người dùng thất bại',
      });
    } catch (err: any) {
      const errorMessage = err?.message || 'Cập nhật thất bại!';
      if (errorMessage.includes('Email đã được sử dụng')) {
        show({
          result: 1,
          messageError: 'Email đã được sử dụng. Vui lòng chọn email khác!',
        });
      } else {
        show({
          result: 1,
          messageError: 'Cập nhật thất bại! Vui lòng thử lại sau.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      <Header_Children
        title="Thông tin tài khoản"
        onAdd={() => {}}
        text_btn_add={null}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <Card
          style={{
            width: '100%',
            maxWidth: '450px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            padding: '24px',
          }}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Title level={3} style={{ textAlign: 'center' }}>
              Thông tin tài khoản
            </Title>
            <Text style={{ textAlign: 'center' }}>Nhập thông tài khoản</Text>

            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                style={{ marginBottom: '16px', borderRadius: '8px' }}
              />
            )}

            <Form name="resetpassword" onFinish={onFinish} layout="vertical">
              <Form.Item
                name="fullName"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Họ tên"
                  size="large"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập địa chỉ email!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Địa chỉ email"
                  size="large"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Mật khẩu hiện tại"
                  size="large"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                name="newPassword"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Mật khẩu mới"
                  size="large"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  style={{
                    width: '100%',
                    borderRadius: '8px',

                    borderColor: '#1d39c4',
                  }}
                >
                  Cập nhật mật khẩu
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Card>
      </div>
    </div>
  );
}
