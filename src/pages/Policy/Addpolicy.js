import React, { useState } from "react";
import axios from "axios";
import "react-quill/dist/quill.snow.css"; // Import style của ReactQuill
import { Button, message } from "antd";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AddPolicy = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const handleCheckTitleExists = async (title) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/policies/check-title?title=${encodeURIComponent(
          title
        )}`
      );
      return response.data; // Giả sử API trả về true nếu tiêu đề đã tồn tại
    } catch (error) {
      console.error("Có lỗi khi kiểm tra tiêu đề:", error);
      return false; // Nếu có lỗi, giả sử tiêu đề không tồn tại
    }
  };

  const contentText = content.replace(/<[^>]+>/g, "");

  const handleSubmit = async () => {
    // Xóa các khoảng trắng thừa và kiểm tra các trường bắt buộc
    if (!title.trim()) {
      message.error("Vui lòng nhập tiêu đề chính sách.");
      return;
    }

    if (!description.trim()) {
      message.error("Vui lòng nhập mô tả chính sách.");
      return;
    }

    if (!contentText.trim()) {
      message.error("Vui lòng nhập nội dung chính sách.");
      return;
    }

    // Kiểm tra xem tiêu đề đã tồn tại hay chưa
    const titleExists = await handleCheckTitleExists(title.trim());
    if (titleExists) {
      message.error("Tiêu đề này đã tồn tại. Vui lòng nhập tiêu đề khác.");
      return;
    }

    const newPolicy = {
      title: title.trim(),
      description: description.trim(),
      content: content.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      // Gọi API để thêm chính sách mới
      await axios.post("http://localhost:8081/api/policies/add", newPolicy); // Điều chỉnh URL nếu cần
      message.success("Chính sách đã được thêm thành công.");

      // Xóa các trường nhập sau khi gửi
      setTitle("");
      setDescription("");
      setContent("");

      // Chuyển hướng đến trang /admin/policies
      navigate("/admin/policies");
    } catch (error) {
      console.error("Có lỗi khi thêm chính sách:", error);
      message.error("Thêm chính sách không thành công. Vui lòng thử lại.");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 title">Thêm Chính sách</h3>
      <div className="col-md-6 mb-3">
        <label htmlFor="policyTitle" className="form-label">
          Nhập Tiêu đề
        </label>
        <input
          type="text"
          id="policyTitle"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập tiêu đề"
        />
      </div>
      <div className="col-md-6 mb-3">
        <label htmlFor="policyDescription" className="form-label">
          Nhập Mô tả Chính sách
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

      <label htmlFor="policyContent" className="form-label">
        Nhập Nội dung Chính sách
      </label>
      <ReactQuill
        value={content}
        onChange={setContent}
        className="mb-4"
        placeholder="Nhập mô tả nội dung"
      />

      <div className="row">
        <div className="col-md-12 text-center">
          <Button type="primary" onClick={handleSubmit}>
            Thêm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddPolicy;
