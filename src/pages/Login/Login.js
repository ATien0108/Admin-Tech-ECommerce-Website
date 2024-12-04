import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { login } from "../../features/auth/authSlice";
import CustomInput from "../../components/CustomInput"; // Giả sử CustomInput là component tùy chỉnh của bạn
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Dùng hook navigate để điều hướng sau khi đăng nhập thành công
  const [error, setError] = useState("");

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const resultAction = await dispatch(login(values));
        if (resultAction.error) {
          setError(resultAction.error.message);
        } else {
          // Lưu thông tin người dùng vào localStorage
          const { email, username } = resultAction.payload; // Lấy thông tin từ payload (tùy vào API của bạn)
          localStorage.setItem("email", email);
          localStorage.setItem("username", username);

          // Điều hướng đến trang admin/dashboard
          navigate("/admin");
        }
      } catch (err) {
        setError("Login failed. Please try again.");
      }
    },
  });

  return (
    <div className="py-5" style={{ background: "#e3e3e3", minHeight: "100vh" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="my-5 bg-white rounded-3 p-4">
              <h3 className="text-center">Đăng nhập</h3>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={formik.handleSubmit}>
                <CustomInput
                  type="email"
                  label="Email"
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-danger mb-2">{formik.errors.email}</div>
                )}

                <CustomInput
                  type="password"
                  label="Mật khẩu"
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="text-danger mb-2">
                    {formik.errors.password}
                  </div>
                )}

                <div className="mb-3 text-end">
                  <Link to="forgot-password">Quên mật khẩu?</Link>
                </div>

                <button
                  className="border-0 px-3 py-2 fw-bold w-100 text-center text-black fs-5"
                  style={{ background: "#98c2ff" }}
                  type="submit"
                >
                  Đăng nhập
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
