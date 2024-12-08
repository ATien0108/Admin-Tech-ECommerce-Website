import React, { useState, useEffect } from "react";
import { message, Button } from "antd";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const EditBlogCat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchText = location.state?.searchText || "";

  // State để lưu thông tin danh mục
  const [categoryName, setCategoryName] = useState("");
  const [categoryDesc, setCategoryDesc] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [categoryId, setCategoryId] = useState(null);

  // Lấy dữ liệu danh mục khi component được mount
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/blogcategories/${id}`
        );
        const category = response.data;

        setCategoryName(category.cateBlogName);
        setCategoryDesc(category.cateBlogDesc);
        setCreatedAt(new Date(category.createdAt).toLocaleDateString());
        setUpdatedAt(new Date(category.updatedAt).toLocaleDateString());
        setCategoryId(category.id);

        const blogCate = response.data.cateBlogName
          .replace(/\s+/g, "-")
          .toLowerCase();
        navigate(`/admin/edit-blog-cat/${blogCate}`, { replace: true });
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategory();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu các trường bị bỏ trống
    if (!categoryId || !categoryName || !categoryDesc) {
      message.error("Vui lòng điền đầy đủ thông tin danh mục.");
      return;
    }

    const categoryData = {
      id: categoryId,
      cateBlogName: categoryName,
      cateBlogDesc: categoryDesc,
      updatedAt: new Date().toISOString(),
    };

    try {
      await axios.put(
        `http://localhost:8081/api/blogcategories/update/${categoryId}`,
        categoryData
      );
      message.success("Cập nhật danh mục blog thành công!");
      navigate("/admin/blog-category-list");
    } catch (error) {
      // Hiển thị lỗi chi tiết từ API hoặc lỗi mặc định
      if (error.response && error.response.data.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Lỗi khi cập nhật danh mục. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 title">Chỉnh sửa danh mục blog</h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Input cho Tên danh mục Blog */}
          <div className="col-md-6 mb-3">
            <label htmlFor="categoryName" className="form-label">
              Chỉnh sửa tên danh mục blog
            </label>
            <input
              type="text"
              id="categoryName"
              className="form-control"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Nhập tên danh mục"
            />
          </div>

          {/* Input cho Mô tả danh mục Blog */}
          <div className="col-12 mb-3">
            <label htmlFor="categoryDesc" className="form-label">
              Chỉnh sửa mô tả danh mục blog
            </label>
            <textarea
              id="categoryDesc"
              className="form-control"
              value={categoryDesc}
              onChange={(e) => setCategoryDesc(e.target.value)}
              placeholder="Nhập mô tả danh mục blog"
              rows="5"
            />
          </div>

          {/* Hiển thị Ngày tạo */}
          <div className="col-md-6 mb-3">
            <label htmlFor="createdAt" className="form-label">
              Ngày tạo
            </label>
            <input
              type="text"
              id="createdAt"
              className="form-control"
              value={createdAt}
              disabled
            />
          </div>

          {/* Hiển thị Ngày cập nhật */}
          <div className="col-md-6 mb-3">
            <label htmlFor="updatedAt" className="form-label">
              Ngày cập nhật
            </label>
            <input
              type="text"
              id="updatedAt"
              className="form-control"
              value={updatedAt}
              disabled
            />
          </div>
        </div>

        {/* Nút submit */}
        <div className="row">
          <div className="col-md-12 text-center">
            <button className="btn btn-success" type="submit">
              Lưu
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

export default EditBlogCat;
