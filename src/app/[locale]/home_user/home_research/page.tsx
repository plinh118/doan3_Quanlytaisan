// ResearchSection.jsx
import styles from "./ResearchSection.module.scss";

const ResearchSection = () => {
  const sections = [
    {
      title: "XỬ LÝ NGÔN NGỮ TỰ NHIÊN (NLP)",
      description:
        "Xử lý ngôn ngữ tự nhiên sử dụng công nghệ Trí tuệ nhân tạo (Artificial Intelligence - AI) để mô phỏng quá trình xử lý và hiểu văn bản của con người. Các phương pháp thường được sử dụng như học máy, học sâu, và các mô hình ngôn ngữ lớn được áp dụng để giải quyết các bài toán từ cơ bản tới nâng cao. Xử lý ngôn ngữ tự nhiên được áp dụng rộng rãi trong các lĩnh vực như: giải trí, kinh doanh, chăm sóc khách hàng, chăm sóc sức khoẻ, các trợ lý ảo, các hệ thống truy hồi và hỏi đáp, …",
      link: "/research/2",
      image:
        "https://aiacademy.edu.vn/api/file/MjAyNC0wOC0wNy9ubHAgMl8yMDI0XzA4XzA3XzE3MjMwMDI1MTQwMzQuanBn",
      bgClass: styles.nlpBackground,
      sectionClass: "",
    },
    {
      title: "THỊ GIÁC MÁY TÍNH (CV)",
      description:
        "Tự động nhận biết và mô tả hình ảnh một cách chính xác và hiệu quả, truy cập vào khối lượng lớn hình ảnh và dữ liệu video bắt nguồn từ hoặc được tạo bằng điện thoại thông minh, camera giao thông, hệ thống bảo mật và các thiết bị khác, xử lý những dữ liệu này một cách chính xác nhằm xác định đối tượng và nhận diện khuôn mặt, cũng như phân loại, đề xuất, giám sát và phát hiện.",
      link: "/research/3",
      image:
        "https://aiacademy.edu.vn/api/file/MjAyNS0wNC0wOS9yZXNlYXJjaC1jdl8yMDI1XzA0XzA5XzE3NDQxNjc1NTYzNzEucG5n",
      bgClass: styles.cvBackground,
      sectionClass: styles.cvSection,
    },
    {
      title: "KHOA HỌC DỮ LIỆU (DS)",
      description:
        "Bao gồm việc thu thập và xử lý dữ liệu rất lớn, dự đoán KPI, phân tích dự đoán dựa trên dữ liệu lớn, tự động sinh dữ liệu cho học máy. Khoa học dữ liệu ứng dụng lấy các mô hình và phương pháp được sử dụng trong phân tích dữ liệu và áp dụng cho dữ liệu mới trong các tình huống thực tế để đưa ra kết quả xác suất.",
      link: "/research/4",
      image:
        "https://aiacademy.edu.vn/api/file/MjAyNC0wOC0wNy9kc18yMDI0XzA4XzA3XzE3MjMwMDIyNjE1NTcuanBn",
      bgClass: styles.dsBackground,
      sectionClass: "",
    },
    {
      title: "HỌC SÂU - HỌC MÁY",
      description:
        "Học máy áp dụng trong việc phân tích nội dung văn bản, robot, chatbox, nhận dạng hình ảnh, ứng dụng trên các trang mạng xã hội. Công nghệ học sâu thường được ứng dụng trong các lĩnh vực như chăm sóc sức khoẻ, dịch vụ khách hàng, dịch vụ tài chính, giao thông thông minh, nằm sau các sản phẩm và dịch vụ hàng ngày chẳng hạn như trợ lý kỹ thuật số, điều khiển TV hỗ trợ giọng nói từ xa, phát hiện gian lận thẻ tín dụng, ô tô tự lái,...",
      link: "/research/5",
      image:
        "https://aiacademy.edu.vn/api/file/MjAyNC0wOC0wNy9kZWVwIDJfMjAyNF8wOF8wN18xNzIzMDAyNDI2MzkzLmpwZw==",
      bgClass: styles.mlBackground,
      sectionClass: styles.mlSection,
    },
    {
      title: "NHẬN DẠNG ÂM THANH",
      description:
        "Xây dựng mô hình ngôn ngữ, mô hình âm học, tự động nhận diện hot word (trigger word), lọc nhiễu. Công nghệ cho phép chuyển đổi lời nói của con người thành văn bản viết, từ đó hỗ trợ giao tiếp liền mạch giữa con người và máy móc.",
      link: "/research/6",
      image:
        "https://aiacademy.edu.vn/api/file/MjAyNC0wOC0wNy9hdWRpb18yMDI0XzA4XzA3XzE3MjMwMDI1NjM0MDcuanBn",
      bgClass: styles.audioBackground,
      sectionClass: "",
    },
  ];

  return (
    <>
      <section className={styles.banner}>
        <h1>Nghiên cứu</h1>
        <p>
          <a href="/vi/home_user">Trang chủ</a> 〉Nghiên cứu
        </p>
      </section>
      <section className={styles.sectionBg} style={{width:"90%", marginLeft:'5%'}}>
        {sections.map((section, index) => (
          <div
            key={index}
            className={`${styles.sectionContainer} ${section.sectionClass}`}
          >
            <div className={styles.container}>
              <div className={styles.grid}>
                <div className={styles.gridInner}>
                  {/* Column 1: Text */}
                  <div className={styles.gridCol}>
                    <div className={`${styles.backgroundImage} ${section.bgClass}`} >
                      <h2 className={styles.title}>{section.title}</h2>
                      <span className={styles.text}>
                        <div className={styles.typography}>
                          <p>{section.description}</p>
                        </div>
                      </span>
                      <div className={styles.buttonWrapper}>
                        <a href={section.link} className={styles.button}>
                          <span className={styles.buttonInner}>
                            <span className={styles.buttonSection}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M5 12l14 0" />
                                <path d="M13 18l6 -6" />
                                <path d="M13 6l6 6" />
                              </svg>
                            </span>
                            <span className={styles.buttonLabel}>Xem chi tiết</span>
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                  {/* Column 2: Image */}
                  <div className={styles.gridCol}>
                    <div className={styles.imageContainer}>
                      <img
                        className={styles.image}
                        src={section.image}
                        alt={section.title}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default ResearchSection;