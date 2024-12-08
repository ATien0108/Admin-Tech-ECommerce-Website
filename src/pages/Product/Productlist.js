import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Slider,
  Layout,
  Checkbox,
  Space,
  Button,
  Popconfirm,
  notification,
  Spin,
  Select,
  Menu,
  Dropdown,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "antd/dist/reset.css";
import "bootstrap/dist/css/bootstrap.min.css";
import debounce from "lodash.debounce";

const { Content, Sider } = Layout;
const { Option } = Select;
const { Search } = Input;

// Columns configuration for the Ant Design Table

const Productlist = () => {
  const [products, setProducts] = useState([]); // State to hold products

  const [category, setCategory] = useState([]); // State to hold categories
  const [categories, setCategories] = useState([]); // State to hold categories

  const [brand, setBrand] = useState([]); // State to hold brands
  const [brands, setBrands] = useState([]); // State to hold brands

  const [tags, setTags] = useState([]); // State to hold tags
  const [tagsfill, setTagsFill] = useState([]); // State to hold tags

  const [condition, setCondition] = useState([]); // State to hold conditions
  const [conditions, setConditions] = useState([]); // State to hold conditions
  const [searchText, setSearchText] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    brands: [],
    tags: [],
    conditions: [],
  });
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [loading, setLoading] = useState(false); // State for loading
  const navigate = useNavigate();

  // Fetch products and filters from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        const [
          productsResponse,
          categoriesResponse,
          brandsResponse,
          tagsResponse,
          conditionsResponse,
        ] = await Promise.all([
          axios.get("http://localhost:8081/api/products"),
          axios.get("http://localhost:8081/api/categories/all"),
          axios.get("http://localhost:8081/api/brands/all"),
          axios.get("http://localhost:8081/api/tags/all"),
          axios.get("http://localhost:8081/api/product-conditions/all"),
        ]);

        const productsWithKeys = productsResponse.data.map(
          (product, index) => ({ ...product, key: index + 1 })
        );
        setProducts(productsWithKeys);
        setCategories(categoriesResponse.data);
        setBrands(brandsResponse.data);
        setTagsFill(tagsResponse.data);
        setConditions(conditionsResponse.data);
      } catch (error) {
        notification.error({
          message: "Lỗi tìm nạp dữ liệu",
          description: error.message,
        });
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/categories/all"
        );
        const cateMap = response.data.reduce((acc, categories) => {
          acc[categories.id] = categories.cateName;
          return acc;
        }, {});
        setCategory(cateMap);
      } catch (error) {
        console.error("Lỗi tìm nạp danh mục:", error);
      }
    };

    const fetchBrand = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/brands/all"
        );
        const brandMap = response.data.reduce((acc, brands) => {
          acc[brands.id] = brands.brandName;
          return acc;
        }, {});
        setBrand(brandMap);
      } catch (error) {
        console.error("Lỗi tìm nạp thương hiệu:", error);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/tags/all");
        const tagsMap = response.data.reduce((acc, tag) => {
          acc[tag.id] = tag.name; // Make sure tag.id and tag.name are correct
          return acc;
        }, {});
        setTags(tagsMap); // Set tags as an object
      } catch (error) {
        console.error("Lỗi tìm nạp thẻ:", error);
        setTags({}); // Set to empty object on error
      }
    };

    const fetchCondition = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/product-conditions/all"
        );
        const conditionMap = response.data.reduce((acc, conditions) => {
          acc[conditions.id] = conditions.conditionName;
          return acc;
        }, {});
        setCondition(conditionMap);
      } catch (error) {
        console.error("Lỗi tìm nạp tình trạng sản phẩm:", error);
      }
    };

    fetchCategory();
    fetchBrand();
    fetchTags();
    fetchCondition();
  }, []);

  console.log(tags);

  const handleSearch = debounce((value) => {
    setSearchText(value);

    // Update search history
    if (value && !searchHistory.includes(value)) {
      setSearchHistory((prevHistory) => [value, ...prevHistory].slice(0, 5)); // Keep only the latest 5 searches
    }
  }, 300);

  const handleFilterChange = (category, value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [category]: value,
    }));
  };

  const formatCurrency = (amount) => {
    return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}₫`;
  };

  const handleSliderChange = (value) => {
    setPriceRange(value);
  };

  const handleEdit = (record) => {
    navigate(`/admin/edit-product/${record.id}`, { state: { searchText } }); // Use record.id to navigate
  };

  const handleDelete = async (record) => {
    const { id } = record; // Get the product ID to delete
    try {
      // Make the DELETE request to the API
      await axios.delete(`http://localhost:8081/api/products/delete/${id}`);

      // Remove the product from the local state
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );

      // Notify the user of success
      notification.success({
        message: "Success",
        description: "Đã xóa sản phẩm thành công.",
      });
    } catch (error) {
      // Handle error and notify the user
      notification.error({
        message: "Lỗi xóa sản phẩm",
        description: error.message || "Đã xảy ra lỗi!",
      });
    }
  };

  const handleAddProduct = () => {
    navigate("/admin/add-product", { state: { searchText } });
  };

  const handleView = (record) => {
    navigate(`/admin/product-detail/${record.productName}`, {
      state: { searchText },
    }); // Use record.id to navigate
  };

  const getColumns = (onEdit, onDelete, onView) => [
    {
      title: "STT",
      dataIndex: "key",
      align: "center",
    },
    {
      title: <div style={{ textAlign: "center" }}>Tên sản phẩm</div>,
      dataIndex: "productName",
      width: 20,
      render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      render: (categoryId) => category[categoryId] || "Unknown",
      align: "center",
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      render: (brandId) => brand[brandId] || "Unknown",
      align: "center",
    },
    {
      title: "Nhãn",
      dataIndex: "tags",
      align: "center",
      width: 200,
      render: (tagIds) => {
        const tagsToShow = Array.isArray(tagIds) ? tagIds.slice(0, 3) : [];
        const showMore = tagIds.length > 3;
        return (
          <Space size="small">
            {tagsToShow.map((tagId) => (
              <span
                key={tagId}
                style={{
                  backgroundColor: "#f0f0f0",
                  borderRadius: "4px",
                  padding: "2px 6px",
                  marginRight: "4px",
                  display: "inline-block",
                }}
              >
                {tags[tagId] || "Unknown"}{" "}
              </span>
            ))}
            {showMore && (
              <span
                style={{
                  backgroundColor: "#f0f0f0",
                  borderRadius: "4px",
                  padding: "2px 6px",
                  marginRight: "4px",
                  display: "inline-block",
                  fontStyle: "italic",
                }}
              >
                ... {/* Dấu ba chấm */}
              </span>
            )}
          </Space>
        );
      },
    },
    {
      title: "Tình trạng",
      dataIndex: "condition",
      render: (conditionId) => condition[conditionId] || "Unknown",
    },
    {
      title: "Giá gốc",
      dataIndex: "price",
      render: (price) => `${formatCurrency(price)} `, // Format price for readability
      align: "center",
    },
    {
      title: "Giá giảm",
      dataIndex: "discountPrice",
      render: (discountPrice) => `${formatCurrency(discountPrice)}`, // Format price for readability
      align: "center",
    },
    {
      title: "Ảnh chính",
      dataIndex: "mainImage",
      align: "center",
      render: (image) => (
        <img src={image} alt="Product" style={{ width: 50, height: 50 }} />
      ),
    },
    {
      title: "Hành động",
      render: (text, record) => (
        <div>
          <EyeOutlined
            onClick={() => handleView(record)}
            style={{ cursor: "pointer", color: "green", marginRight: "10px" }} // Thêm marginRight
          />
          <EditOutlined
            style={{ cursor: "pointer", color: "blue", marginRight: "10px" }} // Thêm marginRight
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn xóa mục này?"
            onConfirm={() => handleDelete(record)}
            okText="Có"
            cancelText="Không"
          >
            <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const filteredData = products.filter((item) => {
    const priceValue =
      typeof item.price === "number"
        ? item.price
        : parseInt(item.price?.replace(/\D/g, ""), 10) || 0;

    // Check if item.productName is defined before applying toLowerCase
    const matchesSearch =
      item.productName &&
      item.productName.toLowerCase().includes(searchText.toLowerCase());

    const matchesTags =
      selectedFilters.tags.length === 0 ||
      (Array.isArray(item.tags) &&
        item.tags.some((tag) => selectedFilters.tags.includes(tag)));

    const matchesFilters =
      priceValue >= priceRange[0] &&
      priceValue <= priceRange[1] &&
      (selectedFilters.categories.length === 0 ||
        selectedFilters.categories.includes(item.category)) &&
      (selectedFilters.brands.length === 0 ||
        selectedFilters.brands.includes(item.brand)) &&
      matchesTags &&
      (selectedFilters.conditions.length === 0 ||
        selectedFilters.conditions.includes(item.condition));

    // Combine search by product name and other filters
    return matchesSearch && matchesFilters;
  });

  // Render search history menu
  const menu = (
    <Menu>
      {searchHistory.map((item, index) => (
        <Menu.Item key={index} onClick={() => handleSearch(item)}>
          {item}
        </Menu.Item>
      ))}
    </Menu>
  );

  const clearFilters = () => {
    setSelectedFilters({
      categories: [],
      brands: [],
      tags: [],
      conditions: [],
    });
    setPriceRange([0, 50000000]);
    setSearchText("");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout style={{ padding: "0 24px 24px" }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: "#fff",
            borderRadius: "0.5rem",
          }}
        >
          {/* Các bộ lọc nằm ngang */}
          <div
            className="filter-container mb-3"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <div style={{ flex: 1 }}>
              <h4 className="text-primary">Khoảng giá</h4>
              <Slider
                range
                value={priceRange}
                min={0}
                max={50000000}
                step={1000000}
                onChange={handleSliderChange}
                tooltip={{
                  formatter: (value) => `${formatCurrency(value)}`,
                }}
              />
              <div>
                <span>
                  Chọn khoảng giá: {formatCurrency(priceRange[0])} -{" "}
                  {formatCurrency(priceRange[1])}
                </span>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <h4 className="text-primary">Danh mục</h4>
              <Select
                mode="multiple"
                value={selectedFilters.categories}
                onChange={(value) => handleFilterChange("categories", value)}
                placeholder="Chọn danh mục"
                style={{ width: "100%" }}
                size="small"
              >
                {categories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.cateName}
                  </Option>
                ))}
              </Select>
            </div>

            <div style={{ flex: 1 }}>
              <h4 className="text-primary">Thương hiệu</h4>
              <Select
                mode="multiple"
                value={selectedFilters.brands}
                onChange={(value) => handleFilterChange("brands", value)}
                placeholder="Chọn thương hiệu"
                style={{ width: "100%" }}
                size="small"
              >
                {brands.map((brand) => (
                  <Option key={brand.id} value={brand.id}>
                    {brand.brandName}
                  </Option>
                ))}
              </Select>
            </div>

            <div style={{ flex: 1 }}>
              <h4 className="text-primary">Thẻ</h4>
              <Select
                mode="multiple"
                value={selectedFilters.tags}
                onChange={(value) => handleFilterChange("tags", value)}
                placeholder="Chọn thẻ"
                style={{ width: "100%" }}
                size="small"
              >
                {tagsfill.map((tag) => (
                  <Option key={tag.id} value={tag.id}>
                    {tag.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div style={{ flex: 1 }}>
              <h4 className="text-primary">Tình trạng</h4>
              <Select
                mode="multiple"
                value={selectedFilters.conditions}
                onChange={(value) => handleFilterChange("conditions", value)}
                placeholder="Chọn tình trạng"
                style={{ width: "100%" }}
                size="small"
              >
                {conditions.map((condition) => (
                  <Option key={condition.id} value={condition.id}>
                    {condition.conditionName}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Clear Filters Button */}
          </div>
          <div style={{ flex: "0 0 auto", alignSelf: "flex-end" }}>
            <Button
              onClick={clearFilters}
              className="mb-3"
              style={{ width: "10%" }}
              size="small"
            >
              Xóa bộ lọc
            </Button>
          </div>
          <div className="col-md-6">
            <Dropdown overlay={menu} trigger={["click"]}>
              <div>
                <Search
                  placeholder="Tìm kiếm theo tên danh mục sản phẩm"
                  value={searchText}
                  onSearch={handleSearch}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 300 }}
                />
              </div>
            </Dropdown>
          </div>

          <Button
            type="primary"
            style={{ marginBottom: "20px", marginTop: "20px", float: "right" }}
            icon={<PlusOutlined />}
            onClick={handleAddProduct}
          >
            Thêm sản phẩm
          </Button>
          {loading ? (
            <Spin size="large" />
          ) : (
            <Table
              columns={getColumns(handleEdit, handleDelete, handleView)}
              dataSource={filteredData}
              pagination={{ pageSize: 10 }}
              rowKey="key"
              scroll={{ x: "max-content" }}
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Productlist;
