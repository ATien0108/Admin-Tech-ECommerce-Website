import React, { useEffect, useState } from "react";
import { Table, Button, Spin } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const formatCurrency = (amount) => {
  return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}₫`;
};

const columns = (handleView) => [
  {
    title: "STT",
    dataIndex: "key",
    key: "key",
    align: "center",
  },
  {
    title: "Người mua",
    dataIndex: "fullName",
    key: "fullName",
    align: "center",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    align: "center",
  },
  {
    title: "Tên sản phẩm",
    key: "productName",
    render: (_, record) =>
      record?.items?.length > 0 ? (
        <div>
          {record.items.map((item, index) => (
            <div key={index}>{item.productName || "Không xác định"}</div>
          ))}
        </div>
      ) : (
        "Không có sản phẩm"
      ),
  },
  {
    title: "Số lượng",
    key: "quantity",
    render: (_, record) =>
      record?.items
        ? record.items.reduce((total, item) => total + item.quantity, 0)
        : 0,
    align: "center",
  },
  {
    title: "Tổng tiền",
    dataIndex: "totalAmount",
    key: "totalAmount",
    render: (totalAmount) =>
      totalAmount ? `${formatCurrency(totalAmount)} ` : "0 VND",
    align: "center",
  },
  {
    title: "Mã giảm giá",
    dataIndex: "coupon",
    key: "coupon",
    align: "center",
    render: (coupon) => (coupon ? coupon : "Không có mã giảm giá"),
  },

  {
    title: "Địa chỉ giao hàng",
    key: "shippingAddress",
    render: (_, record) => {
      const address = record.shippingAddress;
      return address ? (
        <div>
          {address.street}, {address.communes}, {address.district},{" "}
          {address.city}, {address.country}
        </div>
      ) : (
        "Không có địa chỉ"
      );
    },
    align: "center",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <span
        style={{
          color:
            status === "Hoàn thành"
              ? "green"
              : status === "Chờ xử lý"
              ? "orange"
              : "red",
          fontWeight: "bold",
        }}
      >
        {status || "Không có trạng thái"}
      </span>
    ),
    align: "center",
  },
  {
    title: "Hành động",
    key: "action",
    render: (text, record) => (
      <Button
        type="link"
        icon={<EyeOutlined />}
        onClick={() => handleView(record)}
      >
        Xem
      </Button>
    ),
    align: "center",
  },
];

const Orderslist = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleView = (record) => {
    navigate(`/admin/order-details/${record.id}`);
  };

  const fetchProductName = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/products/${id}`
      );
      return response.data.productName;
    } catch (error) {
      console.error("Error fetching product name:", error);
      return "Không xác định";
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/orders/all");
      const ordersData = await Promise.all(
        response.data.map(async (order, index) => {
          // Fetch product names for each item
          const itemsWithNames = await Promise.all(
            order.items.map(async (item) => {
              const productName = await fetchProductName(item.product);
              return { ...item, productName };
            })
          );

          return {
            key: index + 1,
            ...order,
            items: itemsWithNames, // Replace items with items including productName
          };
        })
      );

      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-4 title">Danh sách Đơn hàng</h3>
      <div className="table-responsive">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns(handleView)}
            dataSource={orders}
            pagination={{ pageSize: 10 }}
            scroll={{ x: true }}
          />
        )}
      </div>
    </div>
  );
};

export default Orderslist;
