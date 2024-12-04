import React, { useState } from "react";
import { message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddBrand = () => {
  const [brandName, setBrandName] = useState("");
  const [brandDesc, setBrandDesc] = useState("");
  const [brandImage, setBrandImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      message.error("Vui lòng chọn tệp hình ảnh.");
      return;
    }

    setBrandImage(file); // Save the selected image
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form
    if (!brandName.trim() || !brandDesc.trim() || !brandImage) {
      message.error("Vui lòng điền đầy đủ thông tin tất cả các trường.");
      return;
    }

    try {
      setIsLoading(true);

      // Check if the brand name already exists
      const response = await axios.get("http://localhost:8081/api/brands/all");
      const existingBrands = response.data;

      const isDuplicate = existingBrands.some(
        (brand) => brand.brandName.toLowerCase() === brandName.toLowerCase()
      );
      if (isDuplicate) {
        message.error("Tên thương hiệu đã tồn tại. Vui lòng nhập tên khác.");
        return;
      }

      // Create a FormData object to send brand data and image
      const formData = new FormData();
      formData.append("brandName", brandName);
      formData.append("brandDesc", brandDesc);
      formData.append("image", brandImage);

      // Send request to create the brand
      await axios.post("http://localhost:8081/api/brands/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      message.success("Thương hiệu đã được thêm thành công.");
      navigate("/admin/brand-list"); // Redirect to the brand list page
    } catch (error) {
      console.error("Lỗi khi thêm thương hiệu:", error);
      message.error("Thêm thương hiệu thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 title">Thêm Thương Hiệu</h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-12 mb-3">
            <label htmlFor="brandName" className="form-label">
              Tên thương hiệu
            </label>
            <input
              type="text"
              id="brandName"
              className="form-control"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Nhập tên thương hiệu"
              required
            />
          </div>
          <div className="col-md-12 mb-3">
            <label htmlFor="brandDesc" className="form-label">
              Mô tả thương hiệu
            </label>
            <textarea
              id="brandDesc"
              className="form-control"
              value={brandDesc}
              onChange={(e) => setBrandDesc(e.target.value)}
              placeholder="Nhập mô tả thương hiệu"
              rows="4"
              required
            />
          </div>
          <div className="col-md-12 mb-3">
            <label htmlFor="brandImage" className="form-label">
              Hình ảnh thương hiệu
            </label>
            <input
              type="file"
              id="brandImage"
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

export default AddBrand;
