import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Table, Input, Space, Button, notification, Modal, Spin } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const CategoryList = () => {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const navigate = useNavigate();

  // Lấy danh sách danh mục
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true); // Hiển thị trạng thái loading
    try {
      const response = await axios.get(
        "http://localhost:8081/api/categories/all"
      );
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      notification.error({
        message: "Lỗi tải dữ liệu",
        description:
          error.response?.data || "Không thể tải danh sách danh mục!",
      });
    } finally {
      setLoading(false); // Ẩn trạng thái loading
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = data.filter((item) =>
      item.cateName.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  // Xử lý chỉnh sửa
  const handleEdit = (record) => {
    navigate(`/admin/edit-category/${record.cateName}`, {
      state: { id: record.id },
    });
  };

  // Xử lý xóa danh mục

  const handleDelete = async (id) => {
    try {
      // Gửi yêu cầu xóa
      const response = await axios.delete(
        `http://localhost:8081/api/categories/delete/${id}`
      );

      if (response.status === 204) {
        notification.success({
          message: "Thành công",
          description: "Đã xóa danh mục thành công.",
        });
        // Cập nhật danh sách
        setData((prevCategories) =>
          prevCategories.filter((category) => category.id !== id)
        );
        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((category) => category.id !== id)
        );
      }
    } catch (error) {
      if (error.response?.status === 409) {
        // Hiển thị modal yêu cầu xác nhận
        Modal.confirm({
          title: "Xác nhận xóa",
          content: error.response.data, // Thông báo từ back-end
          okText: "Có",
          cancelText: "Không",
          onOk: async () => {
            try {
              // Gửi lại yêu cầu xóa với forceDelete=true
              await axios.delete(
                `http://localhost:8081/api/categories/delete/${id}?forceDelete=true`
              );
              notification.success({
                message: "Thành công",
                description: "Đã xóa danh mục thành công.",
              });
              // Cập nhật danh sách
              setData((prevCategories) =>
                prevCategories.filter((category) => category.id !== id)
              );
              setFilteredData((prevFilteredData) =>
                prevFilteredData.filter((category) => category.id !== id)
              );
            } catch (forceError) {
              notification.error({
                message: "Lỗi xóa danh mục",
                description:
                  forceError.response?.data || "Không thể xóa danh mục!",
              });
            }
          },
        });
      } else {
        notification.error({
          message: "Lỗi xóa danh mục",
          description: error.response?.data || "Không thể xóa danh mục!",
        });
      }
    }
  };

  const handleAddCategory = () => {
    navigate("/admin/add-category");
  };

  const columns = [
    { title: "STT", render: (_, __, index) => index + 1, align: "center" },
    { title: "Tên Danh Mục", dataIndex: "cateName", align: "center" },
    {
      title: "Hình Ảnh",
      dataIndex: "cateImage",
      render: (text) => (
        <img src={text} alt="category" style={{ width: "50px" }} />
      ),
      align: "center",
    },
    {
      title: <div style={{ textAlign: "center" }}>Mô tả</div>,
      dataIndex: "cateDesc",
      width: "25%", // Giảm chiều rộng của cột
      render: (text) => (
        <div
          style={{
            textAlign: "left",
            display: "-webkit-box", // Đảm bảo phần tử là box
            overflow: "hidden", // Ẩn phần tràn
            textOverflow: "ellipsis", // Hiển thị dấu ba chấm khi bị cắt
            WebkitLineClamp: 2, // Giới hạn số dòng (2 dòng trong trường hợp này)
            WebkitBoxOrient: "vertical", // Đảm bảo văn bản chỉ hiển thị theo chiều dọc
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdAt",
      render: (date) => moment(date).format("DD/MM/YYYY"),
      align: "center",
    },
    {
      title: "Ngày Cập Nhật",
      dataIndex: "updatedAt",
      render: (date) => moment(date).format("DD/MM/YYYY"),
      align: "center",
    },
    {
      title: "Hành động",
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
      width: "11%",
      align: "center",
    },
  ];

  return (
    <div className="container">
      <h3 className="mb-4 title">Danh Sách Danh Mục</h3>
      <div className="row mb-3">
        <div className="col-md-6">
          <Input
            placeholder="Tìm kiếm theo tên danh mục"
            value={searchText}
            onChange={handleSearch}
            style={{ width: 300 }}
          />
        </div>
        <div className="col-md-6 text-end">
          <Button type="primary" onClick={handleAddCategory}>
            Thêm Danh Mục
          </Button>
        </div>
      </div>
      {loading ? (
        <Spin tip="Đang tải dữ liệu..." size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredData.map((item, index) => ({
            ...item,
            key: index + 1,
          }))}
          pagination={{ pageSize: 10 }}
          bordered
        />
      )}
    </div>
  );
};

export default CategoryList;
