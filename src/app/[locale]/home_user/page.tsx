"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./user.css";

const images = ["/slideshow1.jpg", "/slideshow2.jpg", "/slideshow3.jpg"];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    document.title="Trang chủ";
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const slideshow = (left?: string) => {
    setCurrentIndex((prevIndex) => {
      if (left) {
        return prevIndex === 0 ? images.length - 1 : prevIndex - 1; // Lùi ảnh
      }
      return (prevIndex + 1) % images.length; // Tiến ảnh
    });
  };
  

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div style={{height:'100%',width:"90%",display:"flex", justifyContent:"space-between",marginLeft:'5%',alignItems:'center'}}>
        <div className="logo">
          <Image src="/image/logo.png" width={130} height={62} alt="Logo" />
        </div>
        <nav className="nav-menu">
          <ul>
            {["Trang chủ", "Sản phẩm", "Nghiên cứu", "Đào tạo", "Tuyển dụng", "Blog", "Liên hệ"].map((item, index) => (
              <motion.li
                key={index}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </nav>
        </div>
      </header>

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
      <Image
        src={images[currentIndex]}
        alt="Slideshow"
        layout="fill"
        objectFit="cover"
        priority
      />
      <div className="overlay" />
      <motion.div
        className="slide-text"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <h3>Viện Trí Tuệ Nhân Tạo Việt Nam giúp bạn chuyển đổi số doanh nghiệp</h3>
      </motion.div>
    </motion.div>
  </AnimatePresence>

  {/* Di chuyển nút vào trong slideshow */}
  <div
    style={{
      display: "flex",
      width: "120px",
      height: "50px",
      justifyContent: "space-between",
      position: "absolute",
      zIndex: 900,
      top: "95%",  // Canh giữa theo chiều dọc
      left: "95%", // Canh giữa theo chiều ngang
      transform: "translate(-50%, -50%)" // Điều chỉnh lại tâm
    }}
  >
   <div
  style={{
    height: "50px",
    width: "50px",
    backgroundColor: "#f06418",
    border: "1px orange solid",
    borderRadius: "5%"
  }}
  onClick={() => slideshow("a")} // Đúng: Hàm chỉ chạy khi click
></div>
<div
  style={{
    height: "50px",
    width: "50px",
    backgroundColor: "#f06418",
    border: "1px orange solid",
    borderRadius: "5%"
  }}
  onClick={() => slideshow()} // Đúng
></div>

  </div>
</section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-content">
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Chúng tôi là Viện Trí Tuệ Nhân Tạo Việt Nam
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Viện Trí Tuệ Nhân Tạo Việt Nam là tập thể những con người với lòng nhiệt huyết và khát vọng mang đến thị trường sự sáng tạo và đổi mới.
          </motion.p>
        </div>
        <motion.div
          className="about-image"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Image src="/logo.jpg" alt="About" layout="fill" objectFit="cover" />
        </motion.div>
      </section>

      {/* Placeholder Sections */}
      <section className="section section-1">
        <h2>Section 1</h2>
      </section>
      <section className="section section-2">
        <h2>Section 2</h2>
      </section>
      <section className="section section-3">
        <h2>Section 3</h2>
      </section>
      <section className="section section-4">
        <h2>Section 4</h2>
      </section>
      <section className="section section-5">
        <h2>Section 5</h2>
      </section>
    </div>
  );
}
