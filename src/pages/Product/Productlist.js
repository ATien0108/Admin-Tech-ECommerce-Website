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
    navigate(`/admin/edit-product/${record.id}`); // Use record.id to navigate
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
    navigate("/admin/add-product");
  };

  const handleView = (record) => {
    navigate(`/admin/product-detail/${record.productName}`); // Use record.id to navigate
  };

  const getColumns = (onEdit, onDelete, onView) => [
    {
      title: "STT",
      dataIndex: "key",
      render: (_, __, index) => index + 1, // Display the row index as the No.
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      render: (categoryId) => category[categoryId] || "Unknown",
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      render: (brandId) => brand[brandId] || "Unknown",
    },
    {
      title: "Nhãn",
      dataIndex: "tags",
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
    },
    {
      title: "Giá giảm",
      dataIndex: "discountPrice",
      render: (discountPrice) => `${formatCurrency(discountPrice)}`, // Format price for readability
    },
    {
      title: "Ảnh chính",
      dataIndex: "mainImage",
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

    return matchesSearch && matchesFilters;
  });

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
      <Sider
        width={300}
        style={{ height: "100%" }}
        className="site-layout-background"
      >
        <div
          className="container-fluid p-3 bg-white shadow-sm rounded"
          style={{ borderRadius: "0.5rem", height: "100%" }}
        >
          <Input
            placeholder="Search"
            onChange={(e) => handleSearch(e.target.value)}
            className="mb-3"
            style={{ bordercolors: "#1890ff" }}
          />
          <div className="mb-3">
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
              className="mb-2"
            />

            <div>
              <span>
                Selected range: {formatCurrency(priceRange[0])} -{" "}
                {formatCurrency(priceRange[1])}
              </span>
            </div>
          </div>

          {/* Render categories checkboxes */}
          <div className="mb-3">
            <h4 className="text-primary">Danh mục</h4>
            <div className="d-flex flex-wrap">
              {categories.map((category) => (
                <div key={category.id} className="me-3 mb-2">
                  <Checkbox
                    checked={selectedFilters.categories.includes(category.id)}
                    onChange={(e) =>
                      handleFilterChange(
                        "categories",
                        e.target.checked
                          ? [...selectedFilters.categories, category.id]
                          : selectedFilters.categories.filter(
                              (c) => c !== category.id
                            )
                      )
                    }
                  >
                    {category.cateName}
                  </Checkbox>
                </div>
              ))}
            </div>
          </div>

          {/* Render brands checkboxes */}
          <div className="mb-3">
            <h4 className="text-primary">Thương hiệu</h4>
            <div className="d-flex flex-wrap">
              {brands.map((brand) => (
                <div key={brand.id} className="me-3 mb-2">
                  <Checkbox
                    checked={selectedFilters.brands.includes(brand.id)}
                    onChange={(e) =>
                      handleFilterChange(
                        "brands",
                        e.target.checked
                          ? [...selectedFilters.brands, brand.id]
                          : selectedFilters.brands.filter((b) => b !== brand.id)
                      )
                    }
                  >
                    {brand.brandName}
                  </Checkbox>
                </div>
              ))}
            </div>
          </div>

          {/* Render tags checkboxes */}
          <div className="mb-3">
            <h4 className="text-primary">Thẻ</h4>
            <div className="d-flex flex-wrap">
              {tagsfill.map((tag) => (
                <div key={tag.id} className="me-3 mb-2">
                  <Checkbox
                    checked={selectedFilters.tags.includes(tag.id)}
                    onChange={(e) =>
                      handleFilterChange(
                        "tags",
                        e.target.checked
                          ? [...selectedFilters.tags, tag.id]
                          : selectedFilters.tags.filter((t) => t !== tag.id)
                      )
                    }
                  >
                    {tag.name}
                  </Checkbox>
                </div>
              ))}
            </div>
          </div>

          {/* Render conditions checkboxes */}
          <div className="mb-3">
            <h4 className="text-primary">Tình trạng</h4>
            <div className="d-flex flex-wrap">
              {conditions.map((condition) => (
                <div key={condition.id} className="me-3 mb-2">
                  <Checkbox
                    checked={selectedFilters.conditions.includes(condition.id)}
                    onChange={(e) =>
                      handleFilterChange(
                        "conditions",
                        e.target.checked
                          ? [...selectedFilters.conditions, condition.id]
                          : selectedFilters.conditions.filter(
                              (c) => c !== condition.id
                            )
                      )
                    }
                  >
                    {condition.conditionName}
                  </Checkbox>
                </div>
              ))}
            </div>
          </div>
          <Button
            onClick={clearFilters}
            className="mb-3"
            style={{ width: "100%" }}
          >
            Clear Filters
          </Button>
        </div>
      </Sider>
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
          <h3 className="mb-4 title">Danh Sách Sản Phẩm</h3>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddProduct}
          >
            Thêm sản phẩm
          </Button>
          {loading ? (
            <Spin size="large" />
          ) : (
            <Table
              columns={getColumns(handleEdit, handleDelete, handleView)} // Pass necessary functions as arguments
              dataSource={filteredData}
              pagination={{ pageSize: 10 }}
              rowKey="key" // Ensure a unique key prop for each row
              scroll={{ x: "max-content" }}
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Productlist;
