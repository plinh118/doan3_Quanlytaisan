import { NextResponse } from 'next/server';
import { executeQuery } from '@/libs/db';

export async function GET() {
  try {
    // Lấy thống kê cho Project
    const projects = await executeQuery<any[]>(`
      SELECT 
        COUNT(*) AS total_projects,
        SUM(CASE WHEN ProjectStatus = 'Đã hoàn thành' THEN 1 ELSE 0 END) AS completed_projects,
        SUM(CASE WHEN ProjectStatus = 'Đang thực hiện' THEN 1 ELSE 0 END) AS active_projects,
        SUM(CASE WHEN ProjectStatus = 'Hủy' THEN 1 ELSE 0 END) AS canceled_projects
      FROM Project 
      WHERE IsDeleted = 0
    `);
    // Lấy thống kê cho Product
    const products = await executeQuery<any[]>(`
      SELECT 
        COUNT(*) AS total_products,
        SUM(CASE WHEN ProductStatus = 'Đã hoàn thành' THEN 1 ELSE 0 END) AS completed_products,
        SUM(CASE WHEN ProductStatus = 'Đang thực hiện' THEN 1 ELSE 0 END) AS available_products,
        SUM(CASE WHEN ProductStatus = 'Hủy' THEN 1 ELSE 0 END) AS canceled_products
      FROM Product 
      WHERE IsDeleted = 0
    `);

    // Lấy thống kê cho Topic
    const topics = await executeQuery<any[]>(`
      SELECT 
        COUNT(*) AS total_topics,
        SUM(CASE WHEN TopicStatus = 'Đã hoàn thành' THEN 1 ELSE 0 END) AS completed_topics,
        SUM(CASE WHEN TopicStatus = 'Đang thực hiện' THEN 1 ELSE 0 END) AS active_topics,
        SUM(CASE WHEN TopicStatus = 'Hủy' THEN 1 ELSE 0 END) AS canceled_topics
      FROM Topic 
      WHERE IsDeleted = 0
    `);

    // Tạo response theo interface IStatistics
    const statistics = {
      total_projects: projects[0].total_projects || 0,
      active_projects: projects[0].active_projects || 0,
      completed_projects: projects[0].completed_projects || 0,
      cancel_projects: projects[0].canceled_projects || 0,
      total_products: products[0].total_products || 0,
      available_products: products[0].available_products || 0,
      completed_products: products[0].completed_products || 0,
      cancel_products: products[0].canceled_products || 0,
      total_topics: topics[0].total_topics || 0,
      active_topics: topics[0].active_topics || 0,
      completed_topics: topics[0].completed_topics || 0,
      cancel_topics: topics[0].canceled_topics || 0,

      // Giả định các trường khác (bạn có thể thêm nếu cần)
      total_personnel: 0,
      active_personnel: 0,
      inactive_personnel: 0,
      total_partners: 0,
      active_partners: 0,
      inactive_partners: 0,
      total_customers: 0,
      total_courses: 0,
      active_courses: 0,
      completed_courses: 0,
      total_ip: 0,
      granted_ip: 0,
      pending_ip: 0,
    };
    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    return NextResponse.json(
      { error: 'Không thể lấy dữ liệu thống kê' },
      { status: 500 },
    );
  }
}
