import React, { useState } from "react";
import ReactQuill from "react-quill"; // Import ReactQuill
import "react-quill/dist/quill.snow.css"; // Import CSS for ReactQuill
import { message } from "antd"; // Import message component from Ant Design
import axios from "axios"; // Import axios for API calls
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const Addtag = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate(); // Initialize navigate for redirection

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu tên nhãn bị bỏ trống
    if (!name.trim()) {
      message.error("Vui lòng nhập tên nhãn.");
      return;
    }

    // Tạo đối tượng chứa thông tin nhãn
    const newTag = {
      name: name.trim(), // Loại bỏ khoảng trắng thừa
      createdAt: new Date(), // Điều chỉnh theo định dạng backend yêu cầu
      updatedAt: new Date(), // Điều chỉnh theo định dạng backend yêu cầu
    };

    try {
      // Kiểm tra xem tên nhãn đã tồn tại chưa
      const response = await axios.get(`http://localhost:8081/api/tags/all`);
      const existingTags = response.data;

      const isDuplicate = existingTags.some(
        (tag) => tag.name.toLowerCase() === name.trim().toLowerCase()
      ); // So sánh không phân biệt chữ hoa/chữ thường
      if (isDuplicate) {
        message.error("Tên nhãn đã tồn tại. Vui lòng nhập tên khác.");
        return;
      }

      await axios.post("http://localhost:8081/api/tags/add", newTag);

      message.success("Nhãn đã được thêm thành công.");

      navigate("/admin/tag-list");
    } catch (error) {
      console.error("Lỗi khi thêm nhãn:", error);
      message.error("Thêm nhãn thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 title">Thêm Nhãn</h3>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-12 mb-3">
              <label htmlFor="name" className="form-label">
                Tên nhãn
              </label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên nhãn"
                required
              />
            </div>
          </div>

          {/* Nút gửi */}
          <div className="row">
            <div className="col-md-12 text-center">
              <button type="submit" className="btn btn-success">
                Thêm
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Addtag;
