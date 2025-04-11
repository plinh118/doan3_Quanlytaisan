"use client";
import { motion } from "framer-motion";
import style from "./trainingcouse.module.scss";
import { useCallback, useEffect, useState } from "react";
import { useNotification } from "@/components/UI_shared/Notification";
import Image from "next/image";
import { trainingCouseAPI } from "@/libs/api/trainingCouse.api";
import { GetTrainingCourse } from "@/models/trainingCourse.api";
import { Button, Tag, Input, Pagination } from "antd"; 
import ConsultationFormModal from "@/components/home_user/modal_Consult";

export default function TrainingCourse() {
  const { show } = useNotification();
  
  
  const [trainingcouse, settrainingcouse] = useState<GetTrainingCourse[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTrainingCouse, setSelectedTrainingCouse] = useState<GetTrainingCourse | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalItems, setTotalItems] = useState(0); 
  
  useEffect(() => {
    fetchtrainingcouse();
  }, [currentPage, searchQuery]); 

  
  const fetchtrainingcouse = useCallback(async () => {
    try {
      const data = await trainingCouseAPI.gettrainingCousesByPageOrder(
        currentPage,  
        6,            
        "ASC", 
        searchQuery,  
        undefined, 
        "Đang đào tạo"
      );
      settrainingcouse(data || []);
      setTotalItems(data[0].TotalRecords || 0);
    } catch (error) {
      show({
        result: 1,
        messageError: 'Lỗi tải danh sách sản phẩm',
      });
    }
  }, [currentPage, searchQuery]);

  
  const openConsultModal = (training_course: GetTrainingCourse | null) => {
    setSelectedTrainingCouse(training_course);
    setModalVisible(true);
  };

  
  const closeModal = () => {
    setModalVisible(false);
    setSelectedTrainingCouse(null);
  };

  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); 
  };

  return (
    <>
      <section className={style.banner}>
        <h1>Đào tạo</h1>
        <p><a href="/vi/home_user">Trang chủ</a> 〉Đào tạo</p>
      </section>

      <section className={style.content}>
        <div className={style.center}>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Đào tạo hướng đến sự phát triển toàn diện của học viên
          </motion.h1>
          <br />
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
           "Chúng tôi đồng hành cùng học viên, tối ưu hóa hành trình học tập bằng các phương pháp hiện đại và công nghệ tiên tiến, giúp họ chinh phục tri thức và đạt được thành công trong sự nghiệp. Với chúng tôi, học viên là trung tâm của mọi chương trình đào tạo, và sự tiến bộ của họ chính là thành công lớn nhất của chúng tôi."
          </motion.p>
        </div>
      </section>

      <section className={style.products_section}>
        <div className={style.products_container}>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className={style.products_title}
          >
            Danh sách khóa đào tạo của chúng tôi
          </motion.h2>

          {/* Thêm ô tìm kiếm */}
          <div className={style.search_box}>
            <Input
              placeholder="Tìm kiếm khóa học..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className={style.products_grid}>
            {trainingcouse.map((product) => (
              <motion.div
                key={product.Id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                className={style.product_card}
              >
                <div className={style.product_image}>
                  <Image
                    src={`/trainings/training-${product.CourseName}.jpg`}
                    alt={product.CourseName}
                    width={300}
                    height={200}
                    className={style.product_img}
                  />
                  <div className={`${style.product_status} ${product.ServiceStatus.toLowerCase()}`}>
                    <Tag color={product.ServiceStatus === "Đang đào tạo" ? "#f06418" : "default"}>
                      {product.ServiceStatus}
                    </Tag>
                  </div>
                </div>

                <div className={style.product_info}>
                  <h3 className={style.product_name}>{product.CourseName}</h3>
                  <p className={style.product_department}>Giảng Viên: <strong>{product.InstructorName}</strong></p>

                  <div className={style.product_dates}>
                    <div>
                      <span className={style.date_label}>{product.Description}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: "10px" }}>
                      <img src="/image/date.png" height={24} width={24} style={{ display: 'block' }} />
                      <span className={style.date_value}>{product.Duration + " Tuần"}</span>
                      <Button className={style.TrainingButton} onClick={(e) => {
                        e.preventDefault();
                        openConsultModal(product);
                      }}>Tham gia ngay </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Phân trang */}
          <div className={style.pagination_container}>
      <Pagination
        current={currentPage}
        total={totalItems}
        pageSize={6}
        onChange={(page) => setCurrentPage(page)}
        showSizeChanger={false}
      />
    </div>
        </div>
      </section>

      <ConsultationFormModal
        visible={modalVisible}
        relatedItem={selectedTrainingCouse}
        relatedType="training_course"
        onClose={closeModal}
      />
    </>
  );
}
