import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Spin, Card, Row, Col, Space } from "antd";
import { EditOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./About.css";

const About = () => {
  const [aboutData, setAboutData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/about/all");
        if (!response.ok) {
          throw new Error("Lỗi kết nối mạng");
        }
        const data = await response.json();
        setAboutData(data);
      } catch (err) {
        setError("Lấy dữ liệu không thành công. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) return <Spin tip="Đang tải..." />;
  if (error) return <div>{error}</div>;
  if (!aboutData.length) return <div>Không có thông tin về chúng tôi.</div>;

  const columns = [
    {
      title: <div style={{ textAlign: "center" }}>Tiêu đề</div>,
      dataIndex: "title",
      width: "20%", // Điều chỉnh để có không gian rộng hơn
      render: (text) => (
        <div
          style={{
            textAlign: "left",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      ),
    },
    {
      title: <div style={{ textAlign: "center" }}>Nội dung</div>,
      dataIndex: "content",
      key: "content",
      width: "35%", // Giảm một chút để cân đối các cột khác
      render: (text) => (
        <div
          style={{
            textAlign: "left",
            display: "-webkit-box",
            overflow: "hidden",
            textOverflow: "ellipsis",
            WebkitLineClamp: 3, // Tăng số dòng hiển thị
            WebkitBoxOrient: "vertical",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: <div style={{ textAlign: "center" }}>Hình ảnh</div>,
      dataIndex: "image",
      key: "image",
      align: "center", // Giữ hình ảnh ở giữa cột
      width: "15%",
      render: (images) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          {Array.isArray(images) ? (
            images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`About ${index + 1}`}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "4px",
                  marginRight: "5px",
                }}
              />
            ))
          ) : (
            <img
              src={images}
              alt="About"
              style={{ width: "40px", height: "40px", borderRadius: "4px" }}
            />
          )}
        </div>
      ),
    },
    {
      title: <div style={{ textAlign: "center" }}>Ngày tạo</div>,
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      width: "15%",
      render: (date) => <div>{new Date(date).toLocaleString()}</div>,
    },
    {
      title: <div style={{ textAlign: "center" }}>Ngày cập nhật</div>,
      dataIndex: "updatedAt",
      key: "updatedAt",
      align: "center",
      width: "15%",
      render: (date) => <div>{new Date(date).toLocaleString()}</div>,
    },
    {
      title: <div style={{ textAlign: "center" }}>Hành động</div>,
      key: "actions",
      width: "10%", // Hẹp hơn để phù hợp nội dung nút
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined
            onClick={() => handleEdit(record.id)}
            style={{ cursor: "pointer", color: "blue" }}
          />
        </Space>
      ),
    },
  ];

  const handleEdit = (id) => {
    navigate(`/admin/edit-about/${id}`);
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 title">Về Chúng Tôi</h3>
      <Table
        columns={columns}
        dataSource={aboutData.map((item, index) => ({
          ...item,
          key: index + 1,
        }))}
        pagination={{ pageSize: 10 }}
        bordered
      />

      {/* Phần các Tác giả */}
      <h4 className="mt-4">Các Tác Giả</h4>
      <Row gutter={16}>
        {(aboutData[0]?.creator || []).map((creator, index) => (
          <Col span={8} key={index}>
            <Card hoverable style={{ marginBottom: 16 }}>
              <img
                src={creator.avatar}
                alt={creator.name}
                style={{ width: "100%", height: "150px", objectFit: "cover" }}
              />
              <h5>{creator.name}</h5>
              <p>
                <strong>Tuổi:</strong> {creator.age || "N/A"}
              </p>
              <p>
                <strong>Giới tính:</strong> {creator.gender || "N/A"}
              </p>
              <p>
                <strong>Nghề nghiệp:</strong> {creator.occupation || "N/A"}
              </p>
              <p>
                <strong>Nơi làm việc:</strong> {creator.workplace || "N/A"}
              </p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default About;
