'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Form, Input, Button, Card, Alert, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { authAPI } from '@/libs/api/auth.api';
import { useNotification } from '@/components/UI_shared/Notification';
import { RULES_FORM } from '@/utils/validator';

const { Title, Text } = Typography;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { show } = useNotification();

  useEffect(()=>{
    document.title="Đăng ký";
  },[])
  const onFinish = async (values: {
    email: string;
    password: string;
    fullName: string;
    comfilmPassword: string;
  }) => {
    setError('');
    setLoading(true);

    try {
      if (values.password !== values.comfilmPassword) {
        show({
          result: 1,
          messageError: 'Mật khẩu nhập lại không trùng khớp!',
        });
        return;
      }
      const userId = await authAPI.register(
        values.email,
        values.password,
        values.fullName,
      );
      if (userId) {
        show({ result: 0, messageDone: 'Đăng ký thành công!' });
        router.push('/vi');
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Đăng ký thất bại!';
      if (errorMessage.includes('Email đã được sử dụng')) {
        show({
          result: 1,
          messageError: 'Email đã được sử dụng. Vui lòng chọn email khác!',
        });
      } else {
        show({
          result: 1,
          messageError: 'Đăng ký thất bại! Vui lòng thử lại sau.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f2f5',
        padding: '12px',
      }}
    >
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '16px' }}>
          Đăng ký tài khoản
        </Title>
        <Text
          type="secondary"
          style={{
            display: 'block',
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          Đã có tài khoản?{' '}
          <Link href="/vi" style={{ fontWeight: 500 }}>
            Đăng nhập
          </Link>
        </Text>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: '24px' }}
          />
        )}

        <Form name="register" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Họ tên" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={RULES_FORM.email}
          >
            <Input prefix={<MailOutlined />} placeholder="Địa chỉ email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={RULES_FORM.password}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item
            name="comfilmPassword"
            rules={RULES_FORM.password}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập lại mật khẩu"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%' }}
              loading={loading}
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
