'use client';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Button, Divider } from 'antd';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';
import { doashBoardAPI } from '@/libs/api/dashBoard.api';
import Link from 'next/link';
import ThemeChanger from '@/modules/shared/changetheme';

const Dashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await doashBoardAPI.getAlldoashBoard();
      setStatistics(data);
    };
    fetchData();
  }, []);

  if (!statistics) return <p>Loading...</p>;

  const projectData = [
    { name: 'Đang thực hiện', value: Number(statistics.active_projects) },
    { name: 'Đã Hoàn thành', value: Number(statistics.completed_projects) },
    { name: 'Đã Hủy', value: Number(statistics.cancel_projects) },
  ];

  const productData = [
    { name: 'Đang thực hiện', value: Number(statistics.available_products) },
    { name: 'Đã Hoàn thành', value: Number(statistics.completed_products) },
    { name: 'Đã Hủy', value: Number(statistics.cancel_products) },
  ];

  const topicData = [
    { name: 'Đang thực hiện', value: Number(statistics.active_topics) },
    { name: 'Đã Hoàn thành', value: Number(statistics.completed_topics) },
    { name: 'Đã Hủy', value: Number(statistics.cancel_topics) },
  ];

  // Màu sắc cho biểu đồ cột
  const colors = {
    personnel_count: '#8884d8',
    partner_count: '#82ca9d',
    customer_count: '#ffc658',
    training_course_count: '#ff7300',
    service_count: '#00c4b4',
    intellectual_property_count: '#d81b60',
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center" style={{ paddingBottom: '16px',display:'flex',justifyContent:'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', lineHeight: '49px' }}>
          <Link href="/vi/dashboard" className="hover:text-purple-600 flex items-center justify-center">
            <Button type="default" icon={<HomeIcon />} />
          </Link>
          <div>/ DashBoard</div>
        </div>
        <ThemeChanger />
      </div>

      <Divider />

      {/* Pie Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <DashboardCard title="Dự án" data={projectData} total={statistics.total_projects} />
        <DashboardCard title="Sản phẩm" data={productData} total={statistics.total_products} />
        <DashboardCard title="Đề tài" data={topicData} total={statistics.total_topics} />
      </div>

      <Divider />

      {/* Bar Chart */}
      <div style={{ marginTop: '20px' }}>
        <h2 className="text-lg font-medium mb-4">Thống kê theo tháng</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={statistics.monthly_stats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="personnel_count" name="Nhân sự" fill={colors.personnel_count} />
            <Bar dataKey="partner_count" name="Đối tác" fill={colors.partner_count} />
            <Bar dataKey="customer_count" name="Khách hàng" fill={colors.customer_count} />
            <Bar dataKey="training_course_count" name="Khóa học" fill={colors.training_course_count} />
            <Bar dataKey="service_count" name="Dịch vụ" fill={colors.service_count} />
            <Bar dataKey="intellectual_property_count" name="Sở hữu trí tuệ" fill={colors.intellectual_property_count} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

// Giữ nguyên HomeIcon và DashboardCard như code cũ của bạn
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
  data: { name: any; value: number }[];
  total: number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, data, total }) => {
  const colors = ['rgb(129, 207, 224)', 'rgb(169, 223, 191)', 'rgb(245, 183, 177)'];

  return (
    <div className="bg-white rounded-lg shadow border p-4" style={{ borderRadius: 12, border: '1px black solid' }}>
      <h2 className="text-lg font-medium mb-4" style={{ marginLeft: '5%' }}>{title}</h2>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '70%', height: 220, marginLeft: '-20px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                labelLine={false}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
                  if (data[index].value === 0) return null;
                  const isActive = data[index].name === 'Đang thực hiện';
                  const effectiveOuterRadius = isActive ? outerRadius + 15 : outerRadius;
                  const radius = innerRadius + (effectiveOuterRadius - innerRadius) / 2;
                  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                  return (
                    <text
                      x={x}
                      y={y}
                      fill="#fff"
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{ fontWeight: 'bold', fontSize: 14 }}
                    >
                      {data[index].value}
                    </text>
                  );
                }}
              >
                {data.map((entry, index) => {
                  const isActive = entry.name === 'Đang thực hiện';
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                      stroke={isActive ? 'black' : undefined}
                      strokeWidth={isActive ? 2 : 1}
                      {...(isActive ? { cornerRadius: 5 } : {})}
                    />
                  );
                })}
              </Pie>
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: '18px', fontWeight: 'bold', fill: '#333' }}
              >
                {total}
              </text>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ width: '30%' }}>
          {data.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 6,
                fontWeight: item.name === 'Đang thực hiện' ? 'bold' : 'normal',
                color: item.name === 'Đang thực hiện' ? 'rgb(33, 150, 57)' : 'inherit',
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  backgroundColor: colors[index % colors.length],
                  marginRight: 6,
                  borderRadius: 3,
                  border: item.name === 'Đang thực hiện' ? '2px solid black' : undefined,
                }}
              />
              <span style={{ fontSize: 14 }}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;