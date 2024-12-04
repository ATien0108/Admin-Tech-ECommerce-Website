import React, { useState, useEffect } from "react";
import { Table, Input, Space, Popconfirm, Button, notification } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Taglist = () => {
  const [searchText, setSearchText] = useState("");
  const [tags, setTags] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fetch brands data when component mounts
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/tags/all");
      setTags(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu nhãn:", error);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = tags.filter((item) =>
      item.name.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  // Handle edit
  const handleEdit = (record) => {
    navigate(`/admin/edit-tag/${record.name}`);
  };

  // Handle delete

  const handleDelete = async (id) => {
    try {
      // Gửi yêu cầu xóa thương hiệu đến API
      await axios.delete(`http://localhost:8081/api/tags/delete/${id}`);

      // Cập nhật lại danh sách thương hiệu trong state
      setTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
      setFilteredData((prevFilteredData) =>
        prevFilteredData.filter((tag) => tag.id !== id)
      );

      // Thông báo thành công
      notification.success({
        message: "Thành công",
        description: "Đã xóa nhãn thành công.",
      });
    } catch (error) {
      // Xử lý lỗi và thông báo cho người dùng
      notification.error({
        message: "Lỗi xóa nhãn",
        description: error.message || "Đã xảy ra lỗi!",
      });
    }
  };

  // Navigate to add brand page
  const handleAddTag = () => {
    navigate("/admin/add-tag");
  };

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => index + 1, // Hiển thị số thứ tự bắt đầu từ 1
      width: "5%",
      align: "center",
    },
    {
      title: "Tên nhãn",
      dataIndex: "name",
      width: "10%",
      align: "center",
    },

    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (text) => formatDate(text),
      width: "12%",
      align: "center",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      render: (text) => formatDate(text),
      width: "12%",
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
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa mục này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
          </Popconfirm>
        </Space>
      ),
      width: "11%",
      align: "center",
    },
  ];

  return (
    <div className="container">
      <h3 className="mb-4 title">Danh Sách Nhãn</h3>
      <div className="row mb-3">
        <div className="col-md-6">
          <Input
            placeholder="Tìm kiếm theo tên nhãn"
            value={searchText}
            onChange={handleSearch}
            style={{ width: 300 }}
          />
        </div>
        <div className="col-md-6 text-end">
          <Button type="primary" onClick={handleAddTag}>
            Thêm nhãn
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default Taglist;
