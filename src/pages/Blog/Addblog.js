import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { message, Select, Button } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const { Option } = Select;

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [images, setImages] = useState([]); // Mảng chứa tệp hình ảnh
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const searchText = location.state?.searchText || "";

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesRes, authorsRes, blogsRes] = await Promise.all([
          axios.get("http://localhost:8081/api/blogcategories/all"),
          axios.get("http://localhost:8081/api/employees/all"),
          axios.get("http://localhost:8081/api/blogs/all"),
        ]);
        setCategories(categoriesRes.data);
        setAuthors(authorsRes.data);
        setBlogs(blogsRes.data);
      } catch (error) {
        message.error("Lỗi khi tải dữ liệu.");
      }
    };
    fetchInitialData();
  }, []);

  const handleDesc = (value) => {
    setContent(value);
  };

  // Handle image upload with validation
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter((file) => file.type.startsWith("image/"));

    if (validImages.length !== files.length) {
      message.error("Vui lòng chọn tệp hình ảnh.");
      return;
    }

    setImages((prevImages) => [...prevImages, ...validImages]);
  };

  // Remove an image from the list
  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !content.trim() ||
      !author ||
      !category ||
      images.length === 0
    ) {
      message.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const isDuplicateTitle = blogs.some((blog) => blog.title === title);
    if (isDuplicateTitle) {
      message.error("Tiêu đề bài viết đã tồn tại. Vui lòng chọn tiêu đề khác.");
      return;
    }

    const blogData = new FormData();
    blogData.append("title", title);
    blogData.append("content", content);
    blogData.append("author", author);
    blogData.append("category", category);
    images.forEach((image) => {
      blogData.append("images", image);
    });

    try {
      const response = await axios.post(
        "http://localhost:8081/api/blogs/add",
        blogData
      );
      if (response.status === 201) {
        message.success("Bài viết đã được thêm thành công!");
        navigate("/admin/blog-list");
      }
    } catch (error) {
      console.error("Lỗi khi thêm bài viết:", error);
      message.error("Lỗi khi thêm bài viết. Vui lòng thử lại.");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 title">Thêm Bài Viết</h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-12 mb-3">
            <label htmlFor="brandImage" className="form-label">
              Chọn Hình Ảnh Bài Viết
            </label>
            <input
              type="file"
              id="brandImage"
              className="form-control"
              onChange={handleImageUpload}
              multiple
              accept="image/*"
            />
            <div className="mt-3">
              {images.map((image, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`preview-${index}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                  />
                  <Button danger onClick={() => handleRemoveImage(index)}>
                    Xóa
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="brandName" className="form-label">
              Nhập Tiêu Đề Bài Viết
            </label>
            <input
              type="text"
              id="brandName"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề bài viết"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="author" className="form-label">
              Chọn Tác Giả
            </label>
            <Select
              placeholder="Chọn Tác Giả"
              style={{ width: "100%" }}
              value={author}
              onChange={(value) => setAuthor(value)}
            >
              {authors.map((auth) => (
                <Option key={auth.id} value={auth.id}>
                  {auth.username}
                </Option>
              ))}
            </Select>
          </div>

          <div className="col-12 mb-3">
            <label htmlFor="category" className="form-label">
              Chọn Danh Mục Bài Viết
            </label>
            <Select
              placeholder="Chọn Danh Mục Bài Viết"
              style={{ width: "100%" }}
              value={category}
              onChange={(value) => setCategory(value)}
            >
              {categories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.cateBlogName}
                </Option>
              ))}
            </Select>
          </div>

          <div className="col-12 mb-3">
            <label htmlFor="description" className="form-label">
              Nhập Mô Tả Bài Viết
            </label>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={handleDesc}
              placeholder="Nhập mô tả bài viết"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12 text-center">
            <button className="btn btn-success" type="submit">
              Thêm
            </button>
          </div>
          <div className="text-start mt-5">
            <Button
              type="primary"
              onClick={() =>
                navigate("/admin/blog-list", { state: { searchText } })
              }
            >
              Quay lại Danh Bài Viết
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;
