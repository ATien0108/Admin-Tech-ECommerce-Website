import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { message, Button, Select } from "antd";
import axios from "axios";

const { Option } = Select;

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [thumbnails, setThumbnails] = useState([""]);
  const [specList, setSpecList] = useState([{ key: "", value: "" }]);
  const [tags, setTags] = useState([]);
  const [colors, setColors] = useState([{ name: "", quantity: 0 }]);
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [createdAt, setCreatedAt] = useState("");
  const location = useLocation();
  const searchText = location.state?.searchText || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          brandsResponse,
          categoriesResponse,
          conditionsResponse,
          tagsResponse,
        ] = await Promise.all([
          axios.get("http://localhost:8081/api/brands/all"),
          axios.get("http://localhost:8081/api/categories/all"),
          axios.get("http://localhost:8081/api/product-conditions/all"),
          axios.get("http://localhost:8081/api/tags/all"),
        ]);
        setSelectedBrand(brandsResponse.data);
        setSelectedCategory(categoriesResponse.data);
        setSelectedCondition(conditionsResponse.data);
        setAllTags(tagsResponse.data);
      } catch (error) {
        message.error("Không thể tải dữ liệu.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/products/${id}`
        );
        const productData = response.data;

        setProductName(productData.productName);
        setBrand(productData.brand);
        setCategory(productData.category);
        setCondition(productData.condition);
        setProductDesc(productData.productDesc);
        setPrice(productData.price);
        setDiscountPrice(productData.discountPrice);
        setMainImage(productData.mainImage); // URL của ảnh chính
        setThumbnails(productData.thumbnails);
        setTags(productData.tags);
        setColors(productData.colors);
        setRatings(productData.ratings);
        setCreatedAt(productData.createdAt);
        setSpecList(
          Object.entries(productData.specifications).map(([key, value]) => ({
            key,
            value,
          }))
        );
        console.log(productData);
      } catch (error) {
        message.error("Không thể lấy thông tin sản phẩm");
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleThumbnailChange = (value, index) => {
    const updatedThumbnails = [...thumbnails];
    updatedThumbnails[index] = value;
    setThumbnails(updatedThumbnails);
  };

  const handleAddThumbnail = () => {
    setThumbnails([...thumbnails, ""]);
  };

  const handleDeleteThumbnail = (index) => {
    const updatedThumbnails = thumbnails.filter((_, i) => i !== index);
    setThumbnails(updatedThumbnails);
  };

  const handleAddColors = () => {
    setColors([...colors, { name: "", quantity: 0 }]); // Thêm màu sắc mới
  };

  const handleColorsChange = (index, field, value) => {
    const updatedColors = [...colors]; // Tạo bản sao của mảng màu hiện tại
    updatedColors[index][field] =
      field === "quantity" ? parseInt(value) : value; // Cập nhật trường tương ứng
    setColors(updatedColors); // Cập nhật state
  };

  const handleDeleteColor = (index) => {
    const updatedColors = colors.filter((_, i) => i !== index); // Xóa màu sắc theo index
    setColors(updatedColors);
  };

  const handleAddSpecification = () => {
    setSpecList([...specList, { key: "", value: "" }]);
  };

  const handleSpecChange = (index, field, value) => {
    const updatedSpecs = [...specList];
    updatedSpecs[index][field] = value;
    setSpecList(updatedSpecs);
  };

  const handleDeleteSpecification = (index) => {
    const updatedSpecs = specList.filter((_, i) => i !== index);
    setSpecList(updatedSpecs);
  };

  const handleTagChange = (value) => {
    console.log("Tags:", value); // Debug giá trị
    setTags(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra giá trị âm cho giá sản phẩm và giá giảm
    if (parseFloat(price) < 0 || parseFloat(discountPrice) < 0) {
      message.error("Giá sản phẩm và giá giảm không được là số âm.");
      return;
    }

    // Kiểm tra giá giảm lớn hơn hoặc bằng giá sản phẩm
    if (parseFloat(discountPrice) >= parseFloat(price)) {
      message.error("Giá giảm phải nhỏ hơn giá sản phẩm.");
      return;
    }

    // Kiểm tra số lượng màu sắc không được là số âm
    const invalidColors = colors.filter((color) => color.quantity < 0);
    if (invalidColors.length > 0) {
      message.error("Số lượng màu sắc không được là số âm.");
      return;
    }

    const productData = {
      productName,
      productDesc,
      price: parseFloat(price),
      discountPrice: parseFloat(discountPrice),
      mainImage,
      thumbnails,
      brand,
      category,
      condition,
      tags,
      colors,
      specifications: Object.fromEntries(
        specList.map((spec) => [spec.key, spec.value])
      ),
      ratings,
      createdAt,
    };
    console.log(productData);

    try {
      await axios.put(
        `http://localhost:8081/api/products/update/${id}`,
        productData
      );
      message.success("Chỉnh sửa sản phẩm thành công");
      navigate("/admin/product-list");
    } catch (error) {
      message.error("Lỗi khi chỉnh sửa sản phẩm: " + error.message);
    }
  };

  return (
    <div className="container">
      <h3 className="mb-4 title">Chỉnh Sửa Sản Phẩm</h3>
      <form onSubmit={handleSubmit}>
        <div className="col-md-6 mb-3">
          <label htmlFor="productName" className="form-label">
            Tên Sản Phẩm
          </label>
          <input
            type="text"
            id="brandName"
            className="form-control"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Nhập Tên Sản Phẩm"
            required
          />
        </div>

        <div className="col-md-15 mb-3">
          <label htmlFor="productDesc" className="form-label">
            Mô Tả Sản Phẩm
          </label>
          <textarea
            id="productDesc"
            className="form-control"
            value={productDesc}
            onChange={(e) => setProductDesc(e.target.value)}
            placeholder="Nhập mô tả sản phẩm"
            required
          />
        </div>

        <div className="row mb-3">
          <div className="col-md-6 mb-3">
            <label htmlFor="price" className="form-label">
              Giá Sản Phẩm
            </label>
            <input
              id="price"
              type="number"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Nhập Giá Sản Phẩm"
              required
              step="any"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="discountPrice" className="form-label">
              Giá giảm
            </label>
            <input
              id="discountPrice"
              type="number"
              className="form-control"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              placeholder="Nhập Giá Giảm"
              required
              step="any"
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-12 col-md-4">
            <label htmlFor="brand" className="form-label">
              Thương hiệu
            </label>
            <Select
              value={brand}
              onChange={setBrand}
              style={{ width: "100%", height: "40px", fontSize: "16px" }}
            >
              {Array.isArray(selectedBrand) &&
                selectedBrand.map((b) => (
                  <Option key={b.id} value={b.id}>
                    {b.brandName}
                  </Option>
                ))}
            </Select>
          </div>

          <div className="col-12 col-md-4">
            <label htmlFor="category" className="form-label">
              Danh mục
            </label>
            <Select
              value={category}
              onChange={setCategory}
              style={{ width: "100%", height: "40px", fontSize: "16px" }}
            >
              {Array.isArray(selectedCategory) &&
                selectedCategory.map((c) => (
                  <Option key={c.id} value={c.id}>
                    {c.cateName}
                  </Option>
                ))}
            </Select>
          </div>

          <div className="col-12 col-md-4">
            <label htmlFor="condition" className="form-label">
              Tình trạng
            </label>
            <Select
              value={condition}
              onChange={setCondition}
              style={{ width: "100%", height: "40px", fontSize: "16px" }}
            >
              {Array.isArray(selectedCondition) &&
                selectedCondition.map((cond) => (
                  <Option key={cond.id} value={cond.id}>
                    {cond.conditionName}
                  </Option>
                ))}
            </Select>
          </div>
        </div>

        <div className="col-md-12 mb-3">
          <label htmlFor="mainImage" className="form-label">
            URL Ảnh Chính
          </label>
          <input
            type="text"
            id="mainImage"
            className="form-control"
            value={mainImage}
            onChange={(e) => setMainImage(e.target.value)}
            placeholder="Dán URL Ảnh Chính"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="thumbnail" className="form-label">
            URL Ảnh Phụ
          </label>
          {thumbnails.map((thumbnail, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center" }}>
              <input
                type="text"
                value={thumbnail}
                onChange={(e) => handleThumbnailChange(e.target.value, index)}
                className="form-control"
                placeholder="Dán URL Ảnh Phụ"
                style={{ flex: 1 }}
              />
              <Button
                type="primary"
                danger
                onClick={() => handleDeleteThumbnail(index)}
                style={{ marginLeft: "10px" }}
              >
                Xóa
              </Button>
            </div>
          ))}
          <Button onClick={handleAddThumbnail} type="primary" className="mt-3">
            Thêm Ảnh
          </Button>
        </div>

        {/* Màu sắc */}
        <div className="col-12 mb-3">
          <label htmlFor="colors" className="form-label">
            Màu Sắc
          </label>
          {colors.map((colorItem, index) => (
            <div
              key={index}
              className="mb-3"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="Màu Sắc"
                value={colorItem.name}
                onChange={(e) =>
                  handleColorsChange(index, "name", e.target.value)
                }
                className="form-control mb-2"
                style={{ flex: 1, marginRight: "10px" }}
              />

              <input
                type="number"
                placeholder="Số Lượng"
                value={colorItem.quantity || ""}
                onChange={(e) =>
                  handleColorsChange(index, "quantity", e.target.value)
                }
                className="form-control mb-2"
                style={{ flex: 1 }}
              />

              <Button
                type="primary"
                danger // Đảm bảo thêm thuộc tính "danger" ở đây
                onClick={() => handleDeleteColor(index)}
                style={{ marginLeft: "10px" }}
              >
                Xóa
              </Button>
            </div>
          ))}
          <Button onClick={handleAddColors} type="primary" className="mb-3">
            Thêm Màu Sắc
          </Button>
        </div>

        {/* Thông số kỹ thuật */}
        <div className="col-12 mb-3">
          <label htmlFor="specifications" className="form-label">
            Thông số kỹ thuật
          </label>
          {specList.map((spec, index) => (
            <div
              key={index}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Tên thông số"
                value={spec.key}
                onChange={(e) => handleSpecChange(index, "key", e.target.value)}
                style={{ flex: 1, marginRight: "10px" }}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Giá trị"
                value={spec.value}
                onChange={(e) =>
                  handleSpecChange(index, "value", e.target.value)
                }
                style={{ flex: 1 }}
              />

              <Button
                type="primary"
                danger // Đảm bảo thêm thuộc tính "danger" ở đây
                onClick={() => handleDeleteSpecification(index)}
                style={{ marginLeft: "10px" }}
              >
                Xóa
              </Button>
            </div>
          ))}

          <Button onClick={handleAddSpecification} type="primary">
            Thêm Thông Số Kỹ Thuật
          </Button>
        </div>

        <div className="col-12 mb-3">
          <label htmlFor="specList" className="form-label">
            Thẻ
          </label>
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Vui lòng chọn Thẻ"
            value={tags} // Mảng rỗng khi không có thẻ nào
            onChange={handleTagChange}
          >
            {allTags.map((tag) => (
              <Option key={tag.id} value={tag.id}>
                {tag.name}
              </Option>
            ))}
          </Select>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="primary"
            htmlType="submit"
            className="mt-3"
            style={{ backgroundColor: "#28a745", borderColor: "#28a745" }} // Màu xanh lá
          >
            Lưu
          </Button>
        </div>
        <div className="text-start mt-5">
          <Button
            type="primary"
            onClick={() =>
              navigate("/admin/product-list", { state: { searchText } })
            }
          >
            Quay lại Danh Sách Sản Phẩm
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
