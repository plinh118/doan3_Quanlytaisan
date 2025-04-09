"use client";
import { motion } from "framer-motion";
import "./product.css";
import { useCallback, useEffect, useState } from "react";
import { useNotification } from "@/components/UI_shared/Notification";
import { productAPI } from "@/libs/api/product.api";
import { Get_Product } from "@/models/product.model";
import Image from "next/image";

export default function Home() {
    const { show } = useNotification();
    const [products, setProducts] = useState<Get_Product[]>([]);

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
                <h1>Sản phẩm</h1>
                <p><a href="/">Trang chủ</a> 〉Sản phẩm</p>
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
                        Danh sách sản phẩm của chúng tôi
                    </motion.h2>

                    <div className="products-grid">
                        {products.map((product) => (
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
                                        src={`/products/product-${product.ProductName}.jpg`} // Giả sử có 5 ảnh mẫu
                                        alt={product.ProductName}
                                        width={300}
                                        height={200}
                                        className="product-img"
                                    />
                                    <div className={`product-status ${product.ProductStatus.toLowerCase()}`}>
                                        {product.ProductStatus}
                                    </div>
                                </div>

                                <div className="product-info">
                                    <h3 className="product-name">{product.ProductName}</h3>
                                    <p className="product-department">{product.DepartmentName}</p>

                                    <div className="product-dates">
                                        <div className="date-item">
                                            <span className="date-label">Bắt đầu:</span>
                                            <span className="date-value">{formatDate(product.ProductStartDate)}</span>
                                        </div>
                                        <div className="date-item">
                                            <span className="date-label">Kết thúc:</span>
                                            <span className="date-value">{formatDate(product.ProductEndDate)}</span>
                                        </div>
                                    </div>

                                    <button className="product-button">
                                        Xem chi tiết
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}