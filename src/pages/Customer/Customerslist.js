import React, { useEffect, useState } from "react";
import { Table, Input, notification, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "antd/dist/reset.css";
import "bootstrap/dist/css/bootstrap.min.css";

const { Search } = Input;

const Customerslist = () => {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // Function to fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/users/all");
      const usersWithKeys = response.data.map((user, index) => ({
        ...user,
        key: index + 1,
      }));
      setData(usersWithKeys);
    } catch (error) {
      console.error("Error fetching users:", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch customer list.",
        placement: "topRight",
      });
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users when the component mounts
  }, []);

  const handleEdit = (record) => {
    navigate(`/admin/edit-customer/${record.id}`);
  };

  const handleView = (record) => {
    navigate(`/admin/customer-detail/${record.id}`);
  };

  const handleDelete = async (record) => {
    try {
      const response = await axios.delete(
        `http://localhost:8081/api/users/delete/${record.id}`
      );

      if (response.status === 204) {
        // Xóa thành công, cập nhật lại state
        setData((prevData) => prevData.filter((item) => item.id !== record.id));
        notification.success({
          message: "Customer Deleted",
          description: `Khách hàng đã được xóa thành công.`,
          placement: "topRight",
        });
      } else {
        // Nếu không phải 204, thông báo lỗi
        throw new Error("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      notification.error({
        message: "Error",
        description: "Không thể xóa khách hàng.",
        placement: "topRight",
      });
    }
  };

  const filteredData = data.filter((item) =>
    item.username.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      align: "center",
    },
    {
      title: "Hình đại diện",
      dataIndex: "avatar",
      render: (text) => (
        <img
          src={text}
          alt="Avatar"
          style={{ width: 40, height: 40, borderRadius: "50%" }}
        />
      ),
      align: "center",
    },
    {
      title: "Tên người dùng",
      dataIndex: "username",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      align: "center",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      align: "center",
    },
    {
      title: "Địa chỉ",
      render: (text, record) => (
        <span style={{ textAlign: "left" }}>
          {record.address.street}, {record.address.communes},{" "}
          {record.address.district}, {record.address.city},{" "}
          {record.address.country}
        </span>
      ),
      align: "center",
      width: "30%",
    },
    {
      title: "Hành động",
      render: (text, record) => (
        <div>
          <EyeOutlined
            style={{ color: "green", marginRight: 16 }}
            onClick={() => handleView(record)}
          />
          <EditOutlined
            style={{ color: "blue", marginRight: 16 }}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn xóa mục này?"
            onConfirm={() => handleDelete(record)}
            okText="Có"
            cancelText="Không"
          >
            <DeleteOutlined style={{ color: "red" }} />
          </Popconfirm>
        </div>
      ),
      align: "center",
    },
  ];

  return (
    <div className="container mt-4">
      <h3 className="mb-4 title">Danh Sách Khách hàng</h3>
      <div className="d-flex justify-content-between mb-3">
        <Search
          placeholder="Tìm kiếm theo tên người dùng"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>
      <div className="table-responsive">
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default Customerslist;
