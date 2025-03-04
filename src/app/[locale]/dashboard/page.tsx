'use client';

import type React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { Card, Row, Col, Typography, Spin, Alert, Button } from 'antd';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { doashBoardAPI } from '@/libs/api/dashBoard.api';
import Link from 'next/link';
import ThemeChanger from '@/modules/shared/changetheme';

const { Title, Text } = Typography;

// Định nghĩa kiểu dữ liệu
interface IStatistics {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  cancel_projects: number;
  total_products: number;
  available_products: number;
  completed_products: number;
  cancel_products: number;
  total_topics: number;
  active_topics: number;
  completed_topics: number;
  cancel_topics: number;
}

interface ChartData {
  name: string;
  value: number;
}

const Dashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<IStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chuẩn hóa dữ liệu với useMemo, luôn được gọi
  const projectData = useMemo(() => [
    { name: 'Đang thực hiện', value: statistics?.active_projects ?? 0 },
    { name: 'Đã Hoàn thành', value: statistics?.completed_projects ?? 0 },
    { name: 'Đã Hủy', value: statistics?.cancel_projects ?? 0 },
  ], [statistics]);

  const productData = useMemo(() => [
    { name: 'Đang thực hiện', value: statistics?.available_products ?? 0 },
    { name: 'Đã Hoàn thành', value: statistics?.completed_products ?? 0 },
    { name: 'Đã Hủy', value: statistics?.cancel_products ?? 0 },
  ], [statistics]);

  const topicData = useMemo(() => [
    { name: 'Đang thực hiện', value: statistics?.active_topics ?? 0 },
    { name: 'Đã Hoàn thành', value: statistics?.completed_topics ?? 0 },
    { name: 'Đã Hủy', value: statistics?.cancel_topics ?? 0 },
  ], [statistics]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await doashBoardAPI.getAlldoashBoard();
        setStatistics(data[0] as IStatistics); // Lấy phần tử đầu tiên nếu API trả về mảng
      } catch (err) {
        setError('Không thể tải dữ liệu thống kê, vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: 20,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Alert message={error} type="error" showIcon closable />
      </div>
    );
  }

  if (!statistics) {
    return (
      <div
        style={{
          padding: 20,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Text>Không có dữ liệu để hiển thị</Text>
      </div>
    );
  }

  const colors = ['#129, 207, 224', '#169, 223, 191', '#245, 183, 177'];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/vi/dashboard" className="hover:text-purple-600">
            <Button type="default" icon={<HomeIcon />} />
          </Link>
          <Title level={2} style={{ marginLeft: 16 }}>Bảng Thống Kê</Title>
        </div>
        <ThemeChanger />
      </div>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={8} lg={8}>
          <DashboardCard title="Dự Án" data={projectData} total={statistics.total_projects || 0} colors={colors} />
        </Col>
        <Col xs={24} sm={24} md={8} lg={8}>
          <DashboardCard title="Sản Phẩm" data={productData} total={statistics.total_products || 0} colors={colors} />
        </Col>
        <Col xs={24} sm={24} md={8} lg={8}>
          <DashboardCard title="Đề Tài" data={topicData} total={statistics.total_topics || 0} colors={colors} />
        </Col>
      </Row>
    </div>
  );
};

const HomeIcon = () => (
  <span role="img" aria-label="home" className="anticon anticon-home">
    <svg
      viewBox="64 64 896 896"
      focusable="false"
      data-icon="home"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 00-44.4 0L77.5 505a63.9 63.9 0 00-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0018.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z" />
    </svg>
  </span>
);

interface DashboardCardProps {
  title: string;
  data: ChartData[];
  total: number;
  colors: string[];
}

interface ChartData {
  name: string;
  value: number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, data, total, colors }) => {
  // Tính toán outerRadius cố định trong data
  const dataWithRadius = data.map(entry => ({
    ...entry,
    outerRadius: entry.name === 'Đang thực hiện' ? 120 : 110, // Gán outerRadius tĩnh
  }));

  return (
    <Card
      title={title}
      bordered={false}
      style={{
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        height: '100%',
        background: '#fff',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Biểu đồ Pie Chart */}
        <div style={{ width: '60%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataWithRadius}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120} // Sử dụng outerRadius lớn nhất cho tất cả, điều chỉnh trong label
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                animationBegin={300}
                animationDuration={1000}
                labelLine={false}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, index, value }) => {
                  if (value === 0) return null;

                  const isActive = data[index].name === 'Đang thực hiện';
                  const effectiveOuterRadius = isActive ? 120 : 110;
                  const radius = innerRadius + (effectiveOuterRadius - innerRadius) * 0.7;
                  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="#fff"
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                      style={{ fontWeight: 'bold', fontSize: 12 }}
                    >
                      {value}
                    </text>
                  );
                }}
              >
                {dataWithRadius.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                    stroke={entry.name === 'Đang thực hiện' ? 'black' : undefined}
                    strokeWidth={entry.name === 'Đang thực hiện' ? 2 : 1}
                  />
                ))}
              </Pie>
              <Label
                value={total}
                position="center"
                style={{ fontSize: 24, fontWeight: 'bold', fill: '#333', textAnchor: 'middle', dominantBaseline: 'middle' }}
              />
              <Tooltip
                content={({ payload }) => {
                  if (!payload || payload.length === 0) return null;
                  const { name, value } = payload[0];
                  const numericValue = typeof value === 'number' ? value : 0;
                  const total = data.reduce((sum, item) => sum + (typeof item.value === 'number' ? item.value : 0), 0);
                  const percentage = total > 0 ? ((numericValue / total) * 100).toFixed(1) : '0';
                  return (
                    <div style={{ background: '#fff', padding: 8, borderRadius: 4, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
                      <p>{name}</p>
                      <p>Giá trị: {numericValue}</p>
                      <p>Tỷ lệ: {percentage}%</p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Ghi chú màu sắc - cột dọc với nền và viền */}
        <div style={{ width: '40%', padding: 8, background: '#f9f9f9', borderRadius: 8, border: '1px solid #e8e8e8' }}>
          {data.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 12,
                padding: 4,
                fontWeight: item.name === 'Đang thực hiện' ? 'bold' : 'normal',
                color: item.name === 'Đang thực hiện' ? colors[0] : '#333',
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: colors[index % colors.length],
                  marginRight: 8,
                  borderRadius: 2,
                  border: item.name === 'Đang thực hiện' ? '2px solid #333' : 'none',
                }}
              />
              <Text style={{ fontSize: 14 }}>{item.name}</Text>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default Dashboard;