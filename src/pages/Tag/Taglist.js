import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Space,
  Popconfirm,
  Button,
  notification,
  Menu,
  Dropdown,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const { Search } = Input;

const Taglist = () => {
  const [tags, setTags] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
  const pageSize = 10; // Số bản ghi mỗi trang
  const navigate = useNavigate();
  const location = useLocation();
  const [searchText, setSearchText] = useState(
    location.state?.searchText || ""
  );
  const [searchHistory, setSearchHistory] = useState([]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fetch tags data when component mounts
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

  const handleSearch = (value) => {
    setSearchText(value);

    // Lọc dữ liệu theo từ khóa tìm kiếm
    const filtered = tags.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);

    if (value && !searchHistory.includes(value)) {
      // Cập nhật lịch sử tìm kiếm nếu giá trị mới
      setSearchHistory((prevHistory) => [value, ...prevHistory].slice(0, 5)); // Lưu tối đa 5 lịch sử
    }
  };

  useEffect(() => {
    const filtered = tags.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchText, tags]);

  const menu = (
    <Menu>
      {searchHistory.map((item, index) => (
        <Menu.Item key={index} onClick={() => setSearchText(item)}>
          {item}
        </Menu.Item>
      ))}
    </Menu>
  );

  // Handle edit
  const handleEdit = (record) => {
    navigate(`/admin/edit-tag/${record.name}`, { state: { searchText } });
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/tags/delete/${id}`);
      setTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
      setFilteredData((prevFilteredData) =>
        prevFilteredData.filter((tag) => tag.id !== id)
      );
      notification.success({
        message: "Thành công",
        description: "Đã xóa nhãn thành công.",
      });
    } catch (error) {
      notification.error({
        message: "Lỗi xóa nhãn",
        description: error.message || "Đã xảy ra lỗi!",
      });
    }
  };

  // Handle pagination change
  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };

  // Columns configuration
  const columns = [
    {
      title: "STT",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1, // Tính số thứ tự chính xác theo trang
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

  // Navigate to add new tag page
  const handleAddTag = () => {
    navigate("/admin/add-tag", { state: { searchText } });
  };

  return (
    <div className="container">
      <h3 className="mb-4 title">Danh Sách Nhãn</h3>
      <div className="row mb-3">
        <div className="col-md-6">
          <Dropdown overlay={menu} trigger={["click"]}>
            <div>
              <Search
                placeholder="Tìm kiếm theo tên nhãn"
                value={searchText}
                onSearch={handleSearch}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
              />
            </div>
          </Dropdown>
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
        pagination={{
          pageSize,
          current: currentPage,
          onChange: handlePaginationChange,
          total: filteredData.length,
        }}
        bordered
      />
    </div>
  );
};

export default Taglist;
