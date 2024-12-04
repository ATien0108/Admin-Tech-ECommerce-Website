import React, { useState, useEffect } from "react";
import { message } from "antd";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditCoupon = () => {
  const [couponCode, setCouponCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState(1);
  const [minimumOrderAmount, setMinimumOrderAmount] = useState("");
  const [maxDiscountAmount, setMaxDiscountAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [usageCount, setUsageCount] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams(); // Lấy ID mã giảm giá từ URL
  const navigate = useNavigate();

  // Lấy thông tin mã giảm giá khi component được tải
  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:8081/api/coupons/${id}`
        );
        const coupon = response.data;

        // Đặt giá trị vào state
        setCouponCode(coupon.code);
        setDescription(coupon.description);
        setDiscountType(coupon.discountType);
        setDiscountValue(coupon.discountValue);
        setMinimumOrderAmount(coupon.minimumOrderAmount || "");
        setMaxDiscountAmount(coupon.maxDiscountAmount || "");
        setStartDate(coupon.startDate.split("T")[0]);
        setEndDate(coupon.endDate.split("T")[0]);
        setUsageLimit(coupon.usageLimit || "");
        setUsageCount(coupon.usageCount || 0);
        setIsActive(coupon.active);
      } catch (error) {
        console.error("Không thể lấy thông tin mã giảm giá:", error);
        message.error("Không thể tải thông tin mã giảm giá.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoupon();
  }, [id]);

  // Xử lý thay đổi loại giảm giá
  const handleDiscountTypeChange = (e) => {
    setDiscountType(e.target.value);
    if (e.target.value === "PERCENTAGE") {
      setDiscountValue(1);
    } else {
      setDiscountValue(10000);
    }
  };

  // Xử lý gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedCoupon = {
      code: couponCode,
      description,
      discountType,
      discountValue,
      minimumOrderAmount: minimumOrderAmount || 0,
      maxDiscountAmount: maxDiscountAmount || 0,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      usageLimit: usageLimit || 0,
      usageCount: usageCount,
      active: isActive,
    };

    try {
      setIsLoading(true);
      await axios.put(
        `http://localhost:8081/api/coupons/update/${id}`,
        updatedCoupon
      );
      message.success("Cập nhật mã giảm giá thành công.");
      navigate("/admin/coupon-list");
    } catch (error) {
      console.error("Không thể cập nhật mã giảm giá:", error);
      message.error("Cập nhật mã giảm giá thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 title">Chỉnh sửa mã giảm giá</h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-12 mb-3">
            <label htmlFor="couponCode" className="form-label">
              Mã giảm giá
            </label>
            <input
              type="text"
              id="couponCode"
              className="form-control"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Nhập mã giảm giá"
              required
            />
          </div>
          <div className="col-md-12 mb-3">
            <label htmlFor="description" className="form-label">
              Mô tả
            </label>
            <textarea
              id="description"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả cho mã giảm giá"
              rows="4"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="discountType" className="form-label">
              Loại giảm giá
            </label>
            <select
              id="discountType"
              className="form-control"
              value={discountType}
              onChange={handleDiscountTypeChange}
              required
            >
              <option value="PERCENTAGE">Phần trăm</option>
              <option value="FIXED">Số tiền cố định</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="discountValue" className="form-label">
              Giá trị giảm giá
            </label>
            <input
              type="number"
              id="discountValue"
              className="form-control"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              min={discountType === "PERCENTAGE" ? 1 : 10000}
              max={discountType === "PERCENTAGE" ? 100 : 1000000}
              required
            />
          </div>
          {discountType === "PERCENTAGE" && (
            <div className="col-md-6 mb-3">
              <label htmlFor="maxDiscountAmount" className="form-label">
                Mức giảm tối đa
              </label>
              <input
                type="number"
                id="maxDiscountAmount"
                className="form-control"
                value={maxDiscountAmount}
                onChange={(e) => setMaxDiscountAmount(e.target.value)}
              />
            </div>
          )}
          <div className="col-md-6 mb-3">
            <label htmlFor="minimumOrderAmount" className="form-label">
              Số tiền đơn hàng tối thiểu
            </label>
            <input
              type="number"
              id="minimumOrderAmount"
              className="form-control"
              value={minimumOrderAmount}
              onChange={(e) => setMinimumOrderAmount(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="startDate" className="form-label">
              Ngày bắt đầu
            </label>
            <input
              type="date"
              id="startDate"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="endDate" className="form-label">
              Ngày kết thúc
            </label>
            <input
              type="date"
              id="endDate"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="usageLimit" className="form-label">
              Giới hạn số lần sử dụng
            </label>
            <input
              type="number"
              id="usageLimit"
              className="form-control"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="isActive" className="form-label">
              Kích hoạt?
            </label>
            <div>
              <label>
                <input
                  type="radio"
                  name="isActive"
                  value="true"
                  checked={isActive === true}
                  onChange={() => setIsActive(true)}
                />
                Có
              </label>
              <label>
                <input
                  type="radio"
                  name="isActive"
                  value="false"
                  checked={isActive === false}
                  onChange={() => setIsActive(false)}
                />
                Không
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 text-center">
            <button
              type="submit"
              className="btn btn-success"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditCoupon;
