import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // import useParams
import axios from "axios";
import CustomInput from "../../components/CustomInput";

const ResetPassword = () => {
  const { type, token } = useParams(); // Lấy type và token từ URL
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!token) {
      setError("Invalid reset token.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Chỉnh sửa URL để truyền token vào đúng đường dẫn
      const response = await axios.post(
        `http://localhost:8081/api/employees/reset-password/${token}`, // Thêm token vào URL
        { newPassword } // Gửi chỉ newPassword, không cần gửi lại token vì nó đã có trong URL
      );
      setMessage(response.data.message);
      setError(null);
      navigate("/");
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
      setMessage(null);
    }
  };

  return (
    <div className="py-5" style={{ background: "#e3e3e3", minHeight: "100vh" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-6 col-sm-8 bg-white rounded-3 p-4">
            <h3 className="text-center title">Reset Password</h3>
            <p className="text-center">Please Enter your new password.</p>
            <form onSubmit={handleSubmit}>
              <CustomInput
                type="password"
                label="New Password"
                id="pass"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <CustomInput
                type="password"
                label="Confirm Password"
                id="confirmpass"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                className="border-0 px-3 py-2 fw-bold w-100"
                style={{ background: "#98c2ff" }}
                type="submit"
              >
                Reset Password
              </button>
            </form>
            {message && (
              <div className="alert alert-success mt-3">{message}</div>
            )}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
