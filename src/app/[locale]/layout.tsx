'use client';
import '@ant-design/v5-patch-for-react-19';
import '@/assets/scss/_global.scss';
import AppProvider from './AppProvider';
import { Layout, ConfigProvider } from 'antd';
import SiderBar from '@/modules/shared/siderbar/siderbar';
import { App as AntApp } from 'antd';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const { Sider, Content } = Layout;

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/vi';
  const isRegisterPage = pathname === '/vi/register';

  const [collapsed, setCollapsed] = useState(false);

  const siderStyle: React.CSSProperties = {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    overflowY: 'auto',
    transition: 'all 0.3s',
    backgroundColor: 'transparent',
    borderRight: '1px solid rgba(0,0,0,0.06)',
    WebkitOverflowScrolling: 'touch',
    msOverflowStyle: 'none',
  };

  const scrollbarStyle = `
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-track {
      background-color: transparent;
    }
  `;

  const isAuthPage = isLoginPage || isRegisterPage;

  return (
    <html lang="en">
      <head>
        <style>{scrollbarStyle}</style>
      </head>
      <body style={{ margin: 0 }}>
        <ConfigProvider>
          <AntApp>
            <AppProvider>
              <Layout style={{ minHeight: '100vh' }}>
                {!isAuthPage && (
                  <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={setCollapsed}
                    width={245}
                    collapsedWidth={80}
                    style={siderStyle}
                  >
                    <SiderBar
                      collapsed={collapsed}
                      setCollapsed={setCollapsed}
                    />
                  </Sider>
                )}
                <Layout
                  style={{
                    marginLeft: isAuthPage ? 0 : collapsed ? 80 : 245,
                    transition: 'all 0.3s',
                  }}
                >
                  <Content
                    style={{
                      padding: isAuthPage ? 0 : 24,
                      minHeight: '100vh',
                      boxSizing: 'border-box',
                    }}
                  >
                    {children}
                  </Content>
                </Layout>
              </Layout>
            </AppProvider>
          </AntApp>
        </ConfigProvider>
      </body>
    </html>
  );
}
