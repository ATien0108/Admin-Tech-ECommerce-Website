import React, { useEffect, useState } from "react";
import { Card, Avatar, List, Typography, Divider, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const { Title, Text } = Typography;

const CustomerDetail = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/users/${id}`);
        if (!response.ok) {
          throw new Error("Phản hồi của mạng không ổn");
        }
        const data = await response.json();
        setCustomer(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu khách hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [id, navigate]);

  if (loading) {
    return (
      <Spin
        tip="Đang tải..."
        style={{ display: "flex", justifyContent: "center", marginTop: "20vh" }}
      />
    );
  }

  if (!customer) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        Không có dữ liệu khách hàng.
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "20px", maxWidth: "800px" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
        Chi tiết khách hàng
      </Title>
      <Card
        style={{
          backgroundColor: "#f9f9f9",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="row">
          <div className="col-md-4 text-center">
            <Avatar
              size={100}
              src={
                customer.avatar || "https://i.postimg.cc/ZKKqtbwF/avatar1.jpg"
              }
              alt="Ảnh đại diện"
              style={{ marginBottom: "15px" }}
            />
          </div>
          <div className="col-md-8">
            <Title level={4} style={{ marginBottom: "10px", color: "#333" }}>
              Tên người dùng: {customer.username}
            </Title>
            <Text
              type="secondary"
              style={{ display: "block", marginBottom: "5px" }}
            >
              <strong>Email:</strong> {customer.email}
            </Text>
            <Text
              style={{ display: "block", marginBottom: "10px", color: "#555" }}
            >
              <strong>Số điện thoại:</strong> {customer.phone_number}
            </Text>
          </div>
        </div>
      </Card>

      <Divider style={{ margin: "30px 0" }} />

      <Card
        title="Địa chỉ"
        style={{
          backgroundColor: "#f9f9f9",
          borderRadius: "10px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        {customer.addresses && customer.addresses.length > 0 ? (
          <List
            dataSource={customer.addresses}
            renderItem={(address) => (
              <List.Item style={{ padding: "10px 0" }}>
                <List.Item.Meta
                  title={<Text strong>{address.label}</Text>}
                  description={
                    <Text style={{ color: "#555" }}>{address.address}</Text>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <div>
            {/* Địa chỉ sẽ được hiển thị riêng biệt, mỗi phần sẽ là một dòng */}
            <div style={{ marginBottom: "10px" }}>
              <Text style={{ color: "#555" }}>
                <strong>Đường:</strong> {customer.address?.street}
              </Text>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <Text style={{ color: "#555" }}>
                <strong>Phường / Xã:</strong> {customer.address?.communes}
              </Text>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <Text style={{ color: "#555" }}>
                <strong>Quận / Huyện:</strong> {customer.address?.district}
              </Text>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <Text style={{ color: "#555" }}>
                <strong>Tỉnh / Thành phố:</strong> {customer.address?.city}
              </Text>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <Text style={{ color: "#555" }}>
                <strong>Quốc gia:</strong> {customer.address?.country}
              </Text>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CustomerDetail;
