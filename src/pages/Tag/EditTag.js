import React, { useState, useEffect } from "react";
import { message, Button } from "antd";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const EditTag = () => {
  const { name } = useParams(); // Lấy tên nhãn từ URL params
  const navigate = useNavigate();
  const [tagName, setTagName] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [tagId, setTagId] = useState(null);
  const [existingTags, setExistingTags] = useState([]);
  const location = useLocation();
  const searchText = location.state?.searchText || "";

  useEffect(() => {
    // Tìm kiếm nhãn theo tên từ API
    axios
      .get(`http://localhost:8081/api/tags/search?q=${name}`) // Tìm kiếm theo tên nhãn
      .then((response) => {
        const tag = response.data[0]; // Giả sử dữ liệu trả về là một mảng, lấy phần tử đầu tiên
        if (tag) {
          setTagName(tag.name);
          setCreatedAt(tag.createdAt);
          setUpdatedAt(tag.updatedAt);
          setTagId(tag.id);
        } else {
          message.error("Không tìm thấy nhãn.");
          navigate("/admin/tag-list");
        }
      })
      .catch((error) => {
        console.error(error);
        message.error("Đã xảy ra lỗi khi lấy dữ liệu nhãn.");
      });
  }, [name, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra nếu tên nhãn bị bỏ trống
    if (!tagName.trim()) {
      message.error("Vui lòng nhập tên nhãn.");
      return;
    }

    const lowerCaseTagName = tagName.toLowerCase();
    if (
      existingTags.includes(lowerCaseTagName) &&
      lowerCaseTagName !== existingTags.find((tag) => tag === lowerCaseTagName)
    ) {
      message.error("Tên nhãn đã tồn tại. Vui lòng chọn tên khác.");
      return;
    }

    const updatedTag = {
      id: tagId,
      name: tagName,
      createdAt,
      updatedAt: new Date().toISOString(),
    };

    axios
      .put(`http://localhost:8081/api/tags/update/${tagId}`, updatedTag)
      .then(() => {
        message.success("Cập nhật nhãn thành công.");
        navigate("/admin/tag-list");
      })
      .catch((error) => {
        if (error.response) {
          message.error("Tên nhãn đã tồn tại. Vui lòng nhập tên khác.");
        } else {
          message.error(`Cập nhật nhãn thất bại: ${error.message}`);
        }
      });
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 title">Chỉnh sửa Nhãn</h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="tagName" className="form-label">
              Tên Nhãn
            </label>
            <input
              type="text"
              id="tagName"
              className="form-control"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="Nhập tên nhãn"
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
            <button type="submit" className="btn btn-success">
              Lưu
            </button>
          </div>
          <div className="text-start mt-5">
            <Button
              type="primary"
              onClick={() =>
                navigate("/admin/tag-list", { state: { searchText } })
              }
            >
              Quay lại Danh Sách Nhãn
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditTag;
