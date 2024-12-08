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
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const { Search } = Input;

const BlogList = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [authors, setAuthors] = useState({});
  const [categories, setCategories] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
  const pageSize = 10; // Số bản ghi mỗi trang
  const navigate = useNavigate();
  const location = useLocation();
  const [searchText, setSearchText] = useState(
    location.state?.searchText || ""
  );
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    fetchBlogs();
    fetchAuthors();
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = blogs.filter((item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchText, blogs, authors, categories]);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/blogs/all");
      setBlogs(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách blog:", error);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/employees/all"
      );
      const authorMap = response.data.reduce((acc, employees) => {
        acc[employees.id] = employees.username;
        return acc;
      }, {});
      setAuthors(authorMap);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tác giả:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/blogcategories/all"
      );
      const categoryMap = response.data.reduce((acc, blogcategories) => {
        acc[blogcategories.id] = blogcategories.cateBlogName;
        return acc;
      }, {});
      setCategories(categoryMap);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách danh mục:", error);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);

    // Lọc dữ liệu theo từ khóa tìm kiếm
    const filtered = blogs.filter((item) =>
      item.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);

    if (value && !searchHistory.includes(value)) {
      // Cập nhật lịch sử tìm kiếm nếu giá trị mới
      setSearchHistory((prevHistory) => [value, ...prevHistory].slice(0, 5)); // Lưu tối đa 5 lịch sử
    }
  };

  useEffect(() => {
    const filtered = blogs.filter((item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchText, blogs]);

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
    navigate(`/admin/edit-blog/${record.id}`, { state: { searchText } });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/blogs/delete/${id}`);
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
      setFilteredData((prevFilteredData) =>
        prevFilteredData.filter((blog) => blog.id !== id)
      );
      notification.success({
        message: "Thành công",
        description: "Đã xóa bài viết thành công.",
      });
    } catch (error) {
      notification.error({
        message: "Lỗi xóa bài viết",
        description: error.message || "Đã xảy ra lỗi!",
      });
    }
  };

  const handleAddBlog = () => {
    navigate("/admin/add-blog", { state: { searchText } });
  };

  const handleView = (record) => {
    navigate(`/admin/blog-detail/${record.id}`, { state: { searchText } });
  };

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1, // Tính số thứ tự chính xác theo trang
      width: "5%",
      align: "center",
    },
    {
      title: <div style={{ textAlign: "center" }}>Tiêu đề</div>,
      dataIndex: "title",
      width: "25%",
      render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      width: "10%",
      align: "center",
      render: (authorId) => authors[authorId] || "Không rõ",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      width: "10%",
      align: "center",
      render: (categoryId) => categories[categoryId] || "Không danh mục",
    },
    {
      title: "Hình ảnh",
      dataIndex: "blogImage",
      render: (images) => (
        <img src={images[0]} alt="Blog" style={{ width: 50, height: 50 }} />
      ),
      width: "10%",
      align: "center",
    },
    {
      title: "Bình luận",
      dataIndex: "comments",
      render: (comments) => (
        <span>
          {Array.isArray(comments) && comments.length > 0
            ? `${comments.length} bình luận`
            : "Không có bình luận"}
        </span>
      ),
      width: "10%",
      align: "center",
    },
    {
      title: "Ngày xuất bản",
      dataIndex: "publishedDate",
      render: (text) => new Date(text).toLocaleDateString(),
      width: "10%",
      align: "center",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      render: (text) => new Date(text).toLocaleDateString(),
      width: "10%",
      align: "center",
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space size="middle">
          <EyeOutlined
            onClick={() => handleView(record)}
            style={{ cursor: "pointer", color: "green" }}
          />
          <EditOutlined
            onClick={() => handleEdit(record)}
            style={{ cursor: "pointer", color: "blue" }}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bài viết này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
          </Popconfirm>
        </Space>
      ),
      width: "15%",
      align: "center",
    },
  ];

  return (
    <div className="container">
      <h3 className="mb-4 title">Danh sách bài viết</h3>
      <div className="row mb-3">
        <div className="col-md-6">
          <Dropdown overlay={menu} trigger={["click"]}>
            <div>
              <Search
                placeholder="Tìm kiếm theo tiêu đề"
                value={searchText}
                onSearch={handleSearch}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
              />
            </div>
          </Dropdown>
        </div>
        <div className="col-md-6 text-end">
          <Button type="primary" onClick={handleAddBlog}>
            Thêm bài viết
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

export default BlogList;
