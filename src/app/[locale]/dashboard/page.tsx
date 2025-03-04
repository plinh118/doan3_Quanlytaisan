"use client"
import { useEffect, useState } from "react"
import type React from "react"

import { Button, Spin } from "antd"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from "recharts"
import { doashBoardAPI } from "@/libs/api/dashBoard.api"
import Link from "next/link"
import ThemeChanger from "@/modules/shared/changetheme"
import { Home } from "lucide-react"
import "./dashboard.scss"

const Dashboard = () => {
  const [statistics, setStatistics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await doashBoardAPI.getAlldoashBoard()
        setStatistics(data)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="Đang tải dữ liệu..." />
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

  // Vibrant color palette for charts using RGB
  const pieColors = ["rgb(76, 175, 80)", "rgb(33, 150, 243)", "rgb(255, 87, 34)"]

  // Vibrant color palette for bar chart using RGB
  const barColors = {
    personnel_count: "rgb(142, 68, 173)",
    partner_count: "rgb(52, 152, 219)",
    customer_count: "rgb(243, 156, 18)",
    training_course_count: "rgb(231, 76, 60)",
    service_count: "rgb(26, 188, 156)",
    intellectual_property_count: "rgb(216, 27, 96)",
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-navigation">
          <Link href="/vi/dashboard" className="home-link">
            <Button type="primary" icon={<Home className="home-icon" />} className="home-button" />
          </Link>
          <div className="header-title">/ Dashboard</div>
        </div>
        <ThemeChanger />
      </div>

      {/* Stats Summary */}
      <div className="stats-grid">
        <StatCard title="Tổng dự án" value={statistics.total_projects} icon="📊" colorClass="purple-gradient" />
        <StatCard title="Tổng sản phẩm" value={statistics.total_products} icon="📦" colorClass="blue-gradient" />
        <StatCard title="Tổng đề tài" value={statistics.total_topics} icon="📝" colorClass="green-gradient" />
      </div>

      {/* Pie Charts */}
      <div className="charts-grid">
        <DashboardCard title="Dự án" data={projectData} total={statistics.total_projects} colors={pieColors} link="/vi/project" />
        <DashboardCard title="Sản phẩm" data={productData} total={statistics.total_products} colors={pieColors} link="/vi/product"/>
        <DashboardCard title="Đề tài" data={topicData} total={statistics.total_topics} colors={pieColors} link="/vi/topic"/>
      </div>

      {/* Bar Chart */}
      <div className="bar-chart-container">
        <h2 className="chart-title">Thống kê theo tháng</h2>
        <div className="bar-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statistics.monthly_stats} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
              <XAxis
                dataKey="month"
                tick={{ fill: "rgb(113, 128, 150)", fontSize: 12 }}
                axisLine={{ stroke: "rgb(203, 213, 224)" }}
              />
              <YAxis tick={{ fill: "rgb(113, 128, 150)", fontSize: 12 }} axisLine={{ stroke: "rgb(203, 213, 224)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  border: "none",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: 20 }} iconType="circle" />
              <Bar
                dataKey="personnel_count"
                name="Nhân sự"
                fill={barColors.personnel_count}
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
              <Bar
                dataKey="partner_count"
                name="Đối tác"
                fill={barColors.partner_count}
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
              <Bar
                dataKey="customer_count"
                name="Khách hàng"
                fill={barColors.customer_count}
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
              <Bar
                dataKey="training_course_count"
                name="Khóa học"
                fill={barColors.training_course_count}
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
              <Bar
                dataKey="service_count"
                name="Dịch vụ"
                fill={barColors.service_count}
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
              <Bar
                dataKey="intellectual_property_count"
                name="Sở hữu trí tuệ"
                fill={barColors.intellectual_property_count}
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: string
  colorClass: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass }) => {
  return (
    <div className={`stat-card ${colorClass}`}>
      <div className="stat-content">
        <div>
          <p className="stat-title">{title}</p>
          <h3 className="stat-value">{value}</h3>
        </div>
        <div className="stat-icon">{icon}</div>
      </div>
    </div>
  )
}

interface DashboardCardProps {
  title: string
  data: { name: string; value: number }[]
  total: number
  colors: string[]
  link:string
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, data, total, colors,link }) => {
  return (
    <Link href={link} className="home-link">
    <div className="dashboard-card">
      <h2 className="card-title">{title}</h2>
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
                      style={{ fontWeight: "bold", fontSize: 14, textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
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
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  border: "none",
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
                {item.name} ({item.value})
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

