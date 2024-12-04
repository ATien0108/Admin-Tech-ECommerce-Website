import React, { useState } from "react";
import { message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCoupon = () => {
  const [couponCode, setCouponCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState(1);
  const [minimumOrderAmount, setMinimumOrderAmount] = useState("");
  const [maxDiscountAmount, setMaxDiscountAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [usageCount, setUsageCount] = useState(0); // New state for usageCount
  const [isActive, setIsActive] = useState(true); // State for isActive
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle discount type change
  const handleDiscountTypeChange = (e) => {
    setDiscountType(e.target.value);
    if (e.target.value === "PERCENTAGE") {
      setDiscountValue(1); // Reset discountValue to 1 for percentage
    } else {
      setDiscountValue(10000); // Reset discountValue to a default fixed amount
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log giá trị isActive để kiểm tra
    console.log("Giá trị isActive:", isActive); // Log ra isActive

    const couponData = {
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
      active: isActive, // Đảm bảo isActive được truyền đúng
    };

    console.log("couponData before sending:", couponData);

    try {
      setIsLoading(true);
      await axios.post("http://localhost:8081/api/coupons/add", couponData);
      message.success("Mã giảm giá đã được thêm thành công.");
      navigate("/admin/coupon-list");
    } catch (error) {
      console.error("Lỗi khi thêm mã giảm giá:", error);
      message.error("Thêm mã giảm giá thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 title">Thêm Mã Giảm Giá</h3>
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
              Mô tả mã giảm giá
            </label>
            <textarea
              id="description"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả mã giảm giá"
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
              <option value="PERCENTAGE">PERCENTAGE</option>
              <option value="FIXED">FIXED</option>
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
                Số tiền giảm tối đa
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
              Ngày hết hạn
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
              Giới hạn sử dụng
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

          {/* Thêm phần lựa chọn isActive */}
          <div className="col-md-6 mb-3">
            <label htmlFor="isActive" className="form-label">
              Mã giảm giá có hoạt động?
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
              {isLoading ? "Đang thêm..." : "Thêm"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddCoupon;
