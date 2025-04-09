"use client";
import { color, motion } from "framer-motion";
import "./trainingcouse.scss";
import { useCallback, useEffect, useState } from "react";
import { useNotification } from "@/components/UI_shared/Notification";
import Image from "next/image";
import { trainingCouseAPI } from "@/libs/api/trainingCouse.api";
import { GetTrainingCourse } from "@/models/trainingCourse.api";
import { Tag } from "antd";

export default function TrainingCourse() {
  const { show } = useNotification();
  const [trainingcouse, settrainingcouse] = useState<GetTrainingCourse[]>([]);

  useEffect(() => {
    fetchtrainingcouse();
  }, []);

  const fetchtrainingcouse = useCallback(async () => {
    try {
      const data = await trainingCouseAPI.gettrainingCousesByPageOrder(1, 10, "ASC","",undefined,"Đang đào tạo");
      settrainingcouse(data || []);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi tải danh sách sản phẩm',
      });
    }
  }, []);

  // Hàm định dạng ngày
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <>
      <section className="banner">
        <h1>Đào tạo</h1>
        <p><a href="/">Trang chủ</a> 〉Đào tạo</p>
      </section>

      <section className="content">
        <div className="center">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Sản phẩm luôn đặt khách hàng làm trung tâm
          </motion.h1>
          <br />
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Chúng tôi đồng hành và giúp khách hàng tối ưu quy trình sản xuất, nâng cao hiệu quả công việc
            nhờ áp dụng AI trong chuyển đổi số, giúp khách hàng tiến đến thành công trên con đường kinh doanh của họ.
            Đối với chúng tôi, khách hàng chính là người quyết định sứ mệnh và định hướng cho sản phẩm và dịch vụ.
            Sự thành công của khách hàng chính là sự thành công của chúng tôi.
          </motion.p>
        </div>
      </section>

      <section className="products-section">
        <div className="products-container">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="products-title"
          >
            Danh sách khóa đào tạo của chúng tôi
          </motion.h2>

          <div className="products-grid">
            {trainingcouse.map((product) => (
              <motion.div
                key={product.Id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                className="product-card"
              >
                <div className="product-image">
                  <Image
                    src={`/trainings/training-${product.CourseName}.jpg`} // Giả sử có 5 ảnh mẫu
                    alt={product.CourseName}
                    width={300}
                    height={200}
                    className="product-img"
                  />
                  <div className={`product-status ${product.ServiceStatus.toLowerCase()}`}>
                    <Tag color={product.ServiceStatus === "Đang đào tạo" ? "#f06418" : "default"}>
                      {product.ServiceStatus}
                    </Tag>
                  </div>
                </div>

                <div className="product-info">
                  <h3 className="product-name">{product.CourseName}</h3>
                  <p className="product-department">Giảng Viên: <strong>{"" + product.InstructorName}</strong></p>

                  <div className="product-dates">

                    <div>
                      <span className="date-label">{product.Description}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: "10px" }}>
                      <img src="/image/date.png" height={24} width={24} style={{ display: 'block' }} />
                      <span className="date-value">{product.Duration + " Tuần"}</span>
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}