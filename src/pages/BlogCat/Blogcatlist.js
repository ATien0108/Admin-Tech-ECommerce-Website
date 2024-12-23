import React, { useEffect, useState } from "react";
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
import "bootstrap/dist/css/bootstrap.min.css";

const { Search } = Input;

const Blogcatlist = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchText, setSearchText] = useState(
    location.state?.searchText || ""
  );
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/blogcategories/all"
      );
      setData(response.data);
      setFilteredData(response.data); // Khởi tạo dữ liệu lọc
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);

    // Lọc dữ liệu theo từ khóa tìm kiếm
    const filtered = data.filter((item) =>
      item.cateBlogName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);

    if (value && !searchHistory.includes(value)) {
      // Cập nhật lịch sử tìm kiếm nếu giá trị mới
      setSearchHistory((prevHistory) => [value, ...prevHistory].slice(0, 5)); // Lưu tối đa 5 lịch sử
    }
  };

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.cateBlogName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchText]);

  const menu = (
    <Menu>
      {searchHistory.map((item, index) => (
        <Menu.Item key={index} onClick={() => setSearchText(item)}>
          {item}
        </Menu.Item>
      ))}
    </Menu>
  );

  const handleEdit = (record) => {
    navigate(`/admin/edit-blog-cat/${record.id}`, { state: { searchText } }); // Điều hướng tới trang chỉnh sửa với ID
  };

  const handleDelete = async (id) => {
    try {
      // Gửi yêu cầu xóa danh mục blog đến API
      await axios.delete(
        `http://localhost:8081/api/blogcategories/delete/${id}`
      );

      // Cập nhật lại danh sách danh mục trong state
      setFilteredData((prevFilteredData) =>
        prevFilteredData.filter((category) => category.id !== id)
      );

      // Thông báo thành công
      notification.success({
        message: "Thành công",
        description: "Đã xóa danh mục blog thành công.",
      });
    } catch (error) {
      // Xử lý lỗi và thông báo cho người dùng
      notification.error({
        message: "Lỗi xóa danh mục blog",
        description:
          error.response?.data?.message || error.message || "Đã xảy ra lỗi!",
      });
    }
  };

  const handleAddBlogCat = () => {
    navigate("/admin/add-blog-category", { state: { searchText } });
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      render: (_, __, index) => index + 1, // Hiển thị chỉ mục dòng
      width: "3%",
      align: "center",
    },
    {
      title: "Tên Danh Mục Bài Viết",
      dataIndex: "cateBlogName",
      width: "10%",
      align: "center",
    },

    {
      title: <div style={{ textAlign: "center" }}>Mô tả</div>,
      dataIndex: "cateBlogDesc",
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
      render: (text) => new Date(text).toLocaleDateString(), // Định dạng ngày tháng
      width: "10%",
      align: "center",
    },
    {
      title: "Ngày Cập Nhật",
      dataIndex: "updatedAt",
      render: (text) => new Date(text).toLocaleDateString(), // Định dạng ngày tháng
      width: "10%",
      align: "center",
    },
    {
      title: "Hành Động",
      dataIndex: "actions",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined
            onClick={() => handleEdit(record)}
            style={{ cursor: "pointer", color: "blue" }}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa mục này?"
            onConfirm={() => handleDelete(record.id)} // Sử dụng id để xóa
            okText="Có"
            cancelText="Không"
          >
            <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
          </Popconfirm>
        </Space>
      ),
      width: "10%",
      align: "center",
    },
  ];

  return (
    <div className="container">
      <h3 className="mb-4 title">Danh Sách Danh Mục Bài Viết</h3>
      <div className="row mb-3">
        <div className="col-md-6">
          <Dropdown overlay={menu} trigger={["click"]}>
            <div>
              <Search
                placeholder="Tìm kiếm theo tên danh mục bài viết"
                value={searchText}
                onSearch={handleSearch}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
              />
            </div>
          </Dropdown>
        </div>
        <div className="col-md-6 text-end">
          <Button
            type="primary"
            onClick={handleAddBlogCat} // Xử lý nút thêm danh mục blog
          >
            Thêm Danh Mục Blog
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

export default Blogcatlist;
