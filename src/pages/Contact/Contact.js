import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Table, Input, Space, Popconfirm, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Contact = () => {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchContacts();
  }, []);

  // Lấy dữ liệu liên hệ
  const fetchContacts = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/contact/all"); // Điều chỉnh endpoint nếu cần
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Đã có lỗi khi lấy dữ liệu liên hệ!", error);
    }
  };

  const handleEdit = (record) => {
    navigate(`/admin/edit-contact/${record.id}`, { state: { id: record.id } });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/contact/delete/${id}`);
      fetchContacts(); // Cập nhật lại danh sách sau khi xóa
    } catch (error) {
      console.error("Đã có lỗi khi xóa liên hệ!", error);
    }
  };

  const columns = [
    { title: "STT", render: (_, __, index) => index + 1, align: "center" },
    {
      title: <div style={{ textAlign: "center" }}>Địa chỉ</div>,
      key: "address",
      render: (_, record) => {
        const address = record.address; // Truy cập địa chỉ trực tiếp từ bản ghi
        return address ? (
          <div style={{ textAlign: "left" }}>
            {address.street}, {address.communes}, {address.district},{" "}
            {address.city}, {address.country}
          </div>
        ) : (
          <div style={{ textAlign: "left" }}>Không có địa chỉ</div>
        );
      },
      align: "center",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      render: (phones) => phones.join(", "),
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (emails) => emails.join(", "),
      align: "center",
    },
    {
      title: "Giờ phục vụ",
      dataIndex: "timeServing",
      align: "center",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (date) => moment(date).format("DD/MM/YYYY"),
      align: "center",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      render: (date) => moment(date).format("DD/MM/YYYY"),
      align: "center",
    },
    {
      title: "Hành động",
      render: (text, record) => (
        <Space size="middle">
          <EditOutlined
            onClick={() => handleEdit(record)}
            style={{ cursor: "pointer", color: "blue" }}
          />
          <Popconfirm
            title="Bạn chắc chắn muốn xóa liên hệ này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
          </Popconfirm>
        </Space>
      ),
      align: "center",
    },
  ];

  return (
    <div className="container">
      <h3 className="mb-4 title">Liên Hệ</h3>
      <Table
        columns={columns}
        dataSource={filteredData.map((item, index) => ({
          ...item,
          key: index + 1,
        }))}
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default Contact;
