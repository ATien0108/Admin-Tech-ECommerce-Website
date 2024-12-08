import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  notification,
  Popconfirm,
  Modal,
  Space,
  Dropdown,
  Menu,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
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
    title: "Hành động",
    render: (_, record) => (
      <Space size="middle">
        <EyeOutlined
          onClick={() => handleView(record)}
          style={{ cursor: "pointer", color: "green" }}
        />
        <EditOutlined
          onClick={() => handleEdit(record)}
          style={{ cursor: "pointer", color: "blue" }}
        />
        <DeleteOutlined
          onClick={() => handleDelete(record.id)}
          style={{ cursor: "pointer", color: "red" }}
        />
      </Space>
    ),
    width: "15%",
    align: "center",
  },
];

const EmployeeList = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
  const pageSize = 10; // Kích thước mỗi trang
  const navigate = useNavigate();
  const location = useLocation();
  const [searchText, setSearchText] = useState(
    location.state?.searchText || ""
  );
  const [searchHistory, setSearchHistory] = useState([]);

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
    navigate(`/admin/edit-employee/${record.id}`, { state: { searchText } });
  };

  // Hàm xem chi tiết nhân viên
  const handleView = (record) => {
    navigate(`/admin/employee-detail/${record.id}`, { state: { searchText } });
  };

  // Hàm tìm kiếm nhân viên
  const handleSearch = (value) => {
    setSearchText(value);

    // Lọc dữ liệu theo từ khóa tìm kiếm
    const filtered = data.filter((item) =>
      item.username.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);

    if (value && !searchHistory.includes(value)) {
      // Cập nhật lịch sử tìm kiếm nếu giá trị mới
      setSearchHistory((prevHistory) => [value, ...prevHistory].slice(0, 5)); // Lưu tối đa 5 lịch sử
    }
  };

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.username.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchText, data]);

  const menu = (
    <Menu>
      {searchHistory.map((item, index) => (
        <Menu.Item key={index} onClick={() => setSearchText(item)}>
          {item}
        </Menu.Item>
      ))}
    </Menu>
  );

  // Hàm phân trang thay đổi
  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };

  // Hàm xóa nhân viên
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8081/api/employees/delete/${id}`
      );

      if (response.status === 204) {
        notification.success({
          message: "Thành công",
          description: "Nhân viên đã được xóa thành công.",
        });

        setData((prevData) =>
          prevData.filter((employee) => employee.id !== id)
        );
        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((employee) => employee.id !== id)
        );
      }
    } catch (error) {
      notification.error({
        message: "Lỗi xóa nhân viên",
        description: error.response?.data || error.message,
      });
    }
  };

  const columns = (handleEdit, handleDelete, handleView) => [
    {
      title: "STT",
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
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
      title: "Hành động",
      render: (_, record) => (
        <Space size="middle">
          <EyeOutlined
            onClick={() => handleView(record)}
            style={{ cursor: "pointer", color: "green" }}
          />
          <EditOutlined
            onClick={() => handleEdit(record)}
            style={{ cursor: "pointer", color: "blue" }}
          />
          <DeleteOutlined
            onClick={() => handleDelete(record.id)}
            style={{ cursor: "pointer", color: "red" }}
          />
        </Space>
      ),
      width: "15%",
      align: "center",
    },
  ];

  const handleAddNewEmployee = () => {
    navigate("/admin/add-employee", { state: { searchText } });
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 title">Danh Sách Nhân Viên</h3>
      <div className="d-flex justify-content-between mb-3">
        <Dropdown overlay={menu} trigger={["click"]}>
          <div>
            <Search
              placeholder="Tìm kiếm theo tên nhân viên"
              value={searchText}
              onSearch={handleSearch}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
          </div>
        </Dropdown>
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
          pagination={{
            pageSize,
            current: currentPage,
            onChange: handlePaginationChange,
            total: filteredData.length,
          }}
        />
      </div>
    </div>
  );
};

export default EmployeeList;
