import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import {
  Table,
  Space,
  Popconfirm,
  Button,
  Input,
  notification,
  Menu,
  Dropdown,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const { Search } = Input;

const Policy = () => {
  const [data, setData] = useState([]); // Lưu trữ toàn bộ dữ liệu chính sách
  const [filteredData, setFilteredData] = useState([]); // Lưu trữ dữ liệu đã lọc
  const navigate = useNavigate();
  const location = useLocation();
  const [searchText, setSearchText] = useState(
    location.state?.searchText || ""
  );
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    fetchPolicies();
  }, []);

  useEffect(() => {
    // Khi searchText thay đổi, lọc lại dữ liệu
    const filtered = data.filter((policy) =>
      policy.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchText, data]);

  // Lấy dữ liệu chính sách
  const fetchPolicies = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/policies/all"
      );
      setData(response.data);
      setFilteredData(response.data); // Lưu dữ liệu vào filteredData khi lần đầu fetch
    } catch (error) {
      console.error("Có lỗi xảy ra khi lấy dữ liệu chính sách!", error);
    }
  };

  // Xử lý hành động chỉnh sửa
  const handleEdit = (record) => {
    navigate(
      `/admin/edit-policy/${record.id}`,
      { state: { searchText } },
      { state: { id: record.id } }
    );
  };

  // Xử lý hành động xóa

  const handleDelete = async (id) => {
    try {
      // Gửi yêu cầu xóa thương hiệu đến API
      await axios.delete(`http://localhost:8081/api/policies/delete/${id}`);

      // Cập nhật lại danh sách thương hiệu trong state
      setData((prevDatas) => prevDatas.filter((policy) => policy.id !== id));
      setFilteredData((prevFilteredData) =>
        prevFilteredData.filter((policy) => policy.id !== id)
      );

      // Thông báo thành công
      notification.success({
        message: "Thành công",
        description: "Đã xóa chính sách thành công.",
      });
    } catch (error) {
      // Xử lý lỗi và thông báo cho người dùng
      notification.error({
        message: "Lỗi xóa chính sách",
        description: error.message || "Đã xảy ra lỗi!",
      });
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);

    // Lọc dữ liệu theo từ khóa tìm kiếm
    const filtered = data.filter((item) =>
      item.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);

    if (value && !searchHistory.includes(value)) {
      // Cập nhật lịch sử tìm kiếm nếu giá trị mới
      setSearchHistory((prevHistory) => [value, ...prevHistory].slice(0, 5)); // Lưu tối đa 5 lịch sử
    }
  };

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase())
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

  const columns = [
    { title: "STT", render: (_, __, index) => index + 1, align: "center" },
    { title: "Tiêu đề", dataIndex: "title", key: "title", align: "center" },

    {
      title: <div style={{ textAlign: "center" }}>Mô tả</div>,
      dataIndex: "description",
      key: "description",
      width: "40%",
      render: (text) => (
        <div
          style={{
            textAlign: "left",
            display: "-webkit-box",
            overflow: "hidden",
            textOverflow: "ellipsis",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
          }}
        >
          {text}
        </div>
      ),
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
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined
            onClick={() => handleEdit(record)}
            style={{ cursor: "pointer", color: "blue" }}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa chính sách này không?"
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
      <h3 className="mb-4 title">Danh Sách Chính Sách</h3>
      <div className="d-flex justify-content-between mb-3">
        <Dropdown overlay={menu} trigger={["click"]}>
          <div>
            <Search
              placeholder="Tìm kiếm theo tiêu đề"
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
          onClick={() =>
            navigate("/admin/add-policy", { state: { searchText } })
          }
        >
          Thêm Chính Sách
        </Button>
      </div>

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

export default Policy;
