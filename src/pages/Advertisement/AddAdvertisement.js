import React, { useState } from "react";
import { message, Button } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddAdvertisement = () => {
  const navigate = useNavigate();

  const [mainAdv, setMainAdv] = useState([{ image: "", description: "" }]);
  const [subAdv, setSubAdv] = useState([{ image: "", description: "" }]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e, type, index, field) => {
    const value = e.target.value;
    const updatedList = type === "mainAdv" ? [...mainAdv] : [...subAdv];
    updatedList[index][field] = value;

    if (type === "mainAdv") {
      setMainAdv(updatedList);
    } else {
      setSubAdv(updatedList);
    }
  };

  const handleAddField = (type) => {
    if (type === "mainAdv") {
      setMainAdv([...mainAdv, { image: "", description: "" }]);
    } else {
      setSubAdv([...subAdv, { image: "", description: "" }]);
    }
  };

  const handleRemoveField = (type, index) => {
    const updatedList = type === "mainAdv" ? [...mainAdv] : [...subAdv];
    updatedList.splice(index, 1);

    if (type === "mainAdv") {
      setMainAdv(updatedList);
    } else {
      setSubAdv(updatedList);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mainAdv.some((item) => !item.image || !item.description)) {
      message.error(
        "Vui lòng điền đầy đủ các trường trong phần Quảng Cáo Chính."
      );
      return;
    }

    if (subAdv.some((item) => !item.image || !item.description)) {
      message.error(
        "Vui lòng điền đầy đủ các trường trong phần Quảng Cáo Phụ."
      );
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8081/api/advertisement/add",
        {
          mainAdv,
          subAdv,
          createdAt: new Date().toISOString(), // Thêm createdAt nếu backend yêu cầu
        }
      );
      message.success("Thêm quảng cáo thành công!");
      navigate("/admin/advertisement-list"); // Redirect to the advertisement list page
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi khi thêm quảng cáo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Thêm Quảng Cáo</h3>

      {loading && <div>Đang tải...</div>}

      <form onSubmit={handleSubmit}>
        {/* Main Advertisement Section */}
        <div className="mb-3">
          <h4>Quảng Cáo Chính</h4>
          {mainAdv.map((adv, index) => (
            <div key={index} className="mb-3">
              <div className="row">
                <div className="col-md-5">
                  <label
                    htmlFor={`mainAdvDescription-${index}`}
                    className="form-label"
                  >
                    Mô tả Quảng Cáo Chính
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id={`mainAdvDescription-${index}`}
                    value={adv.description}
                    onChange={(e) =>
                      handleChange(e, "mainAdv", index, "description")
                    }
                    placeholder="Nhập mô tả"
                  />
                </div>
                <div className="col-md-5">
                  <label
                    htmlFor={`mainAdvImage-${index}`}
                    className="form-label"
                  >
                    Hình ảnh Quảng Cáo Chính
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id={`mainAdvImage-${index}`}
                    value={adv.image}
                    onChange={(e) => handleChange(e, "mainAdv", index, "image")}
                    placeholder="Nhập URL hình ảnh"
                  />
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-danger mt-4"
                    onClick={() => handleRemoveField("mainAdv", index)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => handleAddField("mainAdv")}
          >
            Thêm Quảng Cáo Chính
          </button>
        </div>

        {/* Sub Advertisement Section */}
        <div className="mb-3">
          <h4>Quảng Cáo Phụ</h4>
          {subAdv.map((adv, index) => (
            <div key={index} className="mb-3">
              <div className="row">
                <div className="col-md-5">
                  <label
                    htmlFor={`subAdvDescription-${index}`}
                    className="form-label"
                  >
                    Mô tả Quảng Cáo Phụ
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id={`subAdvDescription-${index}`}
                    value={adv.description}
                    onChange={(e) =>
                      handleChange(e, "subAdv", index, "description")
                    }
                    placeholder="Nhập mô tả"
                  />
                </div>
                <div className="col-md-5">
                  <label
                    htmlFor={`subAdvImage-${index}`}
                    className="form-label"
                  >
                    Hình ảnh Quảng Cáo Phụ
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id={`subAdvImage-${index}`}
                    value={adv.image}
                    onChange={(e) => handleChange(e, "subAdv", index, "image")}
                    placeholder="Nhập URL hình ảnh"
                  />
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-danger mt-4"
                    onClick={() => handleRemoveField("subAdv", index)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => handleAddField("subAdv")}
          >
            Thêm Quảng Cáo Phụ
          </button>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}
          >
            {loading ? "Đang thêm..." : "Thêm"}
          </button>
        </div>
        <div className="text-start mt-5">
          <Button
            type="primary"
            onClick={() => navigate("/admin/advertisement-list")}
          >
            Quay lại Danh Sách Quảng Cáo
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddAdvertisement;
