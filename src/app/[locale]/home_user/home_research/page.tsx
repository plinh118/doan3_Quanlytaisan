'use client';
import { useState, useEffect } from "react";
import styles from "./ResearchSection.module.scss";
import {  motion } from "framer-motion";
const ResearchSection = () => {
  const [isVisible, setIsVisible] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement; 
            const index = Number(target.dataset.index);
            setIsVisible((prev) => {
              if (!prev.includes(index)) {
                return [...prev, index];
              }
              return prev;
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    const sections = document.querySelectorAll(`.${styles.sectionContainer}`);
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  const sections = [
    {
      title: "XỬ LÝ NGÔN NGỮ TỰ NHIÊN (NLP)",
      description:
        "Xử lý ngôn ngữ tự nhiên sử dụng công nghệ Trí tuệ nhân tạo (Artificial Intelligence - AI) để mô phỏng quá trình xử lý và hiểu văn bản của con người. Các phương pháp thường được sử dụng như học máy, học sâu, và các mô hình ngôn ngữ lớn được áp dụng để giải quyết các bài toán từ cơ bản tới nâng cao.",
      applications: [
        "Giải trí",
        "Kinh doanh",
        "Chăm sóc khách hàng",
        "Chăm sóc sức khỏe",
        "Trợ lý ảo",
        "Hệ thống truy hồi và hỏi đáp"
      ],
      link: "/research/2",
      image:
        "https://aiacademy.edu.vn/api/file/MjAyNC0wOC0wNy9ubHAgMl8yMDI0XzA4XzA3XzE3MjMwMDI1MTQwMzQuanBn",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      ),
      reverse: false,
    },
    {
      title: "THỊ GIÁC MÁY TÍNH (CV)",
      description:
        "Tự động nhận biết và mô tả hình ảnh một cách chính xác và hiệu quả, truy cập vào khối lượng lớn hình ảnh và dữ liệu video bắt nguồn từ hoặc được tạo bằng điện thoại thông minh, camera giao thông, hệ thống bảo mật và các thiết bị khác.",
      applications: [
        "Nhận diện đối tượng",
        "Nhận diện khuôn mặt",
        "Phân loại hình ảnh",
        "Giám sát an ninh",
        "Xe tự lái",
        "Y tế và chẩn đoán"
      ],
      link: "/research/3",
      image:
        "https://aiacademy.edu.vn/api/file/MjAyNS0wNC0wOS9yZXNlYXJjaC1jdl8yMDI1XzA0XzA5XzE3NDQxNjc1NTYzNzEucG5n",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"></path>
          <circle cx="17" cy="14" r="3"></circle>
          <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
        </svg>
      ),
      reverse: true,
    },
    {
      title: "KHOA HỌC DỮ LIỆU (DS)",
      description:
        "Bao gồm việc thu thập và xử lý dữ liệu rất lớn, dự đoán KPI, phân tích dự đoán dựa trên dữ liệu lớn, tự động sinh dữ liệu cho học máy. Khoa học dữ liệu ứng dụng lấy các mô hình và phương pháp được sử dụng trong phân tích dữ liệu và áp dụng cho dữ liệu mới.",
      applications: [
        "Dự báo kinh doanh",
        "Phân tích thị trường",
        "Tối ưu hóa quy trình",
        "Phân tích hành vi khách hàng",
        "Y tế dự đoán",
        "Phân tích rủi ro"
      ],
      link: "/research/4",
      image:
        "https://aiacademy.edu.vn/api/file/MjAyNC0wOC0wNy9kc18yMDI0XzA4XzA3XzE3MjMwMDIyNjE1NTcuanBn",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18"></path>
          <path d="M18 17V9"></path>
          <path d="M13 17V5"></path>
          <path d="M8 17v-3"></path>
        </svg>
      ),
      reverse: false,
    },
    {
      title: "HỌC SÂU - HỌC MÁY",
      description:
        "Học máy áp dụng trong việc phân tích nội dung văn bản, robot, chatbox, nhận dạng hình ảnh, ứng dụng trên các trang mạng xã hội. Công nghệ học sâu thường được ứng dụng trong các lĩnh vực đa dạng như chăm sóc sức khoẻ, dịch vụ khách hàng, tài chính.",
      applications: [
        "Trợ lý kỹ thuật số",
        "Điều khiển giọng nói",
        "Phát hiện gian lận",
        "Ô tô tự lái",
        "Chẩn đoán y tế",
        "Dự đoán xu hướng"
      ],
      link: "/research/5",
      image:
        "https://aiacademy.edu.vn/api/file/MjAyNC0wOC0wNy9kZWVwIDJfMjAyNF8wOF8wN18xNzIzMDAyNDI2MzkzLmpwZw==",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34"></path>
          <path d="M3 15h12"></path>
          <path d="M15 15v-3a2 2 0 0 1 4 0v3"></path>
          <path d="M17 12h4"></path>
          <path d="M21 15v3a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-3"></path>
        </svg>
      ),
      reverse: true,
    },
    {
      title: "NHẬN DẠNG ÂM THANH",
      description:
        "Xây dựng mô hình ngôn ngữ, mô hình âm học, tự động nhận diện hot word (trigger word), lọc nhiễu. Công nghệ cho phép chuyển đổi lời nói của con người thành văn bản viết, từ đó hỗ trợ giao tiếp liền mạch giữa con người và máy móc.",
      applications: [
        "Trợ lý ảo",
        "Dịch vụ khách hàng",
        "Điều khiển thiết bị",
        "Ghi chú tự động",
        "Phiên dịch",
        "Y tế và hỗ trợ người khuyết tật"
      ],
      link: "/research/6",
      image:
        "https://aiacademy.edu.vn/api/file/MjAyNC0wOC0wNy9hdWRpb18yMDI0XzA4XzA3XzE3MjMwMDI1NjM0MDcuanBn",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
      ),
      reverse: false,
    },
  ];

  return (
    <div className={styles.pageWrapper}>
      <section className={styles.banner}>
        <div className={styles.bannerContent}>
          <h1>Nghiên cứu & Phát triển</h1>
          <p>
            <a href="/vi/home_user">Trang chủ</a> 〉Nghiên cứu
          </p>
        </div>
      </section>

  <section className={styles.content}>
        <div className={styles.center}>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Lĩnh Vực Nghiên Cứu
          </motion.h1>
          <br />
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
           Chúng tôi tập trung nghiên cứu và phát triển các công nghệ trí tuệ nhân tạo hiện đại 
            nhằm giải quyết các bài toán thực tiễn trong nhiều lĩnh vực khác nhau.
          </motion.p>
        </div>
      </section>

      <section className={styles.researchAreas}>
        <div className={styles.container}>
          {sections.map((section, index) => (
            <div
              key={index}
              data-index={index}
              className={`${styles.sectionContainer} ${
                isVisible.includes(index) ? styles.visible : ""
              } ${section.reverse ? styles.reversed : ""}`}
            >
              <div className={styles.contentBox}>
                <div className={styles.iconWrapper}>
                  {section.icon}
                </div>
                <h2>{section.title}</h2>
                <p>{section.description}</p>
                
                <div className={styles.applications}>
                  <h3>Ứng dụng:</h3>
                  <div className={styles.tags}>
                    {section.applications.map((app, idx) => (
                      <span key={idx} className={styles.tag}>{app}</span>
                    ))}
                  </div>
                </div>
                
                <a href={section.link} className={styles.button}>
                  <span className={styles.buttonInner}>
                    <span className={styles.buttonLabel}>Xem chi tiết</span>
                    <span className={styles.buttonIcon}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </span>
                  </span>
                </a>
              </div>
              
              <div className={styles.imageBox}>
                <div className={styles.imageWrapper}>
                  <img
                    src={section.image}
                    alt={section.title}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ResearchSection;