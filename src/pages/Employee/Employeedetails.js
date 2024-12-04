import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Spin, notification, Typography, Divider, Row, Col } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const { Title, Text } = Typography;

const EmployeeDetails = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Hàm lấy thông tin nhân viên từ API
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/employees/${id}`
        );
        setEmployeeData(response.data);
        console.log("Dữ liệu nhân viên:", response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu nhân viên:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployeeDetails();
    }
  }, [id, navigate]);

  if (loading) {
    return <Spin size="large" className="d-flex justify-content-center mt-5" />;
  }

  if (!employeeData) {
    return (
      <div className="container mt-5">
        Không có thông tin chi tiết nhân viên.
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <Title level={3} className="mb-4 text-center">
        Chi tiết nhân viên
      </Title>
      <Card
        title={
          <Title level={4} style={{ margin: 0 }}>
            {employeeData.username}
          </Title>
        }
        className="shadow p-4 mb-5 bg-body rounded"
        style={{
          border: "1px solid #e0e0e0",
          maxWidth: "700px",
          margin: "auto",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Text strong>Tên nhân viên: </Text>
            <Text>{employeeData.username}</Text>
          </Col>
          <Col xs={24} md={12}>
            <Text strong>Email: </Text>
            <Text>{employeeData.email}</Text>
          </Col>
        </Row>
        <Divider />
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Text strong>Số điện thoại: </Text>
            <Text>{employeeData.phoneNumber || "N/A"}</Text>
          </Col>
          <Col xs={24} md={12}>
            <Text strong>Vai trò: </Text>
            <Text>{employeeData.role}</Text>
          </Col>
        </Row>
        <Divider />
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Text strong>Ngày tạo: </Text>
            <Text>{new Date(employeeData.createdAt).toLocaleString()}</Text>
          </Col>
          <Col xs={24} md={12}>
            <Text strong>Ngày cập nhật: </Text>
            <Text>{new Date(employeeData.updatedAt).toLocaleString()}</Text>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default EmployeeDetails;
