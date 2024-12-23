import React, { useState } from "react";
import { message, Button } from "antd";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

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
  const location = useLocation();
  const searchText = location.state?.searchText || "";

  // Handle discount type change
  const handleDiscountTypeChange = (e) => {
    const type = e.target.value;
    setDiscountType(type);

    if (type === "PERCENTAGE") {
      setDiscountValue(1); // Đặt giá trị mặc định
    } else {
      setDiscountValue(10000); // Giá trị mặc định cho loại FIXED
    }
  };

  const handleDiscountValueChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (discountType === "PERCENTAGE") {
      setDiscountValue(Math.min(Math.max(1, value), 100)); // Giá trị phải trong khoảng 1-100
    } else {
      setDiscountValue(Math.max(0, value)); // Giá trị không được âm
    }
  };

  const handleMaxDiscountAmountChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setMaxDiscountAmount(Math.max(0, value)); // Giá trị không được âm
  };

  const handleMinimumOrderAmountChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setMinimumOrderAmount(Math.max(0, value)); // Giá trị không được âm
  };

  const handleUsageLimitChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setUsageLimit(Math.max(0, value)); // Giá trị không được âm
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra các ràng buộc
    if (
      discountValue < 1 ||
      (discountType === "PERCENTAGE" && discountValue > 100)
    ) {
      message.error(
        "Giá trị giảm giá (Phần trăm) phải nằm trong khoảng 1 đến 100."
      );
      return;
    }

    if (
      discountValue < 0 ||
      maxDiscountAmount < 0 ||
      minimumOrderAmount < 0 ||
      usageLimit < 0
    ) {
      message.error(
        "Giá trị giảm giá, Số tiền giảm tối đa, Số tiền đơn hàng tối thiểu và Giới hạn sử dụng không được là số âm."
      );
      return;
    }

    if (discountType === "FIXED") {
      if (maxDiscountAmount > discountValue) {
        message.error(
          "Số tiền giảm tối đa không được lớn hơn Giá trị giảm giá khi loại giảm giá là Số tiền cố định."
        );
        return;
      }
      if (discountValue >= minimumOrderAmount) {
        message.error(
          "Giá trị giảm giá phải nhỏ hơn Số tiền đơn hàng tối thiểu khi loại giảm giá là Số tiền cố định."
        );
        return;
      }
    }

    if (maxDiscountAmount > minimumOrderAmount) {
      message.error(
        "Số tiền giảm tối đa phải nhỏ hơn hoặc bằng Số tiền đơn hàng tối thiểu."
      );
      return;
    }

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
      active: isActive,
    };

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
              onChange={(e) => {
                const value = Number(e.target.value);
                if (
                  discountType === "PERCENTAGE" &&
                  (value < 1 || value > 100)
                ) {
                  message.error(
                    "Giá trị giảm giá (Phần trăm) phải nằm trong khoảng 1 đến 100."
                  );
                  return;
                }
                if (value < 0) {
                  message.error("Giá trị giảm giá không được là số âm.");
                  return;
                }
                setDiscountValue(value);
              }}
              min={discountType === "PERCENTAGE" ? 1 : 0}
              max={discountType === "PERCENTAGE" ? 100 : undefined}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="maxDiscountAmount" className="form-label">
              Số tiền giảm tối đa
            </label>
            <input
              type="number"
              id="maxDiscountAmount"
              className="form-control"
              value={maxDiscountAmount}
              onChange={handleMaxDiscountAmountChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="minimumOrderAmount" className="form-label">
              Số tiền đơn hàng tối thiểu
            </label>
            <input
              type="number"
              id="minimumOrderAmount"
              className="form-control"
              value={minimumOrderAmount}
              onChange={handleMinimumOrderAmountChange}
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
              onChange={handleUsageLimitChange}
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
              disabled={
                isLoading || // Đang tải
                discountValue < 1 ||
                (discountType === "PERCENTAGE" && discountValue > 100) ||
                maxDiscountAmount > minimumOrderAmount ||
                (discountType === "FIXED" && maxDiscountAmount > discountValue)
              }
            >
              {isLoading ? "Đang thêm..." : "Thêm"}
            </button>
          </div>
          <div className="text-start mt-5">
            <Button
              type="primary"
              onClick={() =>
                navigate("/admin/coupon-list", { state: { searchText } })
              }
            >
              Quay lại Danh Sách Mã Giảm Giá
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddCoupon;
