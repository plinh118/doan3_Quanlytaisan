'use client';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { ConfigProvider, Menu } from 'antd';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useColorState } from '@/stores/color.store';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined, 
  UserOutlined,
  FileOutlined, 
  SettingOutlined,
  TeamOutlined,
  UserSwitchOutlined, 
  AppstoreOutlined, 
  ShoppingOutlined, 
  ProjectOutlined, 
  BookOutlined,
  ReadOutlined, 
  CustomerServiceOutlined,
  SafetyOutlined, 
  ApartmentOutlined, 
  IdcardOutlined,
  PullRequestOutlined,
  HolderOutlined,
  AudioOutlined, 
} from '@ant-design/icons';
import styles from '@/modules/shared/siderbar/siderbar.module.scss';

type MenuItem = Required<MenuProps>['items'][number];
interface SiderBarProps {
  collapsed: boolean;
}

const routeMap: Record<string, string> = {
  sub5: '/vi/dashboard',
  '12': '/vi/position',
  '10': '/vi/division',
  '1': '/vi/personnel',
  '6': '/vi/project',
  '7': '/vi/topic',
  '8': '/vi/trainingCouse',
  '2': '/vi/partner',
  '3': '/vi/customer',
  '5': '/vi/product',
  '9': '/vi/intellectualProperty',
  '11': '/vi/department',
  '13': '/vi/services',
  '20': '/vi/user',
  '30': '/vi/asset',
  '31':'/vi/request_asset',
  '32':'/vi/manageConsultPage',
};

const SiderBar: React.FC<SiderBarProps> = ({ collapsed }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { themeColor } = useColorState();
  const [isuser, setIsuser] = useState(false);

  // useEffect để kiểm tra role sau khi component đã mount
  useEffect(() => {
    const userRole = localStorage.getItem('ROLE');
    setIsuser(userRole === 'user');
  }, []);

  const getCurrentKey = useCallback(() => {
    const entry = Object.entries(routeMap).find(
      ([, path]) => path === pathname,
    );
    return entry ? entry[0] : '1';
  }, [pathname]);

  const onClick: MenuProps['onClick'] = (e) => {
    const path = routeMap[e.key];
    if (path && path !== pathname) {
      router.push(path);
    }
  };

  const sidebarItems = useMemo<MenuItem[]>(
    () => {
      const baseItems: MenuItem[] = [
        { key: 'sub5', label: 'Dashboard', icon: <DashboardOutlined /> },
        {
          key: 'sub1',
          label: 'Quản lý đối tượng',
          icon: <UserOutlined />,
          children: [
            // Ẩn "Quản lý nhân viên" nếu là user
            ...(isuser ? [] : [{ key: '1', label: 'Quản lý nhân viên', icon: <TeamOutlined /> }]),
            {
              key: '2',
              label: 'Quản lý đối tác',
              icon: <UserSwitchOutlined />,
            },
            { key: '3', label: 'Quản lý khách hàng', icon: <UserOutlined /> },
            ...(isuser ? [] : [ { key: '20', label: 'Quản lý người dùng', icon: <TeamOutlined /> }]),
            { key: '30', label: 'Quản lý tài sản', icon: <AppstoreOutlined /> },
            // Ẩn "Duyệt yêu cầu mua tài sản" nếu là user
            ...(isuser ? [] : [{ key: '31', label: 'Duyệt yêu cầu mua tài sản', icon: <PullRequestOutlined /> }]),
          ]
        },
        {
          key: 'sub2',
          label: 'Quản lý phi vật thể',
          icon: <FileOutlined />,
          children: [
            { key: '5', label: 'Quản lý sản phẩm', icon: <ShoppingOutlined /> },
            { key: '6', label: 'Quản lý dự án', icon: <ProjectOutlined /> },
            { key: '7', label: 'Quản lý đề tài', icon: <BookOutlined /> },
            { key: '8', label: 'Quản lý khóa đào tạo', icon: <ReadOutlined /> },
            {
              key: '13',
              label: 'Quản lý dịch vụ',
              icon: <CustomerServiceOutlined />,
            },
            { key: '9', label: 'Sở hữu trí tuệ', icon: <SafetyOutlined /> },
            { key: '32', label: 'Liên hệ tư vấn', icon: <AudioOutlined /> },
          ],
        },
        // Ẩn toàn bộ mục "Danh Mục" nếu là user
        ...(isuser ? [] : [{
          key: 'sub4',
          label: 'Danh Mục',
          icon: <SettingOutlined />,
          children: [
            { key: '11', label: 'Đơn vị/ công ty con', icon: <TeamOutlined /> },
            { key: '10', label: 'Quản lý bộ phận', icon: <ApartmentOutlined /> },
            { key: '12', label: 'Quản lý chức vụ', icon: <IdcardOutlined /> },
          ],
        }]),
      ];

      return baseItems;
    },
    [isuser],
  );

  const sidebarBg = themeColor?.token?.colorPrimary || 'rgb(13,68,138)';
  const textColor = themeColor?.token?.colorPrimary ? '#ffffff' : '#000000';

  return (
    <div
      className={styles.menuContainer}
      style={{
        backgroundColor: sidebarBg,
        color: textColor,
      }}
    >
      <div
        className={styles.headerLogo}
        style={{
          backgroundColor: sidebarBg,
          color: textColor,
        }}
      >
        <Image
          src={collapsed ? '/image/logotrangnho.png' : '/image/logotrang.png'}
          alt="Logo"
          width={collapsed ? 50 : 150}
          height={60}
          priority 
          style={{
            objectFit: 'contain',
            height: 60,
            marginLeft: collapsed ? '-50%' : '20%',
          }}
        />
      </div>

      <ConfigProvider
        theme={{ token: { colorBgContainer: sidebarBg, colorText: textColor } }}
      >
        <Menu
          onClick={onClick}
          defaultOpenKeys={collapsed ? [] : ['sub1', 'sub2', 'sub4']}
          selectedKeys={[getCurrentKey()]}
          mode="inline"
          items={sidebarItems}
          inlineCollapsed={collapsed}
          className={styles.menu}
          style={{
            backgroundColor: sidebarBg,
            color: textColor,
          }}
        />
      </ConfigProvider>
    </div>
  );
};

export default SiderBar;