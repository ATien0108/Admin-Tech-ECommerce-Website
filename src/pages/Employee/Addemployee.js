import React, { useState } from "react";
import { message, Button } from "antd";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AddEmployee = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [usernameExists, setUsernameExists] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchText = location.state?.searchText || "";

  // Lưu trạng thái lỗi
  const [errors, setErrors] = useState({});

  const checkUsername = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/employees/username/${username}`
      );
      setUsernameExists(response.data);
    } catch (error) {
      console.error("Lỗi kiểm tra tên nhân viên:", error);
      message.error("Không thể xác minh tên nhân viên. Vui lòng thử lại.");
    }
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    if (value) {
      checkUsername(value);
    }
  };

  const validateFields = () => {
    const newErrors = {};

    if (!username) newErrors.username = "Vui lòng nhập tên nhân viên.";
    if (!email) newErrors.email = "Vui lòng nhập email.";
    if (!password) newErrors.password = "Vui lòng nhập mật khẩu.";
    if (!phoneNumber) newErrors.phoneNumber = "Vui lòng nhập số điện thoại.";
    if (!role) newErrors.role = "Vui lòng chọn vai trò.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra dữ liệu
    if (!validateFields()) {
      return;
    }

    if (usernameExists) {
      message.error("Tên nhân viên đã tồn tại. Vui lòng chọn tên khác.");
      return;
    }

    const employeeData = {
      username,
      email,
      password,
      phoneNumber,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await axios.post(
        "http://localhost:8081/api/employees/add",
        employeeData
      );
      if (response.status === 200) {
        message.success("Nhân viên đã được thêm thành công.");
        setUsername("");
        setEmail("");
        setPassword("");
        setPhoneNumber("");
        setRole("");
        navigate("/admin/employee-list");
      }
    } catch (error) {
      console.error("Lỗi khi thêm nhân viên:", error);
      message.error("Không thể thêm nhân viên. Vui lòng thử lại.");
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-center title">Thêm nhân viên</h3>
      <form onSubmit={handleSubmit}>
        <div className="row d-flex justify-content-center">
          <div className="col-md-6 mb-3">
            <label htmlFor="username" className="form-label">
              Tên nhân viên
            </label>
            <input
              type="text"
              id="username"
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              value={username}
              onChange={handleUsernameChange}
              placeholder="Nhập Tên Nhân Viên"
            />
            {errors.username && (
              <div className="invalid-feedback">{errors.username}</div>
            )}
          </div>
        </div>

        <div className="row d-flex justify-content-center">
          <div className="col-md-6 mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập Email"
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
        </div>

        <div className="row d-flex justify-content-center">
          <div className="col-md-6 mb-3">
            <label htmlFor="password" className="form-label">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>
        </div>

        <div className="row d-flex justify-content-center">
          <div className="col-md-6 mb-3">
            <label htmlFor="phoneNumber" className="form-label">
              Số điện thoại
            </label>
            <input
              type="text"
              id="phoneNumber"
              className={`form-control ${
                errors.phoneNumber ? "is-invalid" : ""
              }`}
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  // Chỉ cho phép số
                  setPhoneNumber(value);
                }
              }}
              placeholder="Nhập số điện thoại"
              required
            />
            {errors.phoneNumber && (
              <div className="invalid-feedback">{errors.phoneNumber}</div>
            )}
          </div>
        </div>

        <div className="row d-flex justify-content-center">
          <div className="col-md-6 mb-3">
            <label htmlFor="role" className="form-label">
              Vai trò
            </label>
            <select
              id="role"
              className={`form-control ${errors.role ? "is-invalid" : ""}`}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="" disabled>
                Chọn vai trò...
              </option>
              <option value="Quản lý">Quản lý</option>
              <option value="Cộng tác viên bán hàng">
                Cộng tác viên bán hàng
              </option>
              <option value="Nhân viên kho">Nhân viên kho</option>
              <option value="Dịch vụ khách hàng">Dịch vụ khách hàng</option>
              <option value="Kế toán viên">Kế toán viên</option>
              <option value="Hỗ trợ CNTT">Hỗ trợ CNTT</option>
              <option value="Logistics">Logistics</option>
              <option value="Tiếp thị">Tiếp thị</option>
              <option value="Chuyên gia nhân sự">Chuyên gia nhân sự</option>
              <option value="Nhà phân tích kinh doanh">
                Nhà phân tích kinh doanh
              </option>
            </select>
            {errors.role && (
              <div className="invalid-feedback">{errors.role}</div>
            )}
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-6 offset-md-3 text-center">
            <button type="submit" className="btn btn-success btn-lg w-20">
              Thêm
            </button>
          </div>
          <div className="text-start mt-5">
            <Button
              type="primary"
              onClick={() =>
                navigate("/admin/employee-list", { state: { searchText } })
              }
            >
              Quay lại Danh Sách Nhân Viên
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
