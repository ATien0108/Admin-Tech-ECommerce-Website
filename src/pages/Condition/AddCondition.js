import React, { useState } from "react";
import ReactQuill from "react-quill"; // Import ReactQuill
import "react-quill/dist/quill.snow.css"; // Import CSS for ReactQuill
import { message } from "antd"; // Import message component from Ant Design
import axios from "axios"; // Import axios for API calls
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const Addcondition = () => {
  const [conditionName, setConditionName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate(); // Initialize navigate for redirection

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu các trường bị bỏ trống
    if (!conditionName.trim()) {
      message.error("Vui lòng nhập tên tình trạng.");
      return;
    }

    if (!description.trim()) {
      message.error("Vui lòng nhập mô tả tình trạng.");
      return;
    }

    const newCondition = {
      conditionName: conditionName.trim(), // Loại bỏ khoảng trắng thừa
      description: description.trim(), // Loại bỏ khoảng trắng thừa
      createdAt: new Date(), // Điều chỉnh theo định dạng backend yêu cầu
      updatedAt: new Date(), // Điều chỉnh theo định dạng backend yêu cầu
    };

    try {
      // Kiểm tra xem tên tình trạng đã tồn tại chưa
      const response = await axios.get(
        `http://localhost:8081/api/product-conditions/all`
      );
      const existingConditions = response.data;

      const isDuplicate = existingConditions.some(
        (condition) =>
          condition.conditionName.toLowerCase() ===
          conditionName.trim().toLowerCase()
      );
      if (isDuplicate) {
        message.error("Tên tình trạng đã tồn tại. Vui lòng nhập tên khác.");
        return;
      }

      await axios.post(
        "http://localhost:8081/api/product-conditions/add",
        newCondition
      );

      message.success("Tình trạng đã được thêm thành công.");
      navigate("/admin/condition-list");
    } catch (error) {
      console.error("Lỗi khi thêm tình trạng:", error);
      message.error("Thêm tình trạng thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 title">Thêm Tình Trạng</h3>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-12 mb-3">
              <label htmlFor="conditionName" className="form-label">
                Tên tình trạng
              </label>
              <input
                type="text"
                id="conditionName"
                className="form-control"
                value={conditionName}
                onChange={(e) => setConditionName(e.target.value)}
                placeholder="Nhập tên tình trạng"
                required
              />
            </div>

            <div className="col-md-12 mb-3">
              <label htmlFor="description" className="form-label">
                Mô tả tình trạng
              </label>
              <textarea
                id="description"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả tình trạng"
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

export default Addcondition;
