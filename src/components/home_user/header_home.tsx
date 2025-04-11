"use client";

import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./Header.module.scss"; // Import module SCSS
import Link from "next/link";

export const HeaderUser = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState("");

  // Map các route tương ứng với menu item
  const menuItems = [
    { name: "Trang chủ", path: "/vi/home_user" },
    { name: "Sản phẩm", path: "/vi/home_user/home_product" },
    { name: "Nghiên cứu", path: "/vi/home_user/home_research" },
    { name: "Đào tạo", path: "/vi/home_user/home_trainingcouse" },
  ];

  const handleClick = (item: { name: string; path: string }) => {
    setIsMenuOpen(false);
    setActiveItem(item.name);
    router.push(item.path);
  };

  useEffect(() => {
    // Xác định active item dựa trên current path
    const currentItem = menuItems.find((item) =>
      pathname?.startsWith(item.path)
    );
    if (currentItem) {
      setActiveItem(currentItem.name);
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div
        style={{
          height: "100%",
          width: "90%",
          display: "flex",
          justifyContent: "space-between",
          marginLeft: "5%",
          alignItems: "center",
        }}
      >
        <Link href='/vi/home_user'>
        <div className={styles.logo}>
          <Image
            src="/image/logo.png"
            width={130}
            height={62}
            alt="Logo"
            priority
          />
        </div>
        </Link>

        <button
          className={styles.mobileMenuBtn}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>

        <nav className={`${styles.navMenu} ${isMenuOpen ? styles.active : ""}`}>
          <ul>
            {menuItems.map((item, index) => (
              <motion.li
                key={index}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleClick(item)}
                className={activeItem === item.name ? styles.active : ""}
              >
                {item.name}
              </motion.li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};