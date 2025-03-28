"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./user.css";
import { useRouter } from 'next/navigation';
const images = ["/slideshow1.jpg", "/slideshow2.jpg", "/slideshow3.jpg"];
const experts = [
  { id: 1, image: "/expert1.jpg", name: "Chuyên gia 1", position: "AI Researcher" },
  { id: 2, image: "/expert2.jpg", name: "Chuyên gia 2", position: "Data Scientist" },
  { id: 3, image: "/expert3.jpg", name: "Chuyên gia 3", position: "Machine Learning Engineer" },
  { id: 4, image: "/expert4.jpg", name: "Chuyên gia 4", position: "Software Engineer" },
  { id: 5, image: "/expert5.jpg", name: "Chuyên gia 5", position: "Deep Learning Specialist" },
  { id: 6, image: "/expert6.jpg", name: "Chuyên gia 6", position: "Cloud Architect" },
  { id: 7, image: "/expert7.jpg", name: "Chuyên gia 7", position: "Cybersecurity Expert" },
  { id: 8, image: "/expert8.jpg", name: "Chuyên gia 8", position: "Blockchain Developer" },
  { id: 9, image: "/expert9.jpg", name: "Chuyên gia 9", position: "DevOps Engineer" },
  { id: 10, image: "/expert10.jpg", name: "Chuyên gia 10", position: "IoT Specialist" },
];
const extendedExperts = [...experts, ...experts, ...experts];
export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Lưu interval
  const expertContainerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const cardWidth = 800; // Kích thước card cố định
  const scrollAmount = cardWidth + 20; // Kích thước scroll theo mỗi lần nhấn

  useEffect(() => {
    document.title = "Trang chủ";
    
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const slideshow = (direction?: "left") => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current); // Dừng tự động chạy khi có thao tác tay
      intervalRef.current = null; // Đặt về null để tránh lỗi lặp lại
    }

    setCurrentIndex((prevIndex) => {
      if (direction === "left") {
        return prevIndex === 0 ? images.length - 1 : prevIndex - 1;
      }
      return (prevIndex + 1) % images.length;
    });
  };

  
  useEffect(() => {
    if (expertContainerRef.current) {
      // Bắt đầu ở giữa danh sách (bộ nhân đôi)
      expertContainerRef.current.scrollLeft = experts.length * scrollAmount;
    }
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (expertContainerRef.current) {
      if (direction === "left") {
        expertContainerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        expertContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  const handleScrollEnd = () => {
    if (expertContainerRef.current) {
      const maxScroll = experts.length * scrollAmount * 2; // Tổng chiều dài scroll
      const minScroll = 0;

      if (expertContainerRef.current.scrollLeft >= maxScroll - scrollAmount) {
        // Nếu cuộn đến cuối danh sách nhân đôi, nhảy về đầu danh sách gốc
        expertContainerRef.current.scrollLeft = experts.length * scrollAmount;
      } else if (expertContainerRef.current.scrollLeft <= minScroll + scrollAmount) {
        // Nếu cuộn về đầu danh sách nhân đôi, nhảy về cuối danh sách gốc
        expertContainerRef.current.scrollLeft = experts.length * scrollAmount;
      }
    }
  };
  const handleClick = (item: string) => {
    console.log("Clicked:", item);
  
    switch (item) {
      case "Trang chủ":
        console.log("Điều hướng đến Trang chủ");
        break;
      case "Sản phẩm":
        console.log("Điều hướng đến Sản phẩm");
        router.push('/vi/home_product')
        break;
      case "Nghiên cứu":
        console.log("Điều hướng đến Nghiên cứu");
        break;
      case "Đào tạo":
        console.log("Điều hướng đến Đào tạo");
        break;
      case "Tuyển dụng":
        console.log("Điều hướng đến Tuyển dụng");
        break;
      case "Blog":
        console.log("Điều hướng đến Blog");
        break;
      case "Liên hệ":
        console.log("Điều hướng đến Liên hệ");
        break;
        case "Đăng nhập":
        console.log("Điều hướng đến Liên hệ");
        router.push('/vi/login')
        break;
      default:
        console.log("Mục không xác định");
    }
  };
  
  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div style={{ height: '100%', width: "90%", display: "flex", justifyContent: "space-between", marginLeft: '5%', alignItems: 'center' }}>
          <div className="logo">
            <Image src="/image/logo.png" width={130} height={62} alt="Logo" />
          </div>
          <nav className="nav-menu">
            <ul>
              {["Trang chủ", "Sản phẩm", "Nghiên cứu", "Đào tạo", "Tuyển dụng", "Blog", "Liên hệ","Đăng nhập"].map((item, index) => (
                <motion.li key={index} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3 }}
                onClick={() => handleClick(item)}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* Slideshow */}
      <section className="slideshow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="slide"
          >
            <Image src={images[currentIndex]} alt="Slideshow" layout="fill" objectFit="cover" priority />
            <div className="overlay" />
            <motion.div className="slide-text" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
              <h3>Viện Trí Tuệ Nhân Tạo Việt Nam giúp bạn chuyển đổi số doanh nghiệp</h3>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Nút điều hướng */}
        <div style={{
          display: "flex",
          width: "120px",
          height: "50px",
          justifyContent: "space-between",
          position: "absolute",
          zIndex: 900,
          top: "95%",
          left: "95%",
          transform: "translate(-50%, -50%)"
        }}>
          <div
            style={{ height: "50px", width: "50px",backgroundColor:"white", backgroundImage:"url('/left.png')", border: "1px orange solid", borderRadius: "5%", cursor: "pointer" }}
            onClick={() => slideshow("left")} // Lùi ảnh
          />
          <div
            style={{ height: "50px", width: "50px",backgroundColor:"white", backgroundImage:"url('/right.png')", border: "1px orange solid", borderRadius: "5%", cursor: "pointer" }}
            onClick={() => slideshow()} // Tiến ảnh
          />
        </div>
      </section>

      {/* About Section */}
      <section className="about-section-introduce">
        <div className="about-content">
          <motion.h1 initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            Chúng tôi là Viện Trí Tuệ Nhân Tạo Việt Nam
          </motion.h1>
          <motion.p initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}>
            Viện trí tuệ nhân tạo Việt Nam là tập thể những con người với lòng nhiệt huyết và khát vọng mang đến thị trường sự sáng tạo và đổi mới. Chúng tôi là đội ngũ lớn mạnh tự tin với năng lực công nghệ, sản phẩm và chất lượng dịch vụ. Trải qua hơn 5 năm hình thành và phát triển, Viện Trí tuệ nhân tạo Việt Nam vẫn luôn khẳng định vai trò tiên phong trong lĩnh vực AI và chuyển đổi số tại Việt Nam, đồng hành cùng với đó là đội ngũ chuyên gia hàng đầu trong lĩnh vực. Chúng tôi không ngừng cố gắng, không ngừng nỗ lực để đáp ứng mọi nhu cầu của khách hàng, mang đến khách hàng những trải nghiệm sản phẩm và dịch vụ tốt nhất.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="xem-them-btn"
          >
             ≫ Xem thêm
          </motion.button>
        </div>
        <motion.div className="about-image" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <Image src="/i.jpg" alt="About" layout="fill" objectFit="cover" />
        </motion.div>
      </section>
      <section className="about-section-value-mision">
      <div className="contain_value">
        {/* Bên trái */}
        <div className="containleft">
          <div className="tron"></div>
          <div className="text_title">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false }}
              style={{ color: "#f06418", fontSize: "38px", textAlign: "center" }}
            >
              Giá trị cốt lõi
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: false }}
            >
              Kỷ luật và đồng tâm được xem là một phần không thể thiếu kiến tạo nên bộ GEN của Viện trí tuệ nhân tạo Việt Nam. Đó là Tinh thần của chúng tôi, là sức mạnh thúc đẩy lãnh đạo, CBNV của Viện không ngừng nỗ lực, sáng tạo vì lợi ích chung của cộng đồng, của khách hàng và các bên liên quan khác.
            </motion.p>
          </div>

          {/* Nội dung */}
          <div className="content-value2">
            <br />
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: false }}
              style={{ height: "20%", width: "100%", display: "flex", alignItems: "center" }}
            >
              <motion.img
                src="/diamond.png"
                alt="Diamond Icon"
                height={50}
                width={50}
                initial={{ opacity: 0, rotate: -20 }}
                whileInView={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: false }}
                style={{ marginRight: "10px" }}
              />
              <h2 style={{ color: "black", fontSize: "20px" }}>Kỷ luật</h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: false }}
            >
              Là chìa khóa để mỗi cá nhân rèn luyện bản thân, chăm chỉ làm việc và mang lại giá trị cho doanh nghiệp. Sự phát triển và rèn luyện tính kỷ luật giúp Viện trí tuệ nhân tạo Việt Nam có nền tảng phát triển văn hóa, con người và năng suất bền vững.
            </motion.p>

            <br />

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: false }}
              style={{ height: "20%", width: "100%", display: "flex", alignItems: "center" }}
            >
              <motion.img
                src="/brain.png"
                alt="Brain Icon"
                height={50}
                width={50}
                initial={{ opacity: 0, rotate: -20 }}
                whileInView={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: false }}
                style={{ marginRight: "10px" }}
              />
              <h2 style={{ color: "black", fontSize: "20px" }}>Đồng tâm</h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: false }}
            >
              Là sự tôn trọng, tình bằng hữu, sự đoàn kết. Viện trí tuệ nhân tạo Việt Nam như một đại gia đình, yêu thương, che chở, bảo vệ lẫn nhau, thấm nhuần tinh thần đồng cam cộng khổ, sát cánh vì mục tiêu chung..
            </motion.p>
          </div>
        </div>

        {/* Bên phải */}
        <div className="containright">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            viewport={{ once: false }}
            style={{ fontSize: "38px" }}
          >
            Sứ mệnh của chúng tôi
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: false }}
          >
           Sứ mệnh của chúng tôi là góp phần thúc đẩy công cuộc chuyển đổi số, ứng dụng AI trong các khu công nghiệp, nhà máy, văn phòng và chính phủ thông qua các hoạt động: phát triển sản phẩm, nghiên cứu và đào tạo. Con đường chúng tôi chọn dù còn nhiều thử thách, nhưng đó chính là cơ hội vàng để đội ngũ Viện trí tuệ nhân tạo Việt Nam tỏa sáng.
          </motion.p>

          <div className="imagemission"></div>
        </div>
      </div>
    </section>
    <section className="expert">
      <h1>Đội ngũ chuyên gia của chúng tôi</h1>
      <div className="expert-container">
        <button className="scroll-button left" onClick={() => handleScroll("left")}>
          &lt;
        </button>
        <div
          className="expert-information"
          ref={expertContainerRef}
          onScroll={handleScrollEnd}
        >
          {extendedExperts.map((expert, index) => (
            <div key={index} className="expert-information-card">
              <div className="inforImage">
                <Image src={expert.image} alt={expert.name} width={250} height={330} />
              </div>
              <div className="information_container">
                <h2>{expert.name}</h2>
                <p>{expert.position}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="scroll-button right" onClick={() => handleScroll("right")}>
          &gt;
        </button>
      </div>
    </section>
    <section className="partner">
      <h1>Đối tác của AIA</h1>
    </section>
    <section className="footer">

    </section>
    </div>
  );
}
