import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Col, Row } from "antd";
import { useParams } from "react-router-dom";
import ReactStars from "react-rating-stars-component";

const Productdetails = () => {
  const { productName } = useParams(); // Get the product name from the URL
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]); // Reviews state
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/products/search?q=${productName}`
        );
        if (response.status === 200) {
          const data = response.data[0];
          setProductData(data); // Set product data

          // Fetch additional data like brand, category, etc.
          const { brand, category, condition, tags } = data;

          // Make API calls to fetch brand, category, condition, tags details
          const requests = [
            brand && axios.get(`http://localhost:8081/api/brands/${brand}`),
            category &&
              axios.get(`http://localhost:8081/api/categories/${category}`),
            condition &&
              axios.get(
                `http://localhost:8081/api/product-conditions/${condition}`
              ),
            ...(tags || []).map((tagId) =>
              axios.get(`http://localhost:8081/api/tags/${tagId}`)
            ),
          ].filter(Boolean); // Filter out undefined requests

          const results = await axios.all(requests);
          // Update product data with fetched details
          const updatedData = {
            ...data,
            brandName: results[0]?.data?.brandName || "N/A",
            categoryName: results[1]?.data?.cateName || "N/A",
            conditionName: results[2]?.data?.conditionName || "N/A",
            tagsNames: results.slice(3).map((res) => res.data.name),
          };

          setProductData(updatedData);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productName]);

  const fetchUsername = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/users/${userId}`
      );
      return response.data.username || "Ẩn danh"; // Fallback to "Ẩn danh" if no username is found
    } catch (error) {
      console.error("Error fetching username:", error);
      return "Ẩn danh"; // Fallback if there's an error
    }
  };

  // Fetch reviews once the product data is loaded
  useEffect(() => {
    const fetchReviews = async () => {
      if (productData && productData.id) {
        try {
          const response = await axios.get(
            `http://localhost:8081/api/reviews/product/${productData.id}`
          );
          const reviewsData = response.data;
          setReviews(reviewsData);

          // Now fetch username based on userId for each review
          const userRequests = reviewsData.map(
            (review) => fetchUsername(review.user) // Fetch username based on userId
          );

          const usernames = await Promise.all(userRequests);

          // Update the reviews with the fetched usernames
          const updatedReviews = reviewsData.map((review, index) => ({
            ...review,
            username: usernames[index], // Assign the fetched username
          }));

          setReviews(updatedReviews);
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      }
    };

    fetchReviews();
  }, [productData]);

  if (loading) {
    return <p>Đang tải...</p>;
  }

  if (!productData) {
    return <p>Không tìm thấy dữ liệu sản phẩm.</p>;
  }

  const formatCurrency = (amount) => {
    return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}₫`;
  };

  return (
    <div className="container">
      <h3 className="mb-4 title">Chi Tiết Sản Phẩm</h3>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card
            cover={
              <img
                alt="Ảnh chính"
                src={productData.mainImage}
                style={{ width: "100%", height: "auto" }}
              />
            }
          />
        </Col>
        <Col xs={24} md={12}>
          <Card title={productData.productName}>
            <p>
              <strong>Thương hiệu:</strong> {productData.brandName || "N/A"}
            </p>
            <p>
              <strong>Danh mục:</strong> {productData.categoryName || "N/A"}
            </p>
            <p>
              <strong>Tình trạng:</strong> {productData.conditionName || "N/A"}
            </p>
            <p>
              <strong>Thẻ:</strong>{" "}
              {productData.tagsNames?.length
                ? productData.tagsNames.join(", ")
                : "Không có thẻ"}
            </p>
            <p>
              <strong>Giá:</strong> {formatCurrency(productData.price) || "0"}
            </p>
            <p>
              <strong>Giá giảm:</strong>{" "}
              {formatCurrency(productData.discountPrice) || "0"}
            </p>
            <p>
              <strong>Mô tả:</strong>{" "}
              {productData.productDesc || "Không có mô tả."}
            </p>
            <p>
              <strong>Đánh giá trung bình:</strong>{" "}
              {productData.ratings?.average || "N/A"}
            </p>
            <p>
              <strong>Tổng số đánh giá:</strong>{" "}
              {productData.ratings?.totalReviews || 0}
            </p>
            <p>
              <strong>Ngày tạo:</strong>{" "}
              {new Date(productData.createdAt).toLocaleString() || "N/A"}
            </p>
            <p>
              <strong>Ngày cập nhật:</strong>{" "}
              {new Date(productData.updatedAt).toLocaleString() || "N/A"}
            </p>
          </Card>
        </Col>
      </Row>
      <h4>Ảnh Nhỏ</h4>
      <Row gutter={16}>
        {productData.thumbnails?.length > 0 ? (
          productData.thumbnails.map((thumb, index) => (
            <Col xs={12} md={6} key={index}>
              <img
                src={thumb}
                alt={`Ảnh nhỏ ${index}`}
                style={{ width: "100%", height: "auto" }}
              />
            </Col>
          ))
        ) : (
          <p>Không có ảnh nhỏ.</p>
        )}
      </Row>
      <h4>Thông Số Kỹ Thuật</h4>
      <Card>
        {productData.specifications &&
          Object.entries(productData.specifications).map(([key, value]) => (
            <p key={key}>
              <strong>{key.replace(/([A-Z])/g, " $1") + ":"}</strong> {value}
            </p>
          ))}
      </Card>
      <h4>Màu Sắc</h4>
      <Card>
        {productData.colors && productData.colors.length > 0 ? (
          productData.colors.map((color, index) => (
            <div key={index}>
              <p>
                <strong>Màu:</strong> {color.name || "N/A"}
              </p>
              <p>
                <strong>Số Lượng:</strong> {color.quantity || "N/A"}
              </p>
            </div>
          ))
        ) : (
          <p>Không có thông tin về màu sắc.</p>
        )}
      </Card>

      <h4>Đánh Giá</h4>
      <Card>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div
              key={review.id}
              className="rating-section"
              style={{ marginBottom: "10px" }}
            >
              <p>
                <strong>Tên người đánh giá:</strong>{" "}
                {review.username || "Ẩn danh"}
              </p>
              <ReactStars
                count={5}
                value={review.rating}
                size={28}
                isHalf={true}
                edit={false}
                emptyIcon={<i className="far fa-star"></i>}
                halfIcon={<i className="fa fa-star-half-alt"></i>}
                fullIcon={<i className="fa fa-star"></i>}
                activeColor="#ffd700"
              />
              <p>
                <strong>Bình luận:</strong>{" "}
                {review.comment || "Không có bình luận."}
              </p>
              <p>
                <strong>Ngày tạo đánh giá:</strong>{" "}
                {review.createdAt
                  ? new Date(review.createdAt).toLocaleString()
                  : "N/A"}
              </p>

              {/* Dấu gạch ngang sau mỗi đánh giá (trừ đánh giá cuối cùng) */}
              {index !== reviews.length - 1 && <hr />}
            </div>
          ))
        ) : (
          <p>Không có đánh giá.</p>
        )}
      </Card>
    </div>
  );
};

export default Productdetails;
