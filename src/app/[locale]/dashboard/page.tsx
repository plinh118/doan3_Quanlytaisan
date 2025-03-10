"use client"
import { useEffect, useState } from "react"
import type React from "react"

import { Button, Spin, Select } from "antd"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { doashBoardAPI } from "@/libs/api/dashBoard.api"
import Link from "next/link"
import ThemeChanger from "@/modules/shared/changetheme"
import { Home, BarChart3, Users, Building2, Briefcase, Layers } from "lucide-react"
import "./dashboard.scss"

const Dashboard = () => {
  const [statistics, setStatistics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())

  useEffect(() => {
    fetchData()
  }, [selectedYear])

  const fetchData = async () => {
    try {
      setLoading(true)
      const data = await doashBoardAPI.getAlldoashBoard(selectedYear);
      setStatistics(data)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large">
          <div className="loading-content">
            <p>Đang tải dữ liệu...</p>
          </div>
        </Spin>
      </div>
    )
  }

  if (!statistics) {
    return (
      <div className="error-container">
        <p>Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
      </div>
    )
  }

  const projectData = [
    { name: "Đang thực hiện", value: Number(statistics.active_projects) },
    { name: "Đã Hoàn thành", value: Number(statistics.completed_projects) },
    { name: "Đã Hủy", value: Number(statistics.cancel_projects) },
  ]

  const productData = [
    { name: "Đang thực hiện", value: Number(statistics.available_products) },
    { name: "Đã Hoàn thành", value: Number(statistics.completed_products) },
    { name: "Đã Hủy", value: Number(statistics.cancel_products) },
  ]

  const topicData = [
    { name: "Đang thực hiện", value: Number(statistics.active_topics) },
    { name: "Đã Hoàn thành", value: Number(statistics.completed_topics) },
    { name: "Đã Hủy", value: Number(statistics.cancel_topics) },
  ]

  const trainingCouseData = [
    { name: "Đang thực hiện", value: Number(statistics.active_trainingCouse) },
    {
      name: "Đã Hoàn thành",
      value: Number(statistics.completed_trainingCouse),
    },
    { name: "Đã Hủy", value: Number(statistics.cancel_trainingCouse) },
  ]

  // Vibrant color palette for charts
  const pieColors = [
    "#00C49F", // Vibrant teal for "Đang thực hiện"
    "#0088FE", // Bright blue for "Đã Hoàn thành"
    "#FF5252", // Vibrant red for "Đã Hủy"
  ]

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-navigation">
          <Link href="/vi/dashboard" className="home-link">
            <Button type="primary" icon={<Home className="home-icon" />} className="home-button" />
          </Link>
          <div className="header-title">Dashboard</div>
        </div>
        <div className="header-controls">
          <div className="year-selector">
            <label htmlFor="year-select" style={{color:'black'}}>Chọn năm: </label>
            <Select
              id="year-select"
              value={selectedYear}
              onChange={(value) => setSelectedYear(value)}
              style={{ width: 120 }}
              options={[
                { value: 2020, label: "2020" },
                { value: 2021, label: "2021" },
                { value: 2022, label: "2022" },
                { value: 2023, label: "2023" },
                { value: 2024, label: "2024" },
                { value: 2025, label: "2025" },
              ]}
            />
          </div>
          <ThemeChanger />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats-grid">
        <StatCard
        link="/vi/personnel"
          title="Nhân sự"
          value={statistics.total_Personnel}
          icon={<Users />}
          colorClass="personnel-gradient"
          legend={[
            { name: "Nam", value: Number(statistics.male_Personnel), color: "#00C49F" },
            { name: "Nữ", value: Number(statistics.female_Personnel), color: "#FF5252" },
            { name: "Khác", value: Number(statistics.other_Personnel), color: "#FFBB28" },
          ]}
        />

        <StatCard
          link="/vi/customer"
          title="Khách hàng"
          value={statistics.total_Customer}
          icon={<Building2 />}
          colorClass="customer-gradient"
          legend={[
            { name: "Dừng hợp tác", value: Number(statistics.active_Customer), color: "#00C49F" },
            { name: "Đang hợp tác", value: Number(statistics.completed_Customer), color: "#0088FE" },
            { name: "Hủy hợp tác", value: Number(statistics.cancel_Customer), color: "#FF5252" },
          ]}
        />

        <StatCard
          link="/vi/partner"
          title="Đối tác"
          value={statistics.total_Partner}
          icon={<Briefcase />}
          colorClass="partner-gradient"
          legend={[
            { name: "Dừng hợp tác", value: Number(statistics.active_Partner), color: "#00C49F" },
            { name: "Đang hợp tác", value: Number(statistics.completed_Partner), color: "#0088FE" },
            { name: "Hủy hợp tác", value: Number(statistics.cancel_Partner), color: "#FF5252" },
          ]}
        />
        <StatCard
          link="/vi/services"
          title="Dịch vụ"
          value={statistics.total_Service}
          icon={<Layers />}
          colorClass="service-gradient"
          legend={[
            { name: "Đang phát triển", value: Number(statistics.active_Service), color: "#00C49F" },
            { name: "Đang cung cấp", value: Number(statistics.completed_Service), color: "#0088FE" },
            { name: "Hủy dịch vụ", value: Number(statistics.cancel_Service), color: "#FF5252" },
          ]}
        />
      </div>

      {/* Pie Charts */}
      <div className="charts-grid">
        <DashboardCard
          title="Sản phẩm"
          data={productData}
          total={statistics.total_products}
          colors={pieColors}
          link="/vi/product"
          icon={<BarChart3 />}
        />
        <DashboardCard
          title="Dự án"
          data={projectData}
          total={statistics.total_projects}
          colors={pieColors}
          link="/vi/project"
          icon={<BarChart3 />}
        />

        <DashboardCard
          title="Đề tài"
          data={topicData}
          total={statistics.total_topics}
          colors={pieColors}
          link="/vi/topic"
          icon={<BarChart3 />}
        />
        <DashboardCard
          title="Khóa học"
          data={trainingCouseData}
          total={statistics.total_trainingCouse}
          colors={pieColors}
          link="/vi/trainingCouse"
          icon={<BarChart3 />}
        />
      </div>
    </div>
  )
}

interface LegendItem {
  name: string
  value: number
  color: string
}

interface StatCardProps {
  link:string,
  title: string
  value: string | number
  icon: React.ReactNode
  colorClass?: string
  legend?: LegendItem[]
}

const StatCard: React.FC<StatCardProps> = ({ link,title, value, icon, colorClass = "", legend = [] }) => {
  return (
    <Link href={link}>
    <div className={`stat-card ${colorClass}`}>
      <div className="stat-header">
        <div style={{display:'flex'}}>
            <div className="stat-icon">{icon}</div>
            <p className="stat-title">{title}</p>
        </div>
        
        <div className="stat-info">
          <h3 className="stat-value">{value}</h3>
        </div>
      </div>
      <div className="stat-legend">
        {legend.map((item, index) => (
          <div key={index} className="legend-item">
            <div className="legend-color" style={{ backgroundColor: item.color }} />
            <span className="legend-label">
              {item.name} <span className="legend-value">({item.value})</span>
            </span>
          </div>
        ))}
      </div>
    </div>
    </Link>
  )
}

interface DashboardCardProps {
  title: string
  data: { name: string; value: number }[]
  total: number
  colors: string[]
  link: string
  icon: React.ReactNode
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, data, total, colors, link, icon }) => {
  return (
    <Link href={link} className="dashboard-card-link">
      <div className="dashboard-card">
        <div className="card-header">
          <h2 className="card-title">{title}</h2>
          <div className="card-icon">{icon}</div>
        </div>
        <div className="card-content">
          <div className="pie-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
                    if (data[index].value === 0) return null
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180))
                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180))
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#fff"
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{
                          fontWeight: "bold",
                          fontSize: 14,
                          textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                        }}
                      >
                        {data[index].value}
                      </text>
                    )
                  }}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="total-text">
                  {total}
                </text>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    border: "none",
                    padding: "8px 12px",
                  }}
                  itemStyle={{
                    padding: "4px 0",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="legend-container">
            {data.map((item, index) => (
              <div key={index} className={`legend-item ${item.name === "Đang thực hiện" ? "active" : ""}`}>
                <div className="legend-color" style={{ backgroundColor: colors[index % colors.length] }} />
                <span className="legend-label">
                  {item.name} <span className="legend-value">({item.value})</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Dashboard

