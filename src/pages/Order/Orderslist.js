import React, { useEffect, useState } from "react";
import { Table, Button, Spin, Menu, Dropdown, Input } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const { Search } = Input;

// Định dạng tiền tệ
const formatCurrency = (amount) => {
  return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}₫`;
};

// Định nghĩa cột bảng
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
    title: <div style={{ textAlign: "center" }}>Tên sản phẩm</div>,
    key: "productName",
    render: (_, record) =>
      record?.items?.length > 0 ? (
        <div style={{ textAlign: "left" }}>
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
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState(
    location.state?.searchText || ""
  );
  const [searchHistory, setSearchHistory] = useState([]);

  // Hàm chuyển hướng đến chi tiết đơn hàng
  const handleView = (record) => {
    navigate(`/admin/order-details/${record.id}`, { state: { searchText } });
  };

  // Lấy tên sản phẩm từ API
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

  // Hàm tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);

    // Lọc dữ liệu theo từ khóa
    const filtered = orders.filter((item) => {
      const fullNameMatch = item.fullName
        ?.toLowerCase()
        .includes(value.toLowerCase());
      const phoneMatch = item.phoneNumber
        ?.toLowerCase()
        ?.includes(value.toLowerCase());
      const productNameMatch = item.items.some((subItem) =>
        subItem.productName.toLowerCase().includes(value.toLowerCase())
      );

      return fullNameMatch || phoneMatch || productNameMatch;
    });

    setFilteredData(filtered);

    // Lưu lịch sử tìm kiếm (tối đa 5 mục)
    if (value && !searchHistory.includes(value)) {
      setSearchHistory((prevHistory) => [value, ...prevHistory].slice(0, 5));
    }
  };

  // Tải danh sách đơn hàng
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/orders/all");
      const ordersData = await Promise.all(
        response.data.map(async (order, index) => {
          const itemsWithNames = await Promise.all(
            order.items.map(async (item) => {
              const productName = await fetchProductName(item.product);
              return { ...item, productName };
            })
          );

          return {
            key: index + 1,
            ...order,
            items: itemsWithNames,
          };
        })
      );

      setOrders(ordersData);
      setFilteredData(ordersData); // Khởi tạo dữ liệu lọc
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component được mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Menu lịch sử tìm kiếm
  const menu = (
    <Menu>
      {searchHistory.map((item, index) => (
        <Menu.Item key={index} onClick={() => handleSearch(item)}>
          {item}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className="container mt-4">
      <h3 className="mb-4 title">Danh sách Đơn hàng</h3>
      <div className="table-responsive">
        <div className="col-md-6">
          <Dropdown overlay={menu} trigger={["click"]}>
            <div>
              <Search
                placeholder="Tìm kiếm theo tên người mua"
                value={searchText}
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 300 }}
              />
            </div>
          </Dropdown>
        </div>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns(handleView)}
            dataSource={filteredData} // Dữ liệu đã lọc
            pagination={{ pageSize: 10 }}
            scroll={{ x: true }}
          />
        )}
      </div>
    </div>
  );
};

export default Orderslist;
