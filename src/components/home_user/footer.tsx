'use client';
import React from 'react';
import { Layout, Typography, Row, Col, Divider } from 'antd';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, YoutubeOutlined } from '@ant-design/icons';
import './styles.scss';

const { Footer } = Layout;
const { Text, Title } = Typography;

const AppFooter = () => {
  return (
    <Footer className="app-footer">
      <div className="footer-content">
        <Row gutter={[32, 32]}>
          {/* Cột 1: Giới thiệu */}
          <Col xs={24} sm={12} md={6}>
            <div className="footer-column">
              <Title level={4} className="footer-title">Về chúng tôi</Title>
              <Text className="footer-text">
                Công ty công nghệ hàng đầu cung cấp các giải pháp phần mềm chất lượng cao.
              </Text>
              <div className="social-icons">
                <a href="#"><FacebookOutlined /></a>
                <a href="#"><TwitterOutlined /></a>
                <a href="#"><InstagramOutlined /></a>
                <a href="#"><YoutubeOutlined /></a>
              </div>
            </div>
          </Col>

          {/* Cột 2: Liên kết nhanh */}
          <Col xs={24} sm={12} md={6}>
            <div className="footer-column">
              <Title level={4} className="footer-title">Liên kết nhanh</Title>
              <ul className="footer-links">
                <li><a href="#">Trang chủ</a></li>
                <li><a href="#">Sản phẩm</a></li>
                <li><a href="#">Dịch vụ</a></li>
                <li><a href="#">Giới thiệu</a></li>
                <li><a href="#">Liên hệ</a></li>
              </ul>
            </div>
          </Col>

          {/* Cột 3: Dịch vụ */}
          <Col xs={24} sm={12} md={6}>
            <div className="footer-column">
              <Title level={4} className="footer-title">Dịch vụ</Title>
              <ul className="footer-links">
                <li><a href="#">Phát triển web</a></li>
                <li><a href="#">Phát triển ứng dụng</a></li>
                <li><a href="#">Thiết kế UI/UX</a></li>
                <li><a href="#">Tư vấn công nghệ</a></li>
                <li><a href="#">Bảo trì hệ thống</a></li>
              </ul>
            </div>
          </Col>

          {/* Cột 4: Liên hệ */}
          <Col xs={24} sm={12} md={6}>
            <div className="footer-column">
              <Title level={4} className="footer-title">Liên hệ</Title>
              <ul className="footer-contact">
                <li>123 Đường ABC, Quận 1, TP.HCM</li>
                <li>Email: contact@example.com</li>
                <li>Điện thoại: +84 123 456 789</li>
                <li>Hotline: 1900 1234</li>
              </ul>
            </div>
          </Col>
        </Row>

        <Divider className="footer-divider" />

        <div className="footer-bottom">
          <Text className="copyright">
            © {new Date().getFullYear()} Công ty ABC. Bảo lưu mọi quyền.
          </Text>
          <div className="footer-links-bottom">
            <a href="#">Điều khoản sử dụng</a>
            <a href="#">Chính sách bảo mật</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;