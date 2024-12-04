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

const Brandlist = () => {
  const [searchText, setSearchText] = useState("");
  const [brands, setBrands] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const navigate = useNavigate();

  // Format ngày
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fetch danh sách thương hiệu
  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true); // Hiển thị trạng thái loading
    try {
      const response = await axios.get("http://localhost:8081/api/brands/all");
      setBrands(response.data);
      setFilteredData(response.data);
    } catch (error) {
      notification.error({
        message: "Lỗi tải dữ liệu",
        description:
          error.response?.data || "Không thể tải danh sách thương hiệu!",
      });
    } finally {
      setLoading(false); // Ẩn trạng thái loading
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = brands.filter((item) =>
      item.brandName.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  // Xử lý chỉnh sửa
  const handleEdit = (record) => {
    navigate(`/admin/edit-brand/${record.brandName}`);
  };

  // Xử lý xóa thương hiệu
  const handleDelete = async (id) => {
    try {
      // Gửi yêu cầu xóa
      const response = await axios.delete(
        `http://localhost:8081/api/brands/delete/${id}`
      );

      if (response.status === 204) {
        notification.success({
          message: "Thành công",
          description: "Đã xóa thương hiệu thành công.",
        });
        // Cập nhật danh sách
        setBrands((prevBrands) =>
          prevBrands.filter((brand) => brand.id !== id)
        );
        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((brand) => brand.id !== id)
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
                `http://localhost:8081/api/brands/delete/${id}?forceDelete=true`
              );
              notification.success({
                message: "Thành công",
                description: "Đã xóa thương hiệu thành công.",
              });
              // Cập nhật danh sách
              setBrands((prevBrands) =>
                prevBrands.filter((brand) => brand.id !== id)
              );
              setFilteredData((prevFilteredData) =>
                prevFilteredData.filter((brand) => brand.id !== id)
              );
            } catch (forceError) {
              notification.error({
                message: "Lỗi xóa thương hiệu",
                description:
                  forceError.response?.data || "Không thể xóa thương hiệu!",
              });
            }
          },
        });
      } else {
        notification.error({
          message: "Lỗi xóa thương hiệu",
          description: error.response?.data || "Không thể xóa thương hiệu!",
        });
      }
    }
  };

  // Chuyển đến trang thêm thương hiệu
  const handleAddBrand = () => {
    navigate("/admin/add-brand");
  };

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => index + 1,
      key: "index", // Đảm bảo React không cảnh báo
      width: "5%",
      align: "center",
    },
    {
      title: "Tên thương hiệu",
      dataIndex: "brandName",
      key: "brandName",
      width: "15%",
      align: "center",
    },
    {
      title: <div style={{ textAlign: "center" }}>Mô tả</div>,
      dataIndex: "brandDesc",
      key: "brandDesc",
      width: "30%",
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
      title: "Hình ảnh",
      dataIndex: "brandImage",
      key: "brandImage",
      render: (text) => (
        <img src={text} alt="Brand" style={{ width: "50px" }} />
      ),
      width: "10%",
      align: "center",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => formatDate(text),
      width: "12%",
      align: "center",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => formatDate(text),
      width: "12%",
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
      <h3 className="mb-4 title">Danh Sách Thương Hiệu</h3>
      <div className="row mb-3">
        <div className="col-md-6">
          <Input
            placeholder="Tìm kiếm theo tên thương hiệu"
            value={searchText}
            onChange={handleSearch}
            style={{ width: 300 }}
          />
        </div>
        <div className="col-md-6 text-end">
          <Button type="primary" onClick={handleAddBrand}>
            Thêm thương hiệu
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
            key: item.id, // Đảm bảo mỗi hàng có key duy nhất
          }))}
          pagination={{ pageSize: 10 }}
          bordered
        />
      )}
    </div>
  );
};

export default Brandlist;
