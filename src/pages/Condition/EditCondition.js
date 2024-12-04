import React, { useState, useEffect } from "react";
import { message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditCondition = () => {
  const { conditionName } = useParams(); // Lấy conditionName từ URL
  const navigate = useNavigate();
  const [conditionData, setConditionData] = useState({
    conditionName: "",
    description: "",
    createdAt: "",
    updatedAt: "",
    id: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchConditionData = async () => {
      try {
        const encodedConditionName = encodeURIComponent(conditionName.trim());
        const response = await axios.get(
          `http://localhost:8081/api/product-conditions/search?q=${encodedConditionName}`
        );

        const conditions = Array.isArray(response.data)
          ? response.data
          : [response.data];
        const condition = conditions.find(
          (item) =>
            item.conditionName.toLowerCase() === conditionName.toLowerCase()
        );

        if (condition) {
          setConditionData({
            conditionName: condition.conditionName,
            description: condition.description,
            createdAt: condition.createdAt,
            updatedAt: condition.updatedAt,
            id: condition.id,
          });
        } else {
          message.error("Không tìm thấy tình trạng.");
        }
      } catch (error) {
        console.error("Lỗi API:", error);
        message.error(
          error.response?.data?.message || "Đã có lỗi xảy ra khi lấy dữ liệu."
        );
      }
    };

    fetchConditionData();
  }, [conditionName]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!conditionData.conditionName.trim()) {
      message.error("Vui lòng nhập tên tình trạng.");
      return;
    }

    if (!conditionData.description.trim()) {
      message.error("Vui lòng nhập mô tả tình trạng.");
      return;
    }

    const updatedCondition = {
      ...conditionData,
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await axios.get(
        `http://localhost:8081/api/product-conditions/all`
      );
      const existingConditions = response.data || [];

      const isDuplicate = existingConditions.some(
        (condition) =>
          condition.conditionName.toLowerCase() ===
            conditionData.conditionName.trim().toLowerCase() &&
          condition.id !== conditionData.id
      );

      if (isDuplicate) {
        message.error("Tên tình trạng đã tồn tại. Vui lòng nhập tên khác.");
        return;
      }

      await axios.put(
        `http://localhost:8081/api/product-conditions/update/${conditionData.id}`,
        updatedCondition
      );
      message.success("Dữ liệu tình trạng đã được cập nhật thành công.");
      navigate("/admin/condition-list");
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      message.error("Cập nhật dữ liệu tình trạng thất bại.");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 title">Chỉnh sửa Tình Trạng</h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="conditionName" className="form-label">
              Chỉnh sửa Tên Tình Trạng
            </label>
            <input
              type="text"
              id="conditionName"
              className="form-control"
              value={conditionData.conditionName}
              onChange={(e) =>
                setConditionData({
                  ...conditionData,
                  conditionName: e.target.value,
                })
              }
              placeholder="Nhập tên tình trạng"
            />
          </div>
          <div className="col-md-12 mb-3">
            <label htmlFor="description" className="form-label">
              Chỉnh sửa Mô Tả Tình Trạng
            </label>
            <textarea
              id="description"
              className="form-control"
              value={conditionData.description}
              onChange={(e) =>
                setConditionData({
                  ...conditionData,
                  description: e.target.value,
                })
              }
              placeholder="Nhập mô tả tình trạng"
              rows="5"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="createdAt" className="form-label">
              Ngày Tạo
            </label>
            <input
              type="text"
              id="createdAt"
              className="form-control"
              value={conditionData.createdAt}
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
              value={conditionData.updatedAt}
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

export default EditCondition;
