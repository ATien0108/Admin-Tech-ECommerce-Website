import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  notification,
  Popconfirm,
  Modal,
  Space,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "antd/dist/reset.css";
import "bootstrap/dist/css/bootstrap.min.css";

const { Search } = Input;

// Cập nhật columns để bao gồm số thứ tự
const columns = (handleEdit, handleDelete, handleView) => [
  {
    title: "STT",
    render: (text, record, index) => index + 1, // Hiển thị số thứ tự (index + 1)
    align: "center",
  },
  {
    title: "Tên nhân viên",
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
    dataIndex: "phoneNumber",
    align: "center",
  },
  {
    title: "Vai trò",
    dataIndex: "role",
    align: "center",
  },
  {
    title: "Hành động",
    render: (_, record) => (
      <Space size="middle">
        <EditOutlined
          onClick={() => handleEdit(record)}
          style={{ cursor: "pointer", color: "blue" }}
        />
        <DeleteOutlined
          onClick={() => handleDelete(record.id)}
          style={{ cursor: "pointer", color: "red" }}
        />
        <EyeOutlined
          onClick={() => handleView(record)}
          style={{ cursor: "pointer", color: "green" }}
        />
      </Space>
    ),
    width: "15%",
    align: "center",
  },
];

const EmployeeList = () => {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  // Fetch danh sách nhân viên khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/employees/all"
        );
        setData(response.data);
        setFilteredData(response.data); // Khởi tạo filteredData từ dữ liệu gốc
      } catch (error) {
        notification.error({
          message: "Error",
          description: "Không tải được dữ liệu nhân viên.",
          placement: "topRight",
        });
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // Hàm chỉnh sửa nhân viên
  const handleEdit = (record) => {
    navigate(`/admin/edit-employee/${record.id}`);
  };

  // Hàm xem chi tiết nhân viên
  const handleView = (record) => {
    navigate(`/admin/employee-detail/${record.id}`);
  };

  // Hàm tìm kiếm nhân viên
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    const filtered = data.filter((item) =>
      item.username.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Hàm xóa nhân viên
  // Hàm xóa nhân viên
  const handleDelete = async (id) => {
    try {
      // Gửi yêu cầu kiểm tra trước khi xóa
      const response = await axios.delete(
        `http://localhost:8081/api/employees/delete/${id}`
      );

      // Nếu không có blog liên quan, xóa thành công
      if (response.status === 204) {
        notification.success({
          message: "Thành công",
          description: "Nhân viên đã được xóa thành công.",
        });

        // Cập nhật danh sách Employee
        setData((prevData) =>
          prevData.filter((employee) => employee.id !== id)
        );
        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((employee) => employee.id !== id)
        );
      } else {
        // Nếu có blog liên quan, yêu cầu xác nhận từ người dùng
        Modal.confirm({
          title: "Xác nhận xóa",
          content: response.data, // Thông báo từ server
          okText: "Có",
          cancelText: "Không",
          onOk: async () => {
            try {
              // Gửi yêu cầu xóa ép buộc với force=true
              await axios.delete(
                `http://localhost:8081/api/employees/delete/${id}?force=true`
              );

              // Cập nhật danh sách Employee
              setData((prevData) =>
                prevData.filter((employee) => employee.id !== id)
              );
              setFilteredData((prevFilteredData) =>
                prevFilteredData.filter((employee) => employee.id !== id)
              );

              // Thông báo thành công
              notification.success({
                message: "Thành công",
                description: "Nhân viên đã được xóa thành công.",
              });
            } catch (deleteError) {
              notification.error({
                message: "Lỗi xóa nhân viên",
                description:
                  deleteError.response?.data ||
                  deleteError.message ||
                  "Đã xảy ra lỗi!",
              });
            }
          },
        });
      }
    } catch (error) {
      // Nếu API trả về thông báo yêu cầu xác nhận
      if (error.response?.status === 400) {
        Modal.confirm({
          title: "Xác nhận xóa",
          content: error.response.data, // Thông báo từ server
          okText: "Có",
          cancelText: "Không",
          onOk: async () => {
            try {
              // Gửi yêu cầu xóa ép buộc
              await axios.delete(
                `http://localhost:8081/api/employees/delete/${id}?force=true`
              );

              // Cập nhật danh sách Employee
              setData((prevData) =>
                prevData.filter((employee) => employee.id !== id)
              );
              setFilteredData((prevFilteredData) =>
                prevFilteredData.filter((employee) => employee.id !== id)
              );

              // Thông báo thành công
              notification.success({
                message: "Thành công",
                description: "Nhân viên đã được xóa thành công.",
              });
            } catch (deleteError) {
              notification.error({
                message: "Lỗi xóa nhân viên",
                description:
                  deleteError.response?.data ||
                  deleteError.message ||
                  "Đã xảy ra lỗi!",
              });
            }
          },
        });
      } else {
        // Xử lý các lỗi khác
        notification.error({
          message: "Lỗi xóa nhân viên",
          description:
            error.response?.data || error.message || "Đã xảy ra lỗi!",
        });
      }
    }
  };

  // Hàm thêm nhân viên mới
  const handleAddNewEmployee = () => {
    navigate("/admin/add-employee");
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 title">Danh Sách Nhân Viên</h3>
      <div className="d-flex justify-content-between mb-3">
        <Search
          placeholder="Tìm kiếm theo tên nhân viên"
          onChange={handleSearch}
          style={{ width: 300 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddNewEmployee}
        >
          Thêm nhân viên mới
        </Button>
      </div>
      <div className="table-responsive">
        <Table
          columns={columns(handleEdit, handleDelete, handleView)}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default EmployeeList;
