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

const AdvertisementList = () => {
  const [searchText, setSearchText] = useState("");
  const [advertisements, setAdvertisements] = useState([]);
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

  // Fetch danh sách quảng cáo
  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    setLoading(true); // Hiển thị trạng thái loading
    try {
      const response = await axios.get(
        "http://localhost:8081/api/advertisement/all"
      );
      setAdvertisements(response.data);
      setFilteredData(response.data);
    } catch (error) {
      notification.error({
        message: "Lỗi tải dữ liệu",
        description:
          error.response?.data || "Không thể tải danh sách quảng cáo!",
      });
    } finally {
      setLoading(false); // Ẩn trạng thái loading
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = advertisements.filter(
      (item) =>
        item.mainAdv.some((adv) =>
          adv.description.toLowerCase().includes(value)
        ) || // Tìm kiếm trong mô tả quảng cáo chính
        item.subAdv.some((adv) => adv.description.toLowerCase().includes(value)) // Tìm kiếm trong mô tả quảng cáo phụ
    );
    setFilteredData(filtered);
  };

  // Xử lý chỉnh sửa
  const handleEdit = (record) => {
    navigate(`/admin/edit-advertisement/${record.id}`);
  };

  // Xử lý xóa quảng cáo
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8081/api/advertisement/delete/${id}`
      );
      if (response.status === 204) {
        notification.success({
          message: "Thành công",
          description: "Đã xóa quảng cáo thành công.",
        });
        setAdvertisements((prevAdvertisements) =>
          prevAdvertisements.filter((advertisement) => advertisement.id !== id)
        );
        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((advertisement) => advertisement.id !== id)
        );
      }
    } catch (error) {
      notification.error({
        message: "Lỗi xóa quảng cáo",
        description: error.response?.data || "Không thể xóa quảng cáo!",
      });
    }
  };

  // Chuyển đến trang thêm quảng cáo
  const handleAddAdvertisement = () => {
    navigate("/admin/add-advertisement");
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
      title: "Hình ảnh Quảng cáo chính",
      key: "mainAdvImage",
      render: (text, record) => (
        <div>
          {record.mainAdv.map((adv, index) => (
            <div key={index}>
              <img
                src={adv.image}
                alt={`Main Ad Image ${index + 1}`}
                style={{ width: 80, marginBottom: 8 }}
              />
            </div>
          ))}
        </div>
      ),
      width: "15%",
      align: "center",
    },
    {
      title: "Mô tả Quảng cáo chính",
      key: "mainAdvDescription",
      render: (text, record) => (
        <div>
          {record.mainAdv.map((adv, index) => (
            <div key={index}>
              <span>{adv.description}</span>
              {index !== record.mainAdv.length - 1 && (
                <hr style={{ margin: "8px 0", borderTop: "1px solid #ccc" }} />
              )}
            </div>
          ))}
        </div>
      ),
      width: "15%",
      align: "center",
    },
    {
      title: "Hình ảnh Quảng cáo phụ",
      key: "subAdvImage",
      render: (text, record) => (
        <div>
          {record.subAdv.map((adv, index) => (
            <div key={index}>
              <img
                src={adv.image}
                alt={`Sub Ad Image ${index + 1}`}
                style={{ width: 80, marginBottom: 8 }}
              />
            </div>
          ))}
        </div>
      ),
      width: "15%",
      align: "center",
    },
    {
      title: "Mô tả Quảng cáo phụ",
      key: "subAdvDescription",
      render: (text, record) => (
        <div>
          {record.subAdv.map((adv, index) => (
            <div key={index}>
              <span>{adv.description}</span>
              {index !== record.subAdv.length - 1 && (
                <hr style={{ margin: "8px 0", borderTop: "1px solid #ccc" }} />
              )}
            </div>
          ))}
        </div>
      ),
      width: "15%",
      align: "center",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => formatDate(text),
      width: "10%",
      align: "center",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => formatDate(text),
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
      <h3 className="mb-4 title">Danh Sách Quảng Cáo</h3>
      <div className="row mb-3">
        <div className="col-md-6">
          <Input
            placeholder="Tìm kiếm theo mô tả quảng cáo"
            value={searchText}
            onChange={handleSearch}
            style={{ width: 300 }}
          />
        </div>
        <div className="col-md-6 text-end">
          <Button type="primary" onClick={handleAddAdvertisement}>
            Thêm quảng cáo
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

export default AdvertisementList;
