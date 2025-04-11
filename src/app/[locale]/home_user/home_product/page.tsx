"use client";
import { motion } from "framer-motion";
import styles from "./Product.module.scss";
import { useCallback, useEffect, useState } from "react";
import { useNotification } from "@/components/UI_shared/Notification";
import { productAPI } from "@/libs/api/product.api";
import { Get_Product } from "@/models/product.model";
import Image from "next/image";
import { Tag } from "antd";
import ConsultationFormModal from "@/components/home_user/modal_Consult";

export default function ProductPage() {
  const { show } = useNotification();
  const [products, setProducts] = useState<Get_Product[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Get_Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const data = await productAPI.getproductsByPageOrder(1, 10, "ASC");
      setProducts(data || []);
    } catch (error) {
      show({
        result: 1,
        messageError: "Lỗi tải danh sách sản phẩm",
      });
    }
  }, [show]);

  // Hàm định dạng ngày
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  // Mở modal đăng ký tư vấn
  const openConsultModal = (product: Get_Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  // Đóng modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <section className={styles.banner}>
        <h1>Sản phẩm</h1>
        <p>
          <a href="/vi/home_user">Trang chủ</a> 〉Sản phẩm
        </p>
      </section>

      <section className={styles.content}>
        <div className={styles.center}>
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
            Chúng tôi đồng hành và giúp khách hàng tối ưu quy trình sản xuất,
            nâng cao hiệu quả công việc nhờ áp dụng AI trong chuyển đổi số, giúp
            khách hàng tiến đến thành công trên con đường kinh doanh của họ.
            Đối với chúng tôi, khách hàng chính là người quyết định sứ mệnh và
            định hướng cho sản phẩm và dịch vụ. Sự thành công của khách hàng
            chính là sự thành công của chúng tôi.
          </motion.p>
        </div>
      </section>

      <div className={styles.sectionWaveTop}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#f8f9fa"
            fillOpacity="1"
            d="M0,128L80,138.7C160,149,320,171,480,176C640,181,800,171,960,149.3C1120,128,1280,96,1360,80L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
      </div>

      <section className={styles.productsSection}>
        <div className={styles.productsContainer}>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className={styles.productsTitle}
          >
            Danh sách sản phẩm của chúng tôi
          </motion.h2>

          {products.map((product, index) => (
            <motion.div
              key={product.Id}
              className={styles.productItemContainer}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
            >
              <div className={styles.productItem}>
                <div className={styles.productInfo}>
                  <motion.h3
                    className={styles.productTitle}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    {product.ProductName}
                  </motion.h3>

                  <motion.div
                    className={styles.productDates}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className={styles.dateItem}>
                      <span className={styles.dateLabel}>Phòng ban:</span>
                      <span className={styles.dateValue}>
                        {product.DepartmentName}
                      </span>
                    </div>
                    <div className={styles.dateItem}>
                      <span className={styles.dateLabel}>Bắt đầu:</span>
                      <span className={styles.dateValue}>
                        {formatDate(product.ProductStartDate)}
                      </span>
                    </div>
                    <div className={styles.dateItem}>
                      <span className={styles.dateLabel}>Kết thúc:</span>
                      <span className={styles.dateValue}>
                        {formatDate(product.ProductEndDate)}
                      </span>
                    </div>
                  </motion.div>

                  <motion.p
                    className={styles.productDescription}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    {product.Description}
                  </motion.p>

                  <motion.a
                    href="#"
                    className={styles.productButton}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={(e) => {
                      e.preventDefault();
                      openConsultModal(product);
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12H19M19 12L12 5M19 12L12 19"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Đăng ký tư vấn
                  </motion.a>
                </div>

                <div className={styles.productImageContainer}>
                  <motion.div
                    className={styles.productImageWrapper}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <Image
                      src={`/products/product-${product.ProductName}.jpg`}
                      alt={product.ProductName}
                      width={600}
                      height={400}
                      className={styles.productImg}
                    />
                  </motion.div>
                </div>

                <div className={styles.productStatusTag}>
                  <Tag
                    color={
                      product.ProductStatus === "Đang sử dụng"
                        ? "#f06418"
                        : "default"
                    }
                  >
                    {product.ProductStatus}
                  </Tag>
                </div>
              </div>

              <div className={styles.waveShape}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                  <path
                    fill={index % 2 === 0 ? "#fff" : "#f8f9fa"}
                    fillOpacity="1"
                    d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                  ></path>
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className={styles.sectionWaveBottom}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#f8f9fa"
            fillOpacity="1"
            d="M0,128L80,138.7C160,149,320,171,480,176C640,181,800,171,960,149.3C1120,128,1280,96,1360,80L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Sử dụng component ConsultationFormModal */}
      <ConsultationFormModal
        visible={modalVisible}
        relatedItem={selectedProduct}
        relatedType='product'
        onClose={closeModal}
      />
    </>
  );
}