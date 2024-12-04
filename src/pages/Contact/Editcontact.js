import React, { useState, useEffect } from "react";
import "antd/dist/reset.css"; // Nhập khẩu các kiểu của Ant Design
import "bootstrap/dist/css/bootstrap.min.css"; // Nhập khẩu các kiểu của Bootstrap
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";

const EditContact = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: {
      street: "",
      communes: "",
      district: "",
      city: "",
      country: "",
    },
    timeServing: "",
    phone_number: [""],
    email: [""],
    googleMap: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/contact/${id}`)
      .then((response) => {
        const contact = response.data;
        setFormData({
          address: {
            street: contact.address?.street || "",
            communes: contact.address?.communes || "",
            district: contact.address?.district || "",
            city: contact.address?.city || "",
            country: contact.address?.country || "",
          },
          timeServing: contact.timeServing || "",
          phone_number: contact.phone_number || [""],
          email: contact.email || [""],
          googleMap: contact.googleMap || "",
        });
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu liên hệ:", error);
        message.error("Lấy dữ liệu liên hệ thất bại.");
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:8081/api/contact/update/${id}`, formData)
      .then(() => {
        message.success("Cập nhật liên hệ thành công.");
        navigate("/admin/contact"); // Chuyển hướng đến danh sách liên hệ
      })
      .catch((error) => {
        console.error(error);
        message.error("Cập nhật liên hệ thất bại.");
      });
  };

  const handleDelete = () => {
    axios
      .delete(`http://localhost:8081/api/contact/delete/${id}`)
      .then(() => {
        message.success("Xóa liên hệ thành công.");
        navigate("/admin/contact"); // Chuyển hướng đến danh sách liên hệ
      })
      .catch((error) => {
        console.error(error);
        message.error("Xóa liên hệ thất bại.");
      });
  };

  // Phương thức mới để xóa email
  const removeEmail = (index) => {
    const newEmails = formData.email.filter((_, i) => i !== index);
    setFormData({ ...formData, email: newEmails });
  };

  // Phương thức mới để xóa số điện thoại
  const removePhoneNumber = (index) => {
    const newPhones = formData.phone_number.filter((_, i) => i !== index);
    setFormData({ ...formData, phone_number: newPhones });
  };

  if (!formData) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center">Chỉnh sửa liên hệ</h3>
      <form onSubmit={handleSave}>
        {/* Các trường địa chỉ */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="street" className="form-label">
              Đường
            </label>
            <input
              type="text"
              id="street"
              name="address.street"
              className="form-control"
              value={formData.address.street}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="communes" className="form-label">
              Xã/Phường
            </label>
            <input
              type="text"
              id="communes"
              name="address.communes"
              className="form-control"
              value={formData.address.communes}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="district" className="form-label">
              Quận/Huyện
            </label>
            <input
              type="text"
              id="district"
              name="address.district"
              className="form-control"
              value={formData.address.district}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="city" className="form-label">
              Thành phố
            </label>
            <input
              type="text"
              id="city"
              name="address.city"
              className="form-control"
              value={formData.address.city}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="country" className="form-label">
              Quốc gia
            </label>
            <input
              type="text"
              id="country"
              name="address.country"
              className="form-control"
              value={formData.address.country}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Trường giờ phục vụ */}
        <div className="mb-3">
          <label htmlFor="timeServing" className="form-label">
            Giờ phục vụ
          </label>
          <input
            type="text"
            id="timeServing"
            name="timeServing"
            className="form-control"
            value={formData.timeServing}
            onChange={handleChange}
            required
          />
        </div>

        {/* Các địa chỉ email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Địa chỉ Email
          </label>
          {formData.email.map((email, index) => (
            <div key={index} className="input-group mb-2">
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => {
                  const newEmails = [...formData.email];
                  newEmails[index] = e.target.value;
                  setFormData({ ...formData, email: newEmails });
                }}
                required
              />
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeEmail(index)}
              >
                Xóa
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary mb-2"
            onClick={() => {
              setFormData({ ...formData, email: [...formData.email, ""] });
            }}
          >
            Thêm Email
          </button>
        </div>

        {/* Các số điện thoại */}
        <div className="mb-3">
          <label htmlFor="phone_number" className="form-label">
            Số điện thoại
          </label>
          {formData.phone_number.map((phone, index) => (
            <div key={index} className="input-group mb-2">
              <input
                type="text"
                className="form-control"
                value={phone}
                onChange={(e) => {
                  const newPhones = [...formData.phone_number];
                  newPhones[index] = e.target.value;
                  setFormData({ ...formData, phone_number: newPhones });
                }}
                required
              />
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removePhoneNumber(index)}
              >
                Xóa
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary mb-2"
            onClick={() => {
              setFormData({
                ...formData,
                phone_number: [...formData.phone_number, ""],
              });
            }}
          >
            Thêm Số Điện Thoại
          </button>
        </div>

        {/* Trường Google Map */}
        <div className="mb-3">
          <label htmlFor="googleMap" className="form-label">
            URL Google Map
          </label>
          <input
            type="text"
            id="googleMap"
            name="googleMap"
            className="form-control"
            value={formData.googleMap}
            onChange={handleChange}
            required
          />
        </div>

        {/* Các nút hành động */}
        <div className="row">
          <div className="col-md-12 text-center">
            <button type="submit" className="btn btn-primary">
              Lưu
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditContact;
