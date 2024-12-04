import React, { useState, useEffect } from "react";
import { message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customerData, setCustomerData] = useState({
    username: "",
    email: "",
    phone_number: "",
    street: "",
    communes: "",
    district: "",
    city: "",
    country: "",
    password: "********", // Mật khẩu ẩn
    avatar: null,
    currentAvatar: "",
  });

  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/users/${id}`)
      .then((response) => {
        const customer = response.data;

        setCustomerData({
          username: customer.username,
          email: customer.email,
          phone_number: customer.phone_number,
          street: customer.address.street,
          communes: customer.address.communes,
          district: customer.address.district,
          city: customer.address.city,
          country: customer.address.country,
          password: "********",
          avatar: null,
          currentAvatar: customer.avatar,
        });
        setPreviewImage(customer.avatar);
      })
      .catch((error) => {
        message.error("Không thể tải dữ liệu khách hàng.");
        console.error(error);
        navigate("/admin/customers-list");
      });
  }, [id, navigate]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCustomerData((prev) => ({
        ...prev,
        avatar: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const {
      username,
      email,
      phone_number,
      street,
      communes,
      district,
      city,
      country,
      avatar,
    } = customerData;

    if (
      !username ||
      !email ||
      !phone_number ||
      !street ||
      !communes ||
      !district ||
      !city ||
      !country
    ) {
      message.error("Vui lòng điền đầy đủ thông tin.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("phone_number", phone_number);
      formData.append("address.street", street);
      formData.append("address.communes", communes);
      formData.append("address.district", district);
      formData.append("address.city", city);
      formData.append("address.country", country);

      if (avatar) {
        formData.append("image", avatar);
      }

      await axios.put(
        `http://localhost:8081/api/users/update/${id}/admin`,

        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Cập nhật khách hàng thành công.");
      navigate("/admin/customers-list");
    } catch (error) {
      console.error(error);
      message.error(
        error.response?.data || "Có lỗi xảy ra khi cập nhật thông tin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Chỉnh sửa khách hàng</h3>
      <form onSubmit={handleSubmit}>
        {/* Các trường thông tin */}
        <div className="row">
          {[
            { label: "Tên người dùng", name: "username", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Số điện thoại", name: "phone_number", type: "text" },
            { label: "Đường", name: "street", type: "text" },
            { label: "Xã/Phường", name: "communes", type: "text" },
            { label: "Quận/Huyện", name: "district", type: "text" },
            { label: "Thành phố", name: "city", type: "text" },
            { label: "Quốc gia", name: "country", type: "text" },
          ].map(({ label, name, type }, index) => (
            <div className="col-md-6 mb-3" key={index}>
              <label className="form-label">{label}</label>
              <input
                type={type}
                name={name}
                value={customerData[name]}
                onChange={handleChange}
                className="form-control"
                placeholder={`Nhập ${label.toLowerCase()}`}
              />
            </div>
          ))}
        </div>

        {/* Avatar và mật khẩu */}
        <div className="row mb-4">
          {/* Avatar */}
          <div className="col-md-6">
            <label className="form-label">Ảnh đại diện</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleAvatarChange}
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Ảnh đại diện"
                className="mt-3 rounded"
                style={{ maxHeight: "100px", maxWidth: "100%" }}
              />
            )}
          </div>

          {/* Mật khẩu */}
          <div className="col-md-6">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={customerData.password}
              className="form-control"
              disabled
            />
          </div>
        </div>

        {/* Nút lưu */}
        <div className="d-flex justify-content-center mt-4">
          <button type="submit" className="btn btn-primary w-20">
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCustomer;
