import React, { useState } from "react";
import { message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [cateName, setCateName] = useState("");
  const [cateDesc, setCateDesc] = useState("");
  const [cateImage, setCateImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      message.error("Vui lòng chọn tệp hình ảnh.");
      return;
    }

    setCateImage(file); // Lưu file ảnh đã chọn
  };

  const checkCategoryNameExists = async (name) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/categories?name=${name}`
      );
      return response.data.length > 0; // Trả về true nếu tồn tại
    } catch (error) {
      console.error("Lỗi kiểm tra danh mục:", error);
      message.error("Không thể kiểm tra danh mục. Vui lòng thử lại.");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra thông tin nhập
    if (!cateName.trim() || !cateDesc.trim() || !cateImage) {
      message.error("Vui lòng điền đầy đủ thông tin tất cả các trường.");
      return;
    }

    try {
      setIsLoading(true);

      // Kiểm tra tên danh mục có bị trùng không
      const isDuplicate = await checkCategoryNameExists(cateName.trim());
      if (isDuplicate) {
        message.error("Tên danh mục đã tồn tại. Vui lòng nhập tên khác.");
        return;
      }

      // Tạo FormData để gửi dữ liệu và ảnh
      const formData = new FormData();
      formData.append("cateName", cateName);
      formData.append("cateDesc", cateDesc);
      formData.append("image", cateImage);

      // Gửi yêu cầu API thêm danh mục
      await axios.post("http://localhost:8081/api/categories/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      message.success("Danh mục đã được thêm thành công.");
      navigate("/admin/category-list");
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
      message.error("Thêm danh mục thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 title">Thêm Danh Mục</h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-12 mb-3">
            <label htmlFor="cateName" className="form-label">
              Tên danh mục
            </label>
            <input
              type="text"
              id="cateName"
              className="form-control"
              value={cateName}
              onChange={(e) => setCateName(e.target.value)}
              placeholder="Nhập tên danh mục"
              required
            />
          </div>
          <div className="col-md-12 mb-3">
            <label htmlFor="cateDesc" className="form-label">
              Mô tả danh mục
            </label>
            <textarea
              id="cateDesc"
              className="form-control"
              value={cateDesc}
              onChange={(e) => setCateDesc(e.target.value)}
              placeholder="Nhập mô tả danh mục"
              rows="4"
              required
            />
          </div>
          <div className="col-md-12 mb-3">
            <label htmlFor="cateImage" className="form-label">
              Hình ảnh danh mục
            </label>
            <input
              type="file"
              id="cateImage"
              className="form-control"
              onChange={handleImageUpload}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 text-center">
            <button
              type="submit"
              className="btn btn-success"
              disabled={isLoading}
            >
              {isLoading ? "Đang thêm..." : "Thêm"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
