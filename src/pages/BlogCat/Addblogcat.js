import React, { useState, useEffect } from "react";
import { message, Button } from "antd";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const AddBlogCat = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDesc, setCategoryDesc] = useState("");
  const [existingCategories, setExistingCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const searchText = location.state?.searchText || "";

  // Lấy danh sách các danh mục hiện có khi component được render lần đầu
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/blogcategories/all"
        );
        setExistingCategories(response.data.map((cat) => cat.cateBlogName));
      } catch (error) {
        message.error("Không thể lấy danh mục");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu các trường bị bỏ trống
    if (!categoryName || !categoryDesc) {
      message.error("Vui lòng điền đầy đủ thông tin danh mục.");
      return;
    }

    // Kiểm tra tính duy nhất của tên danh mục
    if (existingCategories.includes(categoryName)) {
      message.error("Tên danh mục blog đã tồn tại. Vui lòng chọn tên khác.");
      return;
    }

    const categoryData = {
      cateBlogName: categoryName,
      cateBlogDesc: categoryDesc,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await axios.post(
        "http://localhost:8081/api/blogcategories/add",
        categoryData
      );
      message.success("Danh mục blog đã được thêm thành công!");
      navigate("/admin/blog-category-list");
    } catch (error) {
      console.error("Lỗi khi thêm danh mục blog:", error);
      message.error("Không thể thêm danh mục blog.");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 title">Thêm Danh Mục Blog</h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Nhập tên danh mục blog */}
          <div className="col-md-6 mb-3">
            <label htmlFor="categoryName" className="form-label">
              Nhập tên danh mục blog
            </label>
            <input
              type="text"
              id="categoryName"
              className="form-control"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Nhập tên danh mục blog"
              required
            />
          </div>
        </div>

        {/* Mô tả danh mục blog */}
        <div className="col-12 mb-3">
          <label htmlFor="categoryDesc" className="form-label">
            Nhập mô tả danh mục blog
          </label>
          <textarea
            id="categoryDesc"
            className="form-control"
            value={categoryDesc}
            onChange={(e) => setCategoryDesc(e.target.value)}
            placeholder="Nhập mô tả danh mục blog"
            rows="5"
            required
          />
        </div>

        {/* Nút gửi */}
        <div className="row">
          <div className="col-md-12 text-center">
            <button className="btn btn-success" type="submit">
              Thêm
            </button>
          </div>
          <div className="text-start mt-5">
            <Button
              type="primary"
              onClick={() =>
                navigate("/admin/blog-category-list", { state: { searchText } })
              }
            >
              Quay lại Danh Sách Danh Mục Bài Viết
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddBlogCat;
