import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

const EditPolicy = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const location = useLocation();
  const searchText = location.state?.searchText || "";

  // Lấy thông tin chính sách hiện tại
  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/policies/${id}`
        );
        const policy = response.data;
        setTitle(policy.title);
        setDescription(policy.description);
        setContent(policy.content);
        setCreatedAt(policy.createdAt);
        setUpdatedAt(policy.updatedAt);
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy thông tin chính sách:", error);
        message.error("Không thể tải thông tin chính sách.");
      }
    };
    fetchPolicy();
  }, [id]);

  // Kiểm tra tiêu đề đã tồn tại
  const handleCheckTitleExists = async (title) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/policies/check-title?title=${encodeURIComponent(
          title
        )}&excludeId=${id}`
      );
      return response.data.exists; // API trả về true nếu tiêu đề tồn tại
    } catch (error) {
      console.error("Có lỗi khi kiểm tra tiêu đề:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn reload trang

    // Kiểm tra nếu các trường nhập còn trống
    if (!title.trim()) {
      message.error("Vui lòng nhập tiêu đề.");
      return;
    }
    if (!description.trim()) {
      message.error("Vui lòng nhập mô tả chính sách.");
      return;
    }

    const contentText = content.replace(/<[^>]+>/g, "").trim(); // Xóa thẻ HTML khỏi nội dung để kiểm tra
    if (!contentText) {
      message.error("Vui lòng nhập nội dung chính sách.");
      return;
    }

    // Kiểm tra tiêu đề đã tồn tại
    const titleExists = await handleCheckTitleExists(title.trim());
    if (titleExists) {
      message.error("Tiêu đề này đã tồn tại. Vui lòng nhập tiêu đề khác.");
      return;
    }

    // Dữ liệu cần cập nhật
    const updatedPolicy = {
      title: title.trim(),
      description: description.trim(),
      content: content.trim(), // Giữ nguyên nội dung có thẻ HTML
      createdAt,
      updatedAt: new Date().toISOString(), // Cập nhật với ngày hiện tại
    };

    try {
      // Gọi API cập nhật chính sách
      await axios.put(
        `http://localhost:8081/api/policies/update/${id}`,
        updatedPolicy
      );
      message.success("Cập nhật chính sách thành công.");
      navigate("/admin/policies");
    } catch (error) {
      console.error(
        "Có lỗi xảy ra khi cập nhật chính sách:",
        error.response || error.message
      );
      message.error("Cập nhật chính sách không thành công. Vui lòng thử lại.");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 title">Chỉnh sửa Chính sách</h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="policyTitle" className="form-label">
              Chỉnh sửa Tiêu đề Chính sách
            </label>
            <input
              type="text"
              id="policyTitle"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề chính sách"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="policyDescription" className="form-label">
              Chỉnh sửa Mô tả Chính sách
            </label>
            <input
              type="text"
              id="policyDescription"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả chính sách"
            />
          </div>
          <div className="col-md-12 mb-3">
            <label htmlFor="policyContent" className="form-label">
              Chỉnh sửa Nội dung Chính sách
            </label>
            <ReactQuill theme="snow" value={content} onChange={setContent} />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="createdAt" className="form-label">
              Ngày Tạo
            </label>
            <input
              type="text"
              id="createdAt"
              className="form-control"
              value={createdAt}
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
              value={updatedAt}
              disabled
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 text-center">
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}
            >
              Lưu
            </Button>
          </div>
          <div className="text-start mt-5">
            <Button
              type="primary"
              onClick={() =>
                navigate("/admin/policies", { state: { searchText } })
              }
            >
              Quay lại Danh Sách Chính Sách
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditPolicy;
