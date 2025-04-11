"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { GetPersonnel } from "@/models/persionnel.model";
import { personnelAPI } from "@/libs/api/personnel.api";
import { useNotification } from "@/components/UI_shared/Notification";
import ConsultationFormModal from "@/components/home_user/modal_Consult"; // Import modal từ yêu cầu trước
import avatar from "@/assets/images/avatars/default.png";
import styles from "./Home.module.scss"; // Sử dụng module SCSS

const images = ["/slideshow1.jpg", "/slideshow2.jpg", "/slideshow3.jpg"];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const expertContainerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const cardWidth = 300; // Kích thước card cố định
  const scrollAmount = cardWidth + 20; // Kích thước scroll mỗi lần nhấn
  const [personnels, setPersonnels] = useState<GetPersonnel[]>([]);
  const { show } = useNotification();
  const [modalVisible, setModalVisible] = useState(false); // State cho modal đăng ký tư vấn

  useEffect(() => {
    document.title = "Trang chủ";
    GetPersonnelsByPageOrder(1, 20, "ASC");

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const GetPersonnelsByPageOrder = async (
    pageIndex: number,
    pageSize: number,
    orderType: "ASC" | "DESC",
    PersonnelName?: string,
    divisionId?: number,
    positionFilter?: number,
    WorkStatus?: string
  ) => {
    try {
      const data = await personnelAPI.getpersonnelsByPageOrder(
        pageIndex,
        pageSize,
        orderType,
        PersonnelName,
        divisionId,
        positionFilter,
        WorkStatus
      );
      setPersonnels(data || []);
    } catch (error) {
      show({
        result: 1,
        messageError: "Lỗi tải danh sách nhân viên",
      });
    }
  };

  const slideshow = (direction?: "left") => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
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
      expertContainerRef.current.scrollLeft = personnels.length * scrollAmount;
    }
  }, [personnels]);

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
      const maxScroll = personnels.length * scrollAmount * 2;
      const minScroll = 0;

      if (expertContainerRef.current.scrollLeft >= maxScroll - scrollAmount) {
        expertContainerRef.current.scrollLeft = personnels.length * scrollAmount;
      } else if (expertContainerRef.current.scrollLeft <= minScroll + scrollAmount) {
        expertContainerRef.current.scrollLeft = personnels.length * scrollAmount;
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* Slideshow */}
      <section className={styles.slideshow}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className={styles.slide}
          >
            <Image src={images[currentIndex]} alt="Slideshow" layout="fill" objectFit="cover" priority />
            <div className={styles.overlay} />
            <motion.div
              className={styles.slideText}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h3>Viện Trí Tuệ Nhân Tạo Việt Nam giúp bạn chuyển đổi số doanh nghiệp</h3>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Nút điều hướng */}
        <div className={styles.navButtons}>
          <button className={styles.navButtonLeft} onClick={() => slideshow("left")}>
            <Image src="/left.png" alt="Left Arrow" width={24} height={24} />
          </button>
          <button className={styles.navButtonRight} onClick={() => slideshow()}>
            <Image src="/right.png" alt="Right Arrow" width={24} height={24} />
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutContent}>
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
            Viện trí tuệ nhân tạo Việt Nam là tập thể những con người với lòng nhiệt huyết và khát vọng mang đến thị trường sự sáng tạo và đổi mới. Chúng tôi là đội ngũ lớn mạnh tự tin với năng lực công nghệ, sản phẩm và chất lượng dịch vụ. Trải qua hơn 5 năm hình thành và phát triển, Viện trí tuệ nhân tạo Việt Nam vẫn luôn khẳng định vai trò tiên phong trong lĩnh vực AI và chuyển đổi số tại Việt Nam, đồng hành cùng với đó là đội ngũ chuyên gia hàng đầu trong lĩnh vực. Chúng tôi không ngừng cố gắng, không ngừng nỗ lực để đáp ứng mọi nhu cầu của khách hàng, mang đến khách hàng những trải nghiệm sản phẩm và dịch vụ tốt nhất.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className={styles.viewMoreBtn}
            onClick={() => router.push("/about")} // Điều hướng đến trang About
          >
            ≫ Xem thêm
          </motion.button>
        </div>
        <motion.div
          className={styles.aboutImage}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Image src="/i.jpg" alt="About" width={400} height={300} className={styles.image} />
        </motion.div>
      </section>

      {/* Value & Mission Section */}
      <section className={styles.valueMissionSection}>
        <div className={styles.valueMissionContainer}>
          {/* Giá trị cốt lõi */}
          <div className={styles.valueContainer}>
            <motion.div
              className={styles.valueImage}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false }}
            >
              <Image src="/value.png" alt="Value" width={200} height={200} className={styles.image} />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false }}
              style={{paddingTop:'40px'}}
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
            <div className={styles.valueDetails}>
              <motion.div
                className={styles.valueItem}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: false }}
              >
                <Image src="/diamond.png" alt="Diamond Icon" width={50} height={50} />
                <h2>Kỷ luật</h2>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: false }}
              >
                Là chìa khóa để mỗi cá nhân rèn luyện bản thân, chăm chỉ làm việc và mang lại giá trị cho doanh nghiệp. Sự phát triển và rèn luyện tính kỷ luật giúp Viện trí tuệ nhân tạo Việt Nam có nền tảng phát triển văn hóa, con người và năng suất bền vững.
              </motion.p>
              <motion.div
                className={styles.valueItem}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: false }}
              >
                <Image src="/brain.png" alt="Brain Icon" width={50} height={50} />
                <h2>Đồng tâm</h2>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: false }}
              >
                Là sự tôn trọng, tình bằng hữu, sự đoàn kết. Viện trí tuệ nhân tạo Việt Nam như một đại gia đình, yêu thương, che chở, bảo vệ lẫn nhau, thấm nhuần tinh thần đồng cam cộng khổ, sát cánh vì mục tiêu chung.
              </motion.p>
            </div>
          </div>

          {/* Sứ mệnh */}
          <div className={styles.missionContainer}>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              viewport={{ once: false }}
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
            <motion.div
              className={styles.missionImage}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              viewport={{ once: false }}
            >
              <Image src="/mission.png" alt="Mission" width={200} height={200} className={styles.image} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Expert Section */}
      <section className={styles.expertSection}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
        >
          Đội ngũ chuyên gia của chúng tôi
        </motion.h1>
        <div className={styles.expertContainer}>
          <button className={styles.scrollButtonLeft} onClick={() => handleScroll("left")}>
            &lt;
          </button>
          <div
            className={styles.expertInformation}
            ref={expertContainerRef}
            onScroll={handleScrollEnd}
          >
            {personnels.map((expert: GetPersonnel, index) => (
              <motion.div
                key={index}
                className={styles.expertCard}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: false }}
              >
                <div className={styles.expertImage}>
                  <Image
                    src={typeof expert.Picture === "string" ? expert.Picture : avatar}
                    alt={expert.PersonnelName}
                    width={250}
                    height={330}
                    className={styles.image}
                  />
                </div>
                <div className={styles.expertInfo}>
                  <h2>{expert.PersonnelName}</h2>
                  <p>{expert.PositionName}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <button className={styles.scrollButtonRight} onClick={() => handleScroll("right")}>
            &gt;
          </button>
        </div>
      </section>

      {/* Section Đăng ký tư vấn */}
      <section className={styles.consultSection}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
        >
          Đăng ký tư vấn ngay hôm nay
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: false }}
        >
          Hãy để chúng tôi đồng hành cùng bạn trên hành trình chuyển đổi số và ứng dụng AI. Đăng ký tư vấn ngay để nhận giải pháp phù hợp nhất cho doanh nghiệp của bạn.
        </motion.p>
        <motion.button
          className={styles.consultButton}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: false }}
          onClick={() => setModalVisible(true)} // Mở modal đăng ký tư vấn
        >
          Đăng ký tư vấn
        </motion.button>
      </section>

      {/* Modal Đăng ký tư vấn */}
      <ConsultationFormModal
        visible={modalVisible}
        relatedItem={null} 
        relatedType={'service'}
        onClose={() => setModalVisible(false)}
      />
    </div>
  );
}