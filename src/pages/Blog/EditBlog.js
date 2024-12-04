import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const EditBlog = () => {
  const { id } = useParams(); // ID blog từ URL
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [blogImage, setBlogImage] = useState([]); // Store image URLs
  const [newImageUrl, setNewImageUrl] = useState(""); // New image URL to add
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu Blog khi trang được render
    setLoading(true);
    axios
      .get(`http://localhost:8081/api/blogs/${id}`)
      .then((response) => {
        const { title, content, author, category, blogImage } = response.data;
        setTitle(title || "");
        setContent(content || "");
        setAuthor(author || "");
        setCategory(category || "");
        setBlogImage(blogImage || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        message.error("Không thể tải dữ liệu Blog.");
        setLoading(false);
      });

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/employees/all"
        );
        setEmployees(response.data);
      } catch (error) {
        message.error("Lỗi khi tải danh sách nhân viên.");
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/blogcategories/all"
        );
        setCategories(response.data);
      } catch (error) {
        message.error("Lỗi khi tải danh mục.");
      }
    };

    fetchCategories();
    fetchEmployees();
  }, [id]);

  const handleAddImage = () => {
    if (newImageUrl.trim() !== "") {
      setBlogImage([...blogImage, newImageUrl]);
      setNewImageUrl(""); // Clear input field
    } else {
      message.warning("Vui lòng nhập URL hình ảnh hợp lệ.");
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = blogImage.filter((_, i) => i !== index);
    setBlogImage(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      message.error("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }

    try {
      setLoading(true);
      await axios.put(`http://localhost:8081/api/blogs/update/${id}`, {
        title,
        content,
        author,
        category,
        blogImage,
      });

      message.success("Cập nhật Blog thành công.");
      navigate("/admin/blog-list");
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi khi cập nhật Blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 title">Chỉnh sửa Blog</h3>
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-12 mb-3">
              <label htmlFor="title" className="form-label">
                Tiêu đề
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề Blog"
              />
            </div>
            <div className="col-12 mb-3">
              <label htmlFor="content" className="form-label">
                Nội dung
              </label>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                placeholder="Nhập nội dung bài viết"
                className="bg-white"
                style={{ minHeight: "200px" }}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="author" className="form-label">
                Chỉnh Sửa Tên Tác Giả
              </label>
              <select
                id="author"
                className="form-select"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              >
                <option value="">Chọn tên tác giả</option>
                {employees.map((em) => (
                  <option key={em.id} value={em.id}>
                    {em.username}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="category" className="form-label">
                Chọn Danh Mục
              </label>
              <select
                id="category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Chọn danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.cateBlogName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-12 text-center">
              <button type="submit" className="btn btn-success">
                Lưu
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditBlog;
