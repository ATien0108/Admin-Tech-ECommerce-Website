import React, { useEffect, useState } from "react";
import axios from "axios";
import { Column } from "@ant-design/plots";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [topRatedProducts, setTopRatedProducts] = useState([]);

  // Hàm định dạng tiền tệ VND
  const formatCurrency = (value, decimals = 0) => {
    const roundedValue = parseFloat(value).toFixed(decimals); // Làm tròn số thập phân
    return new Intl.NumberFormat("vi-VN").format(roundedValue) + " VND";
  };

  useEffect(() => {
    // Lấy danh sách đơn hàng từ API
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/orders/all"
        );
        const allOrders = response.data;

        // Lọc các đơn hàng có trạng thái "Delivered"
        const deliveredOrders = allOrders.filter(
          (order) => order.status === "Đã giao hàng"
        );

        setOrders(deliveredOrders);

        // Tính toán tổng doanh thu, giá trị trung bình và số đơn hàng
        const total = deliveredOrders.reduce((acc, order) => {
          return acc + (order.totalAmount - order.shippingCost);
        }, 0);

        setTotalRevenue(total);
        setAverageOrderValue(
          deliveredOrders.length > 0 ? total / deliveredOrders.length : 0
        );
        setTotalOrders(deliveredOrders.length);

        // Tổng hợp dữ liệu theo tháng
        const monthlyRevenue = {};
        deliveredOrders.forEach((order) => {
          const month = new Date(order.orderCreatedAt).getMonth() + 1; // Lấy tháng (0-11, cần +1)
          const revenue = order.totalAmount - order.shippingCost;
          monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenue;
        });

        // Chuyển dữ liệu thành mảng để hiển thị biểu đồ
        const monthlyDataArray = Array.from({ length: 12 }, (_, i) => ({
          type: `Tháng ${i + 1}`,
          sales: monthlyRevenue[i + 1] || 0, // Giá trị mặc định là 0 nếu không có dữ liệu
        }));
        setMonthlyData(monthlyDataArray);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    // Hàm lấy danh sách sản phẩm
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/products"); // API lấy thông tin sản phẩm
        const products = response.data;

        // Sắp xếp các sản phẩm theo rating.average giảm dần
        const topProducts = products
          .sort((a, b) => b.ratings.average - a.ratings.average)
          .slice(0, 3); // Lấy top 3 sản phẩm

        setTopRatedProducts(topProducts);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  const config = {
    data: monthlyData,
    xField: "type",
    yField: "sales",
    color: () => "#ffd333",
    label: {
      position: "top",
      style: {
        fill: "#FFFFFF",
        opacity: 1,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: { alias: "Tháng" },
      sales: { alias: "Doanh thu" },
    },
    tooltip: {
      formatter: (datum) => ({
        name: "Doanh thu",
        value: formatCurrency(datum.sales), // Định dạng tooltip hiển thị VND
      }),
    },
  };

  return (
    <div className="container mt-4">
      <div className="row g-3">
        <div className="col-12 col-md-4">
          <div className="bg-white p-3 rounded-3">
            <p className="desc">Tổng doanh thu</p>
            <h4 className="mb-0 sub-title">{formatCurrency(totalRevenue)}</h4>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="bg-white p-3 rounded-3">
            <p className="desc">Giá trị đơn hàng trung bình</p>
            <h4 className="mb-0 sub-title">
              {formatCurrency(averageOrderValue)}
            </h4>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="bg-white p-3 rounded-3">
            <p className="desc">Tổng số đơn hàng</p>
            <h4 className="mb-0 sub-title">{totalOrders}</h4>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="mb-4 title">Thống kê doanh thu</h3>
        <div>
          <Column {...config} />
        </div>
      </div>

      <div className="mt-4">
        <h3 className="mb-4 title">Top 3 sản phẩm có lượt đánh giá cao nhất</h3>
        <div
          className="bg-white p-3 rounded-3"
          style={{ width: "530px", height: "auto" }}
        >
          {topRatedProducts.length > 0 ? (
            <ul className="list-unstyled">
              {topRatedProducts.map((product) => (
                <li key={product.id} className="mb-3">
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ marginBottom: "10px" }}
                  >
                    {/* Phần hình ảnh và tên sản phẩm ở bên trái */}
                    <div
                      className="d-flex align-items-center"
                      style={{ flex: "1", marginRight: "20px" }} // Đảm bảo khoảng cách giữa tên và sao
                    >
                      <img
                        src={product.mainImage}
                        alt={product.productName}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                      <span
                        className="ms-2"
                        style={{
                          textAlign: "left",
                          display: "block",
                          marginTop: "5px",
                        }}
                      >
                        {product.productName}
                      </span>
                    </div>

                    {/* Phần số sao ở phía bên phải */}
                    <span
                      className="d-flex align-items-center"
                      style={{ flexShrink: 0 }}
                    >
                      {Array.from({ length: 5 }, (_, index) => {
                        const filled =
                          index < Math.floor(product.ratings.average); // Sao đầy
                        const halfFilled =
                          index === Math.floor(product.ratings.average) &&
                          product.ratings.average % 1 !== 0; // Sao lấp đầy một nửa
                        return (
                          <span
                            key={index}
                            className="star"
                            style={{
                              color: filled
                                ? "#FFD700"
                                : halfFilled
                                ? "#FFD700"
                                : "#ccc",
                              fontSize: "1.5rem",
                              position: "relative",
                              marginLeft: "5px", // Tạo khoảng cách giữa các sao
                            }}
                          >
                            {filled ? "★" : halfFilled ? "☆" : "☆"}
                            {halfFilled && (
                              <span
                                style={{
                                  position: "absolute",
                                  top: "0",
                                  left: "0",
                                  width: "50%",
                                  overflow: "hidden",
                                  color: "#FFD700",
                                }}
                              >
                                ★
                              </span>
                            )}
                          </span>
                        );
                      })}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Không có sản phẩm nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
