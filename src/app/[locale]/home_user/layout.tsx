import { ReactNode } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { HeaderUser } from '@/components/home_user/header_home';
import AppFooter from '@/components/home_user/footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
    <HeaderUser/>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        {children}
      </main>

      {/* Footer */}
      <AppFooter/>
    </>
  );
};

export default Layout;