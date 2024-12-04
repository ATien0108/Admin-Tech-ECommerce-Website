import React, { useState, useEffect } from "react";
import { AiOutlinePicLeft, AiOutlinePicRight } from "react-icons/ai";
import { Layout, Menu, Button, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { Link, Outlet } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    if (storedUsername && storedEmail) {
      setUsername(storedUsername);
      setEmail(storedEmail);
    } else {
      navigate("/"); // Nếu không tìm thấy thông tin người dùng, chuyển hướng về trang đăng nhập
    }
  }, [navigate]);

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <h2 className="text-center fs-5 py-3 mb-0">SHOP</h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[""]}
          onClick={({ key }) => {
            if (key == "signout") {
            } else {
              navigate(key);
            }
          }}
          items={[
            {
              key: "",
              label: "Tổng quan",
            },
            {
              key: "customers-list",
              label: "Khách hàng",
            },
            {
              key: "employee-list",
              label: "Nhân viên",
            },
            {
              key: "catelog",
              label: "Danh sách",
              children: [
                {
                  key: "product-list",
                  label: "Sản phẩm",
                },
                {
                  key: "brand-list",
                  label: "Thương hiệu",
                },
                {
                  key: "category-list",
                  label: "Danh mục sản phẩm",
                },
                {
                  key: "tag-list",
                  label: "Nhãn",
                },
                {
                  key: "condition-list",
                  label: "Tình trạng",
                },
                {
                  key: "coupon-list",
                  label: "Mã giảm giá",
                },
              ],
            },
            {
              key: "orders-list",
              label: "Đơn đặt hàng",
            },
            {
              key: "blog",
              label: "Tin tức",
              children: [
                {
                  key: "blog-list",
                  label: "Bài viết",
                },
                {
                  key: "blog-category-list",
                  label: "Danh mục bài viết",
                },
              ],
            },
            {
              key: "about",
              label: "Giới thiệu",
            },
            {
              key: "contact",
              label: "Liên hệ",
            },
            {
              key: "policies",
              label: "Chính sách",
            },
            {
              key: "advertisement-list",
              label: "Quảng cáo",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          className="d-flex justify-content-between ps-1 pe-5"
          style={{ padding: 0, background: colorBgContainer }}
        >
          <Button
            type="text"
            icon={collapsed ? <AiOutlinePicRight /> : <AiOutlinePicLeft />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <div className="d-flex gap-3 align-items-center">
            <div className="d-flex gap-3 align-items-center dropdown">
              <div
                role="button"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <h5 className="mb-0">{username}</h5>{" "}
                {/* Hiển thị tên người dùng */}
              </div>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <li>
                  <Link
                    className="dropdown-item py-1 mb-1"
                    to="/forgot-password"
                  >
                    Change Password
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item py-1 mb-1"
                    to="/"
                    onClick={() => {
                      localStorage.clear(); // Xóa thông tin khi đăng xuất
                      navigate("/");
                    }}
                  >
                    Signout
                  </Link>
                </li>
              </div>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
