import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Space,
  Popconfirm,
  Button,
  notification,
  Modal,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Conditionlist = () => {
  const [searchText, setSearchText] = useState("");
  const [conditions, setConditions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fetch brands data when component mounts
  useEffect(() => {
    fetchConditions();
  }, []);

  const fetchConditions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/product-conditions/all"
      );
      setConditions(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu tình trạng:", error);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = conditions.filter((item) =>
      item.conditionName.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  // Handle edit
  const handleEdit = (record) => {
    navigate(`/admin/edit-condition/${record.conditionName}`);
  };

  const handleDelete = async (id) => {
    try {
      // Gửi yêu cầu kiểm tra trước khi xóa
      const response = await axios.delete(
        `http://localhost:8081/api/product-conditions/delete/${id}`
      );

      // Nếu không có sản phẩm liên quan, xóa thành công
      if (response.status === 204) {
        notification.success({
          message: "Thành công",
          description: "Đã xóa thương hiệu thành công.",
        });

        // Cập nhật danh sách Brand
        setConditions((prevCondition) =>
          prevCondition.filter((condition) => condition.id !== id)
        );
        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((condition) => condition.id !== id)
        );
      } else {
        // Nếu có sản phẩm liên quan, yêu cầu xác nhận từ người dùng
        Modal.confirm({
          title: "Xác nhận xóa",
          content: response.data, // Thông báo từ server
          okText: "Có",
          cancelText: "Không",
          onOk: async () => {
            try {
              // Gửi yêu cầu xóa ép buộc với force=true
              await axios.delete(
                `http://localhost:8081/api/product-conditions/delete/${id}?force=true`
              );

              // Cập nhật danh sách Brand
              setConditions((prevCondition) =>
                prevCondition.filter((condition) => condition.id !== id)
              );
              setFilteredData((prevFilteredData) =>
                prevFilteredData.filter((condition) => condition.id !== id)
              );

              // Thông báo thành công
              notification.success({
                message: "Thành công",
                description: "Đã xóa thương hiệu thành công.",
              });
            } catch (deleteError) {
              notification.error({
                message: "Lỗi xóa thương hiệu",
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
                `http://localhost:8081/api/product-conditions/delete/${id}?force=true`
              );

              // Cập nhật danh sách Brand
              setConditions((prevCondition) =>
                prevCondition.filter((condition) => condition.id !== id)
              );
              setFilteredData((prevFilteredData) =>
                prevFilteredData.filter((condition) => condition.id !== id)
              );

              // Thông báo thành công
              notification.success({
                message: "Thành công",
                description: "Đã xóa thương hiệu thành công.",
              });
            } catch (deleteError) {
              notification.error({
                message: "Lỗi xóa thương hiệu",
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
          message: "Lỗi xóa thương hiệu",
          description:
            error.response?.data || error.message || "Đã xảy ra lỗi!",
        });
      }
    }
  };

  // Navigate to add brand page
  const handleAddCondition = () => {
    navigate("/admin/add-condition");
  };

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => index + 1, // Hiển thị số thứ tự bắt đầu từ 1
      width: "5%",
      align: "center",
    },
    {
      title: "Tên tình trạng",
      dataIndex: "conditionName",
      width: "10%",
      align: "center",
    },

    {
      title: <div style={{ textAlign: "center" }}>Mô tả</div>,
      dataIndex: "description",
      width: "25%", // Giảm chiều rộng của cột
      render: (text) => (
        <div
          style={{
            textAlign: "left",
            display: "-webkit-box", // Đảm bảo phần tử là box
            overflow: "hidden", // Ẩn phần tràn
            textOverflow: "ellipsis", // Hiển thị dấu ba chấm khi bị cắt
            WebkitLineClamp: 2, // Giới hạn số dòng (2 dòng trong trường hợp này)
            WebkitBoxOrient: "vertical", // Đảm bảo văn bản chỉ hiển thị theo chiều dọc
          }}
        >
          {text}
        </div>
      ),
    },

    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (text) => formatDate(text),
      width: "12%",
      align: "center",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      render: (text) => formatDate(text),
      width: "12%",
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
        </Space>
      ),
      width: "11%",
      align: "center",
    },
  ];

  return (
    <div className="container">
      <h3 className="mb-4 title">Danh Sách Tình Trạng</h3>
      <div className="row mb-3">
        <div className="col-md-6">
          <Input
            placeholder="Tìm kiếm theo tên tình trạng"
            value={searchText}
            onChange={handleSearch}
            style={{ width: 300 }}
          />
        </div>
        <div className="col-md-6 text-end">
          <Button type="primary" onClick={handleAddCondition}>
            Thêm tình trạng
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default Conditionlist;
