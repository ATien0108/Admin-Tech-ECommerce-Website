import React, { useState, useEffect } from "react";
import { Table, Input, Space, Popconfirm, Button, notification } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const BlogList = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [authors, setAuthors] = useState({});
  const [categories, setCategories] = useState({});
  const navigate = useNavigate();

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

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleEdit = (record) => {
    navigate(`/admin/edit-blog/${record.id}`);
  };

  const handleDelete = async (id) => {
    try {
      // Gửi yêu cầu xóa bài viết đến API
      await axios.delete(`http://localhost:8081/api/blogs/delete/${id}`);

      // Cập nhật lại danh sách bài viết trong state
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
      setFilteredData((prevFilteredData) =>
        prevFilteredData.filter((blog) => blog.id !== id)
      );

      // Thông báo thành công
      notification.success({
        message: "Thành công",
        description: "Đã xóa bài viết thành công.",
      });
    } catch (error) {
      // Xử lý lỗi và thông báo cho người dùng
      notification.error({
        message: "Lỗi xóa bài viết",
        description: error.message || "Đã xảy ra lỗi!",
      });
    }
  };

  const handleAddBlog = () => {
    navigate("/admin/add-blog");
  };

  const handleView = (record) => {
    navigate(`/admin/blog-detail/${record.id}`);
  };

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => index + 1, // Hiển thị số thứ tự
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
      title: <div style={{ textAlign: "center" }}>Nội dung</div>,
      dataIndex: "content",
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
            height: "50px", // Chiều cao cố định cho ô
            lineHeight: "25px", // Căn chỉnh văn bản theo chiều dọc
          }}
          dangerouslySetInnerHTML={{
            __html: text,
          }}
        />
      ),
    },

    {
      title: "Danh mục",
      dataIndex: "category",
      width: "10%",
      align: "center",
      render: (categoryId) => categories[categoryId] || "Không danh mục",
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
          <Input
            placeholder="Tìm kiếm theo tiêu đề"
            value={searchText}
            onChange={handleSearch}
            style={{ width: 300 }}
          />
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
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default BlogList;
