import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { message, Button } from "antd";

const EditAdvertisement = () => {
  const { id } = useParams(); // Fetch the advertisement ID from the URL
  const navigate = useNavigate();

  const [mainAdv, setMainAdv] = useState([]);
  const [subAdv, setSubAdv] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch advertisement data by ID when the component mounts
    setLoading(true);
    axios
      .get(`http://localhost:8081/api/advertisement/${id}`)
      .then((response) => {
        const { mainAdv, subAdv } = response.data;
        setMainAdv(mainAdv || []);
        setSubAdv(subAdv || []);
        setLoading(false);
      })
      .catch((error) => {
        message.error("Không thể tải dữ liệu quảng cáo.");
        setLoading(false);
      });
  }, [id]);

  // Handle change in Main advertisement field (image or description)
  const handleMainAdvChange = (index, field, value) => {
    const updatedMainAdv = [...mainAdv];
    updatedMainAdv[index][field] = value;
    setMainAdv(updatedMainAdv);
  };

  // Handle change in Sub advertisement field (image or description)
  const handleSubAdvChange = (index, field, value) => {
    const updatedSubAdv = [...subAdv];
    updatedSubAdv[index][field] = value;
    setSubAdv(updatedSubAdv);
  };

  // Handle adding a new advertisement (main or sub)
  const handleAddAdv = (type) => {
    if (type === "main") {
      setMainAdv([...mainAdv, { image: "", description: "" }]);
    } else {
      setSubAdv([...subAdv, { image: "", description: "" }]);
    }
  };

  // Handle removing an advertisement (main or sub)
  const handleRemoveAdv = (index, type) => {
    if (type === "main") {
      setMainAdv(mainAdv.filter((_, i) => i !== index));
    } else {
      setSubAdv(subAdv.filter((_, i) => i !== index));
    }
  };

  // Handle removing an image
  const handleRemoveImage = (index, type) => {
    if (type === "main") {
      const updatedMainAdv = [...mainAdv];
      updatedMainAdv[index].image = ""; // Remove image
      setMainAdv(updatedMainAdv);
    } else {
      const updatedSubAdv = [...subAdv];
      updatedSubAdv[index].image = ""; // Remove image
      setSubAdv(updatedSubAdv);
    }
  };

  // Handle adding a new image for an advertisement
  const handleAddImage = (index, type) => {
    const newImage = prompt("Nhập URL hình ảnh mới:");
    if (newImage) {
      if (type === "main") {
        const updatedMainAdv = [...mainAdv];
        updatedMainAdv[index].image = newImage; // Add new image URL
        setMainAdv(updatedMainAdv);
      } else {
        const updatedSubAdv = [...subAdv];
        updatedSubAdv[index].image = newImage; // Add new image URL
        setSubAdv(updatedSubAdv);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Không bao gồm trường createdAt trong yêu cầu PUT để tránh thay đổi nó
      await axios.put(`http://localhost:8081/api/advertisement/update/${id}`, {
        mainAdv,
        subAdv,
      });
      message.success("Cập nhật quảng cáo thành công.");
      navigate("/admin/advertisement-list"); // Chuyển hướng đến trang danh sách sau khi cập nhật thành công
    } catch (error) {
      message.error("Đã xảy ra lỗi khi cập nhật quảng cáo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Chỉnh sửa Quảng cáo</h3>
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Main Advertisement Section */}
          <div className="mb-4">
            <h4>Quảng Cáo Chính</h4>
            {mainAdv.map((adv, index) => (
              <div key={index} className="row mb-3">
                <div className="col-md-5">
                  <div className="form-group">
                    <label>Hình ảnh</label>
                    <div className="d-flex">
                      <input
                        type="text"
                        className="form-control"
                        value={adv.image}
                        onChange={(e) =>
                          handleMainAdvChange(index, "image", e.target.value)
                        }
                        placeholder="Nhập URL hình ảnh"
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    {" "}
                    {/* Cập nhật col-md-5 thành col-md-12 để chiếm toàn bộ chiều rộng */}
                    <label
                      htmlFor={`mainAdvDescription-${index}`}
                      className="form-label"
                    >
                      Mô tả Quảng Cáo Chính
                    </label>
                    <textarea
                      className="form-control"
                      id={`mainAdvDescription-${index}`}
                      value={adv.description}
                      onChange={(e) =>
                        handleMainAdvChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Nhập mô tả"
                      rows={3} // Số dòng mặc định
                      style={{ width: "100%" }} // Chiều rộng 100% của phần tử cha
                    />
                  </div>
                </div>

                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-danger mt-4"
                    onClick={() => handleRemoveAdv(index, "main")}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary mb-4"
              onClick={() => handleAddAdv("main")}
            >
              Thêm Quảng Cáo Chính
            </button>
          </div>

          {/* Sub Advertisement Section */}
          <div className="mb-4">
            <h4>Quảng Cáo Phụ</h4>
            {subAdv.map((adv, index) => (
              <div key={index} className="row mb-3">
                <div className="col-md-5">
                  <div className="form-group">
                    <label>Hình ảnh</label>
                    <div className="d-flex">
                      <input
                        type="text"
                        className="form-control"
                        value={adv.image}
                        onChange={(e) =>
                          handleSubAdvChange(index, "image", e.target.value)
                        }
                        placeholder="Nhập URL hình ảnh"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    {" "}
                    {/* Cập nhật col-md-5 thành col-md-12 để chiếm toàn bộ chiều rộng */}
                    <label
                      htmlFor={`mainAdvDescription-${index}`}
                      className="form-label"
                    >
                      Mô tả Quảng Cáo Phụ
                    </label>
                    <textarea
                      className="form-control"
                      id={`mainAdvDescription-${index}`}
                      value={adv.description}
                      onChange={(e) =>
                        handleSubAdvChange(index, "description", e.target.value)
                      }
                      placeholder="Nhập mô tả"
                      rows={3} // Số dòng mặc định
                      style={{ width: "100%" }} // Chiều rộng 100% của phần tử cha
                    />
                  </div>
                </div>

                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-danger mt-4"
                    onClick={() => handleRemoveAdv(index, "sub")}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary mb-4"
              onClick={() => handleAddAdv("sub")}
            >
              Thêm Quảng Cáo Phụ
            </button>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading}
              style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}
            >
              {loading ? "Đang cập nhật..." : "Lưu"}
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
      )}
    </div>
  );
};

export default EditAdvertisement;
