import { NextResponse } from 'next/server';
import { executeQuery } from '@/libs/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');

  if (!year) {
    return NextResponse.json({ error: 'Vui lòng chọn năm' }, { status: 400 });
  }

  try {
    // Thống kê Project theo năm
    const projects = await executeQuery<any[]>(`
      SELECT 
        COUNT(*) AS total_projects,
        SUM(CASE WHEN ProjectStatus = 'Đang sử dụng' THEN 1 ELSE 0 END) AS completed_projects,
        SUM(CASE WHEN ProjectStatus = 'Tạm dừng' THEN 1 ELSE 0 END) AS active_projects,
        SUM(CASE WHEN ProjectStatus = 'Hủy' THEN 1 ELSE 0 END) AS canceled_projects
      FROM Project 
      WHERE IsDeleted = 0 AND YEAR(created_at) = ?
    `, [year]);

    // Thống kê Product theo năm
    const products = await executeQuery<any[]>(`
      SELECT 
        COUNT(*) AS total_products,
        SUM(CASE WHEN ProductStatus = 'Đang sử dụng' THEN 1 ELSE 0 END) AS completed_products,
        SUM(CASE WHEN ProductStatus = 'Tạm dừng' THEN 1 ELSE 0 END) AS available_products,
        SUM(CASE WHEN ProductStatus = 'Hủy' THEN 1 ELSE 0 END) AS canceled_products
      FROM Product 
      WHERE IsDeleted = 0 AND YEAR(created_at) = ?
    `, [year]);

    // Thống kê Topic theo năm
    const topics = await executeQuery<any[]>(`
      SELECT 
        COUNT(*) AS total_topics,
        SUM(CASE WHEN TopicStatus = 'Đang sử dụng' THEN 1 ELSE 0 END) AS completed_topics,
        SUM(CASE WHEN TopicStatus = 'Tạm dừng' THEN 1 ELSE 0 END) AS active_topics,
        SUM(CASE WHEN TopicStatus = 'Hủy' THEN 1 ELSE 0 END) AS canceled_topics
      FROM Topic 
      WHERE IsDeleted = 0 AND YEAR(created_at) = ?
    `, [year]);

    const trainingCouse = await executeQuery<any[]>(`
      SELECT 
        COUNT(*) AS total_trainingCouse,
        SUM(CASE WHEN ServiceStatus = 'Hoàn thành' THEN 1 ELSE 0 END) AS completed_trainingCouse,
        SUM(CASE WHEN ServiceStatus = 'Đang đào tạo' THEN 1 ELSE 0 END) AS active_trainingCouse,
        SUM(CASE WHEN ServiceStatus = 'Hủy' THEN 1 ELSE 0 END) AS canceled_trainingCouse
      FROM TrainingCourse 
      WHERE IsDeleted = 0 AND YEAR(created_at) = ?
    `, [year]);
    const persionnel = await executeQuery<any[]>(`
      SELECT 
        COUNT(*) AS total_Personnel,
        SUM(CASE WHEN Gender = 'Nam' THEN 1 ELSE 0 END) AS male_Personnel,
        SUM(CASE WHEN Gender = 'Nữ' THEN 1 ELSE 0 END) AS female_Personnel,
        SUM(CASE WHEN Gender = 'Khác' THEN 1 ELSE 0 END) AS other_Personnel
      FROM Personnel 
      WHERE IsDeleted = 0 AND YEAR(created_at) = ?
    `, [year]);

    const Partner = await executeQuery<any[]>(`
      SELECT 
        COUNT(*) AS total_Partner,
        SUM(CASE WHEN PartnershipStatus = 'Đang hợp tác' THEN 1 ELSE 0 END) AS completed_Partner,
        SUM(CASE WHEN PartnershipStatus = 'Dừng hợp tác' THEN 1 ELSE 0 END) AS active_Partner,
        SUM(CASE WHEN PartnershipStatus = 'Hủy hợp tác' THEN 1 ELSE 0 END) AS canceled_Partner
      FROM Partner 
      WHERE IsDeleted = 0 AND YEAR(created_at) = ?
    `, [year]);

    const Customer = await executeQuery<any[]>(`
      SELECT 
        COUNT(*) AS total_Customer,
        SUM(CASE WHEN CustomerStatut = 'Đang hợp tác'  THEN 1 ELSE 0 END) AS completed_Customer,
        SUM(CASE WHEN CustomerStatut = 'Dừng hợp tác' THEN 1 ELSE 0 END) AS active_Customer,
        SUM(CASE WHEN CustomerStatut = 'Hủy hợp tác' THEN 1 ELSE 0 END) AS canceled_Customer
      FROM Customer 
      WHERE IsDeleted = 0 AND YEAR(created_at) = ?
    `, [year]);

    const Service = await executeQuery<any[]>(`
      SELECT 
        COUNT(*) AS total_Service,
        SUM(CASE WHEN ServiceStatus = 'Đang sử dụng' THEN 1 ELSE 0 END) AS completed_Service,
        SUM(CASE WHEN ServiceStatus = 'Tạm dừng' THEN 1 ELSE 0 END) AS active_Service,
        SUM(CASE WHEN ServiceStatus = 'Hủy' THEN 1 ELSE 0 END) AS canceled_Service
      FROM Service 
      WHERE IsDeleted = 0 AND YEAR(created_at) = ?
    `, [year]);

    const statistics = {
      year,
      total_projects: projects[0]?.total_projects || 0,
      active_projects: projects[0]?.active_projects || 0,
      completed_projects: projects[0]?.completed_projects || 0,
      cancel_projects: projects[0]?.canceled_projects || 0,
      total_products: products[0]?.total_products || 0,
      available_products: products[0]?.available_products || 0,
      completed_products: products[0]?.completed_products || 0,
      cancel_products: products[0]?.canceled_products || 0,
      total_topics: topics[0]?.total_topics || 0,
      active_topics: topics[0]?.active_topics || 0,
      completed_topics: topics[0]?.completed_topics || 0,
      cancel_topics: topics[0]?.canceled_topics || 0,

      total_trainingCouse: trainingCouse[0]?.total_trainingCouse || 0,
      active_trainingCouse: trainingCouse[0]?.active_trainingCouse || 0,
      completed_trainingCouse: trainingCouse[0]?.completed_trainingCouse || 0,
      cancel_trainingCouse: trainingCouse[0]?.canceled_trainingCouse || 0,
      
      male_Personnel: persionnel[0]?.male_Personnel || 0,
      female_Personnel: persionnel[0]?.female_Personnel || 0,
      other_Personnel: persionnel[0]?.other_Personnel || 0,
      total_Personnel: persionnel[0]?.total_Personnel || 0,
      
      total_Partner: Partner[0]?.total_Partner || 0,
      active_Partner: Partner[0]?.active_Partner || 0,
      completed_Partner: Partner[0]?.completed_Partner || 0,
      cancel_Partner: Partner[0]?.canceled_Partner || 0,

      total_Customer: Customer[0]?.total_Customer || 0,
      active_Customer: Customer[0]?.active_Customer || 0,
      completed_Customer: Customer[0]?.completed_Customer || 0,
      cancel_Customer: Customer[0]?.canceled_Customer || 0,

      total_Service: Service[0]?.total_Service || 0,
      active_Service: Service[0]?.active_Service || 0,
      completed_Service: Service[0]?.completed_Service || 0,
      cancel_Service: Service[0]?.canceled_Service || 0,
      
    };

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    return NextResponse.json({ error: 'Không thể lấy dữ liệu thống kê' }, { status: 500 });
  }
}
