import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Space,
  Popconfirm,
  Button,
  notification,
  Modal,
  Spin,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Couponlist = () => {
  const [searchText, setSearchText] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Format ngày
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fetch danh sách coupon
  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8081/api/coupons/all");
      const updatedCoupons = response.data.map((coupon) => ({
        ...coupon,
        active: coupon.active === true || coupon.active === 1, // Ép kiểu cho đúng
      }));
      setCoupons(updatedCoupons);
      setFilteredData(updatedCoupons);
    } catch (error) {
      notification.error({
        message: "Lỗi tải dữ liệu",
        description:
          error.response?.data || "Không thể tải danh sách mã giảm giá!",
      });
    } finally {
      setLoading(false);
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = coupons.filter((item) =>
      item.code.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  // Xử lý chỉnh sửa
  const handleEdit = (record) => {
    navigate(`/admin/edit-coupon/${record.id}`);
  };

  // Xử lý xóa coupon
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8081/api/coupons/delete/${id}`
      );
      if (response.status === 204) {
        notification.success({
          message: "Thành công",
          description: "Đã xóa mã giảm giá thành công.",
        });
        setCoupons((prevCoupons) =>
          prevCoupons.filter((coupon) => coupon.id !== id)
        );
        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((coupon) => coupon.id !== id)
        );
      }
    } catch (error) {
      notification.error({
        message: "Lỗi xóa mã giảm giá",
        description: error.response?.data || "Không thể xóa mã giảm giá!",
      });
    }
  };

  // Chuyển đến trang thêm coupon
  const handleAddCoupon = () => {
    navigate("/admin/add-coupon");
  };

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => index + 1,
      key: "index",
      width: "5%",
      align: "center",
    },
    {
      title: "Mã giảm giá",
      dataIndex: "code",
      key: "code",
      width: "15%",
      align: "center",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: "30%",
      align: "center",
      render: (text) => (
        <div
          style={{
            textAlign: "left",
            display: "-webkit-box",
            overflow: "hidden",
            textOverflow: "ellipsis",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Loại giảm giá",
      dataIndex: "discountType",
      key: "discountType",
      width: "10%",
      align: "center",
    },
    {
      title: "Giảm giá",
      dataIndex: "discountValue",
      key: "discountValue",
      render: (text, record) => {
        if (record.discountType === "PERCENTAGE") {
          return `${text}%`; // Hiển thị phần trăm
        } else {
          return `${text.toLocaleString()} VND`; // Hiển thị tiền tệ (VND)
        }
      },
      width: "10%",
      align: "center",
    },

    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => formatDate(text),
      width: "12%",
      align: "center",
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "endDate",
      key: "endDate",
      render: (text) => formatDate(text),
      width: "12%",
      align: "center",
    },
    {
      title: "Số lượng",
      dataIndex: "usageLimit",
      key: "usageLimit",
      width: "10%",
      align: "center",
    },
    {
      title: "Số lần đã dùng",
      dataIndex: "usageCount",
      key: "usageCount",
      width: "10%",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (text, record) => {
        if (record.active === true || record.active === 1) {
          return `Đang hoạt động`;
        } else {
          return `Dừng hoạt động`;
        }
      },
      width: "10%",
      align: "center",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined
            onClick={() => handleEdit(record)}
            style={{ cursor: "pointer", color: "blue" }}
          />
          <DeleteOutlined
            onClick={() => handleDelete(record.id)}
            style={{ cursor: "pointer", color: "red" }}
          />
        </Space>
      ),
      width: "12%",
      align: "center",
    },
  ];

  return (
    <div className="container">
      <h3 className="mb-4 title">Danh Sách Mã Giảm Giá</h3>
      <div className="row mb-3">
        <div className="col-md-6">
          <Input
            placeholder="Tìm kiếm theo mã giảm giá"
            value={searchText}
            onChange={handleSearch}
            style={{ width: 300 }}
          />
        </div>
        <div className="col-md-6 text-end">
          <Button type="primary" onClick={handleAddCoupon}>
            Thêm mã giảm giá
          </Button>
        </div>
      </div>
      {loading ? (
        <Spin tip="Đang tải dữ liệu..." size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredData.map((item) => ({
            ...item,
            key: item.id,
          }))}
          pagination={{ pageSize: 10 }}
          bordered
        />
      )}
    </div>
  );
};

export default Couponlist;