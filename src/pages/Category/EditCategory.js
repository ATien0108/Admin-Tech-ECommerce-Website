import React, { useState, useEffect } from "react";
import { message, Button } from "antd";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const EditCategory = () => {
  const { cateName } = useParams(); // Lấy cateName từ URL params
  const navigate = useNavigate();

  const [categoryData, setCategoryData] = useState({
    cateName: "",
    cateDesc: "",
    cateImage: null, // Lưu trữ file ảnh
    createdAt: "",
    updatedAt: "",
    cateId: null,
  });

  const [previewImage, setPreviewImage] = useState(""); // URL ảnh hiện tại
  const location = useLocation();
  const searchText = location.state?.searchText || "";

  // Lấy dữ liệu danh mục từ API khi component được render
  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/categories/search?q=${cateName}`)
      .then((response) => {
        const category = response.data[0]; // Giả sử dữ liệu trả về là một mảng, lấy phần tử đầu tiên
        if (category) {
          setCategoryData({
            cateName: category.cateName,
            cateDesc: category.cateDesc,
            cateImage: null, // Không cần ảnh gốc tại đây
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
            cateId: category.id,
          });
          setPreviewImage(category.cateImage); // Hiển thị URL ảnh cũ
        } else {
          message.error("Không tìm thấy danh mục.");
          navigate("/admin/category-list");
        }
      })
      .catch((error) => {
        console.error(error);
        message.error("Đã xảy ra lỗi khi lấy dữ liệu danh mục.");
      });
  }, [cateName, navigate]);

  // Xử lý thay đổi file ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryData({ ...categoryData, cateImage: file });
      setPreviewImage(URL.createObjectURL(file)); // Hiển thị ảnh mới
    }
  };

  // Xử lý thay đổi thông tin danh mục
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value });
  };

  // Gửi dữ liệu cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { cateName, cateDesc, cateImage, cateId } = categoryData;

    // Kiểm tra dữ liệu hợp lệ
    if (!cateName.trim() || !cateDesc.trim()) {
      message.error("Vui lòng điền đầy đủ thông tin tất cả các trường.");
      return;
    }

    try {
      // Kiểm tra tên danh mục trùng lặp
      const response = await axios.get(
        "http://localhost:8081/api/categories/all"
      );
      const isDuplicate = response.data.some(
        (category) =>
          category.cateName.toLowerCase() === cateName.toLowerCase() &&
          category.id !== cateId
      );

      if (isDuplicate) {
        message.error("Tên danh mục đã tồn tại. Vui lòng nhập tên khác.");
        return;
      }

      // Tạo FormData để gửi dữ liệu
      const formData = new FormData();
      formData.append("cateName", cateName);
      formData.append("cateDesc", cateDesc);

      // Gửi ảnh mới nếu có
      if (cateImage) {
        formData.append("image", cateImage); // Đảm bảo gửi ảnh dưới tên "image"
      } else if (previewImage) {
        // Nếu không có ảnh mới, gửi ảnh cũ
        formData.append("image", previewImage); // Bạn có thể bỏ qua trường hợp này nếu chỉ muốn gửi ảnh mới
      }

      // Gửi yêu cầu PUT với FormData
      await axios.put(
        `http://localhost:8081/api/categories/update/${cateId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Dữ liệu danh mục đã được cập nhật thành công.");
      navigate("/admin/category-list");
    } catch (error) {
      message.error("Cập nhật dữ liệu danh mục thất bại.");
      console.error(error);
    }
  };

  // Định dạng Ngày Tạo và Ngày Cập Nhật bằng toLocaleDateString()
  const formattedCreatedAt = categoryData.createdAt
    ? new Date(categoryData.createdAt).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : ""; // Định dạng Ngày Tạo

  const formattedUpdatedAt = categoryData.updatedAt
    ? new Date(categoryData.updatedAt).toLocaleDateString("vi-VN", {
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
      <h3 className="mb-4 title">Chỉnh sửa Danh mục</h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="cateName" className="form-label">
              Tên Danh mục
            </label>
            <input
              type="text"
              id="cateName"
              name="cateName"
              className="form-control"
              value={categoryData.cateName}
              onChange={handleChange}
              placeholder="Nhập tên danh mục"
            />
          </div>

          <div className="col-md-12 mb-3">
            <label htmlFor="cateDesc" className="form-label">
              Mô tả Danh mục
            </label>
            <textarea
              id="cateDesc"
              name="cateDesc"
              className="form-control"
              value={categoryData.cateDesc}
              onChange={handleChange}
              placeholder="Nhập mô tả danh mục"
              rows="5"
            />
          </div>

          <div className="col-md-12 mb-3">
            <label htmlFor="cateImage" className="form-label">
              Chỉnh sửa Hình Ảnh Danh mục
            </label>
            <input
              type="file"
              id="cateImage"
              className="form-control"
              onChange={handleImageChange}
            />
            {previewImage && (
              <img
                src={previewImage}
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
          <div className="text-start mt-5">
            <Button
              type="primary"
              onClick={() =>
                navigate("/admin/category-list", { state: { searchText } })
              }
            >
              Quay lại Danh Sách Danh Mục
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;
