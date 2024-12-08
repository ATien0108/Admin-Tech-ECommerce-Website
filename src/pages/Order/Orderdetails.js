import React, { useEffect, useState } from "react";
import {
  Card,
  List,
  Typography,
  Divider,
  Tag,
  Spin,
  message,
  Select,
  Modal,
  Button,
} from "antd";
import "bootstrap/dist/css/bootstrap.min.css"; // Đảm bảo Bootstrap được import
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const OrderDetails = () => {
  const { id } = useParams(); // Nhận ID từ URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchText = location.state?.searchText || "";

  const fetchProductName = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/products/${id}`
      );
      return response.data.productName;
    } catch (error) {
      console.error("Error fetching product name:", error);
      return "Không xác định";
    }
  };

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/orders/${id}`
      );
      const orderData = response.data;

      // Lấy tên sản phẩm cho từng item
      const updatedItems = await Promise.all(
        orderData.items.map(async (item) => {
          const productName = await fetchProductName(item.product);
          return { ...item, productName }; // Gắn tên sản phẩm vào item
        })
      );

      setOrder({ ...orderData, items: updatedItems }); // Cập nhật dữ liệu đơn hàng
    } catch (error) {
      console.error("Lỗi khi lấy thông tin chi tiết đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/orders/${id}`
        );
        const orderData = response.data;

        // Lấy tên sản phẩm từ API cho từng sản phẩm trong đơn hàng
        const itemsWithProductNames = await Promise.all(
          orderData.items.map(async (item) => {
            const productResponse = await axios.get(
              `http://localhost:8081/api/products/${item.product}`
            );
            return {
              ...item,
              productName: productResponse.data.productName || "Không xác định",
            };
          })
        );

        setOrder({ ...orderData, items: itemsWithProductNames });
      } catch (error) {
        console.error("Lỗi khi lấy thông tin chi tiết đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const handleStatusChange = (newStatus) => {
    Modal.confirm({
      title: "Xác nhận cập nhật trạng thái",
      content: `Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng thành "${newStatus}"?`,
      okText: "Có",
      cancelText: "Không",
      onOk: async () => {
        setUpdating(true);
        try {
          const response = await axios.put(
            `http://localhost:8081/api/orders/update-status/${id}?status=${newStatus}`
          );
          setOrder({ ...order, status: newStatus }); // Cập nhật trạng thái
          message.success("Cập nhật trạng thái thành công!");
        } catch (error) {
          console.error("Lỗi khi cập nhật trạng thái:", error);
          message.error("Cập nhật trạng thái thất bại.");
        } finally {
          setUpdating(false);
        }
      },
      onCancel: () => {
        // Nếu người dùng bấm "Không", không thực hiện gì cả.
      },
    });
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!order) {
    return <div>Không tìm thấy đơn hàng</div>;
  }

  const formatCurrency = (amount) => {
    return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}₫`;
  };

  return (
    <div className="container mt-4">
      <Title level={3}>Mã đơn hàng: {id}</Title>
      <Text>
        Ngày đặt hàng: {new Date(order.orderCreatedAt).toLocaleString()}
      </Text>
      <div className="mt-2">
        <Tag color="blue">{order.status}</Tag>
      </div>
      <Divider />

      <div className="mb-3">
        <Text strong>Cập nhật trạng thái đơn hàng:</Text>
        <Select
          value={order.status}
          style={{ width: 200, marginLeft: 10 }}
          onChange={handleStatusChange}
          loading={updating}
        >
          <Option value="Đang xử lý">Đang xử lý</Option>
          <Option value="Đang vận chuyển">Đang vận chuyển</Option>
          <Option value="Đã giao hàng">Đã giao hàng</Option>
        </Select>
      </div>
      <Divider />

      {/* Thông tin người mua */}
      <Card title="Thông tin người mua" className="mb-3">
        <Text strong>Tên: </Text> {order.fullName}
        <br />
        <div style={{ marginTop: 8 }}>
          <Text strong>Số điện thoại: </Text> {order.phoneNumber}
        </div>
        <div style={{ marginTop: 8 }}>
          <Text strong>Địa chỉ giao hàng: </Text>
        </div>
        <div style={{ marginTop: 8 }}>
          <Text strong>Đường: </Text> {order.shippingAddress.street}
        </div>
        <div style={{ marginTop: 8 }}>
          <Text strong>Phường / Xã: </Text> {order.shippingAddress.communes}
        </div>
        <div style={{ marginTop: 8 }}>
          <Text strong>Quận / Huyện: </Text> {order.shippingAddress.district}
        </div>
        <div style={{ marginTop: 8 }}>
          <Text strong>Tỉnh / Thành phố: </Text> {order.shippingAddress.city}
        </div>
        <div style={{ marginTop: 8 }}>
          <Text strong>Quốc gia: </Text> {order.shippingAddress.country}
        </div>
      </Card>

      <div className="row">
        <div className="col-lg-8 col-md-12">
          <Card title="Thông tin đơn hàng">
            <List
              dataSource={order.items} // Chỉ hiển thị sản phẩm thuộc đơn hàng
              renderItem={(item) => {
                const itemTotal =
                  item.priceTotal && item.quantity
                    ? item.priceTotal * item.quantity
                    : 0;

                return (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <>
                          <div>
                            <strong>Tên sản phẩm:</strong> {item.productName}
                          </div>
                        </>
                      }
                      description={
                        <div>
                          <strong>Màu sắc:</strong> {item.color}
                          <br />
                          <strong>Số lượng:</strong> {item.quantity}
                          <br />
                          <strong>Tổng giá:</strong>{" "}
                          {formatCurrency(item.priceTotal)}
                          <br />
                        </div>
                      }
                    />
                  </List.Item>
                );
              }}
            />

            <div className="text-end mt-2">
              <Text>Phí vận chuyển: {formatCurrency(order.shippingCost)} </Text>
              <br />
              <Text>Giá giảm: {formatCurrency(order.couponDiscount)} </Text>
              <br />
              <Text strong>
                Tổng thanh toán: {formatCurrency(order.totalAmount)}
              </Text>
            </div>
          </Card>
        </div>

        <div className="col-lg-4 col-md-12">
          {order.notes && (
            <Card title="Ghi chú">
              <Text>{order.notes}</Text>
            </Card>
          )}

          {order.coupon && (
            <Card title="Mã giảm giá" className="mt-3">
              <Text>{order.coupon}</Text>
              <br />
              <Text strong>Giá giảm: </Text>{" "}
              {formatCurrency(order.couponDiscount)}
            </Card>
          )}

          <Card title="Phương thức thanh toán" className="mt-3">
            <Text>{order.paymentMethod}</Text>
          </Card>
        </div>
      </div>

      <Button
        type="primary"
        style={{ marginBottom: "20px", marginTop: "20px", float: "left" }}
        onClick={() =>
          navigate("/admin/orders-list", { state: { searchText } })
        }
      >
        Quay lại Danh Sách Đơn Đặt Hàng
      </Button>
    </div>
  );
};

export default OrderDetails;
