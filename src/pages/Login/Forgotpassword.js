import React, { useState } from "react";
import CustomInput from "../../components/CustomInput";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8081/api/employees/forgot-password", // Backend endpoint for forgot password
        { email }
      );
      setMessage(response.data.message); // Display success message
      setError(null); // Reset error message
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
      setMessage(null); // Reset success message
    }
  };

  return (
    <div className="py-5" style={{ background: "#e3e3e3", minHeight: "100vh" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="bg-white rounded-3 p-4 my-5">
              <h3 className="text-center title">Quên mật khẩu</h3>
              <p className="text-center">
                Vui lòng nhập email đã đăng ký để nhận lại mật khẩu liên kết.
              </p>
              <form onSubmit={handleSubmit}>
                <CustomInput
                  type="email"
                  label="Email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  className="border-0 px-3 py-2 fw-bold w-100"
                  style={{ background: "#98c2ff" }}
                  type="submit"
                >
                  Gửi
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
    </div>
  );
};

export default ForgotPassword;
