import React, { useState, useEffect } from "react";
import { message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditBrand = () => {
  const { brandName } = useParams(); // Lấy tham số từ URL
  const navigate = useNavigate();

  const [brandData, setBrandData] = useState({
    brandName: "",
    brandDesc: "",
    brandImage: null, // Lưu trữ file ảnh
    createdAt: "",
    updatedAt: "",
    brandId: null,
  });

  const [previewImage, setPreviewImage] = useState(""); // URL ảnh hiện tại

  // Lấy dữ liệu thương hiệu từ API khi component được render
  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/brands/search?q=${brandName}`)
      .then((response) => {
        const brand = response.data[0];
        if (brand) {
          setBrandData({
            brandName: brand.brandName,
            brandDesc: brand.brandDesc,
            brandImage: null, // Không cần ảnh gốc tại đây
            createdAt: brand.createdAt,
            updatedAt: brand.updatedAt,
            brandId: brand.id,
          });
          setPreviewImage(brand.brandImage); // Hiển thị URL ảnh cũ
        } else {
          message.error("Không tìm thấy thương hiệu.");
          navigate("/admin/brand-list");
        }
      })
      .catch((error) => {
        console.error(error);
        message.error("Đã xảy ra lỗi khi lấy dữ liệu thương hiệu.");
      });
  }, [brandName, navigate]);

  // Xử lý thay đổi file ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBrandData({ ...brandData, brandImage: file });
      setPreviewImage(URL.createObjectURL(file)); // Hiển thị ảnh mới
    }
  };

  // Xử lý thay đổi thông tin thương hiệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrandData({ ...brandData, [name]: value });
  };

  // Gửi dữ liệu cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { brandName, brandDesc, brandImage, brandId } = brandData;

    // Kiểm tra dữ liệu hợp lệ
    if (!brandName.trim() || !brandDesc.trim()) {
      message.error("Vui lòng điền đầy đủ thông tin tất cả các trường.");
      return;
    }

    try {
      // Kiểm tra tên thương hiệu trùng lặp
      const response = await axios.get("http://localhost:8081/api/brands/all");
      const isDuplicate = response.data.some(
        (brand) =>
          brand.brandName.toLowerCase() === brandName.toLowerCase() &&
          brand.id !== brandId
      );

      if (isDuplicate) {
        message.error("Tên thương hiệu đã tồn tại. Vui lòng nhập tên khác.");
        return;
      }

      // Tạo FormData để gửi dữ liệu
      const formData = new FormData();
      formData.append("brandName", brandName);
      formData.append("brandDesc", brandDesc);

      // Gửi ảnh mới nếu có
      if (brandImage) {
        formData.append("image", brandImage); // Đảm bảo gửi ảnh dưới tên "image"
      } else if (previewImage) {
        // Nếu không có ảnh mới, gửi ảnh cũ
        formData.append("image", previewImage); // Bạn có thể bỏ qua trường hợp này nếu chỉ muốn gửi ảnh mới
      }

      // Gửi yêu cầu PUT với FormData
      await axios.put(
        `http://localhost:8081/api/brands/update/${brandId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Dữ liệu thương hiệu đã được cập nhật thành công.");
      navigate("/admin/brand-list");
    } catch (error) {
      message.error("Cập nhật dữ liệu thương hiệu thất bại.");
      console.error(error);
    }
  };

  // Định dạng Ngày Tạo và Ngày Cập Nhật bằng toLocaleDateString()
  const formattedCreatedAt = brandData.createdAt
    ? new Date(brandData.createdAt).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : ""; // Định dạng Ngày Tạo

  const formattedUpdatedAt = brandData.updatedAt
    ? new Date(brandData.updatedAt).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : ""; // Định dạng Ngày Cập Nhật

  return (
    <div className="container mt-4">
      <h3 className="mb-4 title">Chỉnh sửa Thương Hiệu</h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="brandName" className="form-label">
              Chỉnh sửa Tên Thương Hiệu
            </label>
            <input
              type="text"
              id="brandName"
              name="brandName"
              className="form-control"
              value={brandData.brandName}
              onChange={handleChange}
              placeholder="Nhập tên thương hiệu"
            />
          </div>
          <div className="col-md-12 mb-3">
            <label htmlFor="brandDesc" className="form-label">
              Chỉnh sửa Mô Tả Thương Hiệu
            </label>
            <textarea
              id="brandDesc"
              name="brandDesc"
              className="form-control"
              value={brandData.brandDesc}
              onChange={handleChange}
              placeholder="Nhập mô tả thương hiệu"
              rows="5"
            />
          </div>
          <div className="col-md-12 mb-3">
            <label htmlFor="brandImage" className="form-label">
              Chỉnh sửa Hình Ảnh Thương Hiệu
            </label>
            <input
              type="file"
              id="brandImage"
              className="form-control"
              onChange={handleImageChange}
            />
            {previewImage && (
              <img
                src={
                  typeof previewImage === "string"
                    ? previewImage
                    : URL.createObjectURL(previewImage)
                }
                alt="Preview"
                className="mt-3"
                style={{ maxHeight: "200px", maxWidth: "100%" }}
              />
            )}
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="createdAt" className="form-label">
              Ngày Tạo
            </label>
            <input
              type="text"
              id="createdAt"
              className="form-control"
              value={formattedCreatedAt}
              disabled
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="updatedAt" className="form-label">
              Ngày Cập Nhật
            </label>
            <input
              type="text"
              id="updatedAt"
              className="form-control"
              value={formattedUpdatedAt}
              disabled
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 text-center">
            <button type="submit" className="btn btn-success">
              Lưu
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditBrand;
