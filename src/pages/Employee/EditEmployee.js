import React, { useEffect, useState } from "react";
import { message, Spin, Button } from "antd";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [employeeId, setEmployeeId] = useState(null);
  const [usernameExists, setUsernameExists] = useState(false);
  const location = useLocation();
  const [emailError, setEmailError] = useState(false);

  const searchText = location.state?.searchText || "";

  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/employees/${id}`)
      .then((response) => {
        const employee = response.data;
        setUsername(employee.username);
        setEmail(employee.email);
        setPhoneNumber(employee.phoneNumber);
        setRole(employee.role);
        setCreatedAt(employee.createdAt);
        setUpdatedAt(employee.updatedAt);
        setLoading(false);
        setEmployeeId(employee.id);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id, navigate]);

  const handleUsernameChange = async (value) => {
    setUsername(value);
    if (value) {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/employees/username/${value}/exclude/${employeeId}`
        );
        setUsernameExists(response.data);
      } catch (error) {
        console.error("Lỗi kiểm tra tên nhân viên:", error);
      }
    } else {
      setUsernameExists(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra dữ liệu
    if (!username || !email || !phoneNumber || !role) {
      message.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      message.error("Định dạng email không hợp lệ.");
      return;
    }

    if (usernameExists) {
      message.error("Tên nhân viên đã tồn tại. Vui lòng chọn tên khác.");
      return;
    }

    const employeeData = {
      id: employeeId,
      username,
      email,
      password,
      phoneNumber,
      role,
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await axios.put(
        `http://localhost:8081/api/employees/update/${employeeId}`,
        employeeData
      );
      if (response.status !== 200) {
        throw new Error("Không cập nhật được dữ liệu nhân viên.");
      }
      message.success("Dữ liệu nhân viên được cập nhật thành công.");
      navigate("/admin/employee-list");
    } catch (error) {
      console.error("Lỗi cập nhật dữ liệu nhân viên:", error);
      message.error("Không thể cập nhật dữ liệu nhân viên.");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="container mt-4">
      <h3 className="mb-4 title text-center">Chỉnh sửa thông tin nhân viên</h3>
      <form
        onSubmit={handleSubmit}
        className="d-flex flex-column align-items-center"
      >
        {[
          // Updated input fields to match EditCustomer styling
          {
            label: "Tên nhân viên",
            value: username,
            setter: handleUsernameChange,
            error: !username ? "Vui lòng nhập tên nhân viên." : "",
          },
          {
            label: "Email",
            value: email,
            setter: setEmail,
            type: "email",
            error: !email ? "Vui lòng nhập email." : "",
          },
          {
            label: "Số điện thoại",
            value: phoneNumber,
            setter: (value) => {
              if (/^\d*$/.test(value)) {
                // Chỉ cho phép số
                setPhoneNumber(value);
              }
            },
            error: !phoneNumber ? "Vui lòng nhập số điện thoại." : "",
          },
        ].map((field, index) => (
          <div className="mb-3 w-50" key={index}>
            <label className="form-label">{field.label}</label>
            <input
              type="text"
              id={field.label.toLowerCase().replace(" ", "")}
              name={field.label.toLowerCase().replace(" ", "")}
              className={`form-control ${field.error ? "is-invalid" : ""}`}
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
            {field.error && (
              <div className="invalid-feedback">{field.error}</div>
            )}
          </div>
        ))}

        <div className="mb-3 w-50">
          <label htmlFor="role" className="form-label">
            Vai trò
          </label>
          <select
            id="role"
            name="role"
            value={role}
            className="form-control"
            onChange={(e) => setRole(e.target.value)}
          >
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
        </div>

        <div className="mb-3 w-50">
          <label htmlFor="createdAt" className="form-label">
            Ngày tạo
          </label>
          <input
            type="text"
            id="createdAt"
            className="form-control"
            value={createdAt}
            disabled
          />
        </div>
        <div className="mb-3 w-50">
          <label htmlFor="updatedAt" className="form-label">
            Ngày cập nhật
          </label>
          <input
            type="text"
            id="updatedAt"
            className="form-control"
            value={updatedAt}
            disabled
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="btn btn-success btn-lg"
            disabled={!username || !email || !phoneNumber || !role}
          >
            Lưu
          </button>
        </div>

        <div className="text-start mt-3">
          <Button
            type="primary"
            onClick={() =>
              navigate("/admin/employee-list", { state: { searchText } })
            }
          >
            Quay lại Danh Sách Nhân Viên
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditEmployee;
