import React, { useState, useEffect } from "react";
import { message, Button, Select } from "antd";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const { Option } = Select;

const AddProduct = () => {
  const [productName, setProName] = useState("");
  const [brand, setBrand] = useState(null);
  const [category, setCategory] = useState(null);
  const [condition, setCondition] = useState(null);
  const [productDesc, setProDesc] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [mainImage, setMainImage] = useState(null); // Main image
  const [previewMainImage, setPreviewMainImage] = useState(null); // Preview for main image
  const [thumbnails, setThumbnails] = useState([]); // Thumbnail files
  const [previewThumbnails, setPreviewThumbnails] = useState([]); // Thumbnail previews
  const [specList, setSpecList] = useState([{ key: "", value: "" }]);
  const [tags, setTags] = useState([]);
  const [colors, setColors] = useState([{ name: "", quantity: 0 }]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [ratings, setRatings] = useState({ average: 0, totalReviews: 0 });
  const location = useLocation();
  const searchText = location.state?.searchText || "";

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/brands/all"
        );
        setBrands(response.data);
      } catch (error) {
        message.error("Không thể tải danh sách thương hiệu.");
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/categories/all"
        );
        setCategories(response.data);
      } catch (error) {
        message.error("Không thể tải danh sách danh mục.");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchConditions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/product-conditions/all"
        );
        setConditions(response.data);
      } catch (error) {
        message.error("Không thể tải danh sách tình trạng.");
      }
    };
    fetchConditions();
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/tags/all");
        setAllTags(response.data);
      } catch (error) {
        message.error("Không thể tải danh sách thẻ.");
      }
    };
    fetchTags();
  }, []);

  const handleAddColor = () => {
    setColors([...colors, { name: "", quantity: 0 }]);
  };

  const handleAddSpecification = () => {
    setSpecList([...specList, { key: "", value: "" }]);
  };

  const handleSpecChange = (index, field, value) => {
    const updatedSpecs = [...specList];
    updatedSpecs[index][field] = value;
    setSpecList(updatedSpecs);
  };
  const handleTagChange = (value) => {
    setTags(value);
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setPreviewMainImage(URL.createObjectURL(file)); // Generate preview URL
    }
  };

  const handleRemoveMainImage = () => {
    setMainImage(null);
    setPreviewMainImage(null);
  };

  const handleThumbnailChange = (e) => {
    const files = Array.from(e.target.files);
    const updatedThumbnails = [...thumbnails, ...files];
    const previewUrls = files.map((file) => URL.createObjectURL(file));

    setThumbnails(updatedThumbnails);
    setPreviewThumbnails([...previewThumbnails, ...previewUrls]);
  };

  const handleRemoveThumbnail = (index) => {
    const updatedThumbnails = thumbnails.filter((_, i) => i !== index);
    const updatedPreviews = previewThumbnails.filter((_, i) => i !== index);

    setThumbnails(updatedThumbnails);
    setPreviewThumbnails(updatedPreviews);
  };

  const handleAddThumbnail = () => {
    setThumbnails([...thumbnails, ""]);
  };

  const handleColorChange = (index, field, value) => {
    const updatedColor = [...colors];
    if (field === "quantity" && (isNaN(value) || Number(value) <= 0)) {
      message.error("Số lượng phải là số lớn hơn 0.");
      return;
    }
    updatedColor[index][field] = value;
    setColors(updatedColor);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc và giá trị hợp lệ
    if (price <= 0) {
      message.error("Giá sản phẩm phải lớn hơn 0.");
      return;
    }

    if (discountPrice < 0) {
      message.error("Giá giảm không được là số âm.");
      return;
    }

    if (discountPrice >= price) {
      message.error("Giá giảm phải nhỏ hơn Giá sản phẩm.");
      return;
    }

    // Chuẩn bị dữ liệu
    const productData = {
      productName,
      brand,
      category,
      condition,
      productDesc,
      price: parseFloat(price),
      discountPrice: parseFloat(discountPrice),
      specifications: Object.fromEntries(
        specList.map((spec) => [spec.key, spec.value])
      ),
      tags,
      colors,
      ratings,
    };

    console.log(productData);

    // Chuẩn bị FormData
    const formData = new FormData();
    formData.append("product", JSON.stringify(productData)); // Thêm dữ liệu sản phẩm dạng JSON
    if (mainImage) formData.append("mainImage", mainImage); // Thêm file ảnh chính
    thumbnails.forEach((thumbnail, index) => {
      formData.append(`thumbnails`, thumbnail); // Thêm các file ảnh phụ
    });

    try {
      const response = await axios.post(
        "http://localhost:8081/api/products/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        message.success("Sản phẩm đã được thêm thành công");
        navigate("/admin/product-list");
      } else {
        message.error("Thêm sản phẩm thất bại");
      }
    } catch (error) {
      message.error("Lỗi khi thêm sản phẩm: " + error.message);
    }
  };

  return (
    <div className="container">
      <h3 className="mb-4 title">Thêm Sản Phẩm</h3>
      <form onSubmit={handleSubmit}>
        <div className="col-md-12 mb-3">
          <label htmlFor="productName" className="form-label">
            Tên Sản Phẩm
          </label>
          <input
            type="text"
            id="brandName"
            className="form-control"
            value={productName}
            onChange={(e) => setProName(e.target.value)}
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
            onChange={(e) => setProDesc(e.target.value)}
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
              min="0.01" // Giá trị tối thiểu
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
              min="0" // Giá trị tối thiểu
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-md-4 mb-3">
            <label htmlFor="brand" className="form-label">
              Thương Hiệu
            </label>
            <Select
              id="brand"
              placeholder="Chọn Thương Hiệu"
              style={{ width: "100%" }}
              value={brand}
              onChange={setBrand}
              required
            >
              {brands.map((b) => (
                <Option key={b.id} value={b.id}>
                  {b.brandName}
                </Option>
              ))}
            </Select>
          </div>

          <div className="col-12 col-md-4 mb-3">
            <label htmlFor="category" className="form-label">
              Danh Mục
            </label>
            <Select
              id="category"
              value={category}
              onChange={setCategory}
              placeholder="Chọn Danh Mục"
              style={{ width: "100%" }}
              required
            >
              {categories.map((c) => (
                <Option key={c.id} value={c.id}>
                  {c.cateName}
                </Option>
              ))}
            </Select>
          </div>

          <div className="col-12 col-md-4 mb-3">
            <label htmlFor="condition" className="form-label">
              Tình Trạng
            </label>
            <Select
              id="condition"
              value={condition}
              onChange={setCondition}
              placeholder="Chọn Tình Trạng"
              style={{ width: "100%" }}
              required
            >
              {conditions.map((cond) => (
                <Option key={cond.id} value={cond.id}>
                  {cond.conditionName}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Main Image Section */}
          <div className="col-md-12 mb-3">
            <label htmlFor="mainImage" className="form-label">
              Ảnh Chính
            </label>
            <input
              type="file"
              id="mainImage"
              className="form-control"
              onChange={handleMainImageChange}
              accept="image/*"
            />
            {previewMainImage && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={previewMainImage}
                  alt="Ảnh Chính"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <Button
                  type="danger"
                  onClick={handleRemoveMainImage}
                  style={{ marginLeft: "10px" }}
                >
                  Xóa
                </Button>
              </div>
            )}
          </div>

          {/* Thumbnails Section */}
          <div className="col-md-12 mb-3">
            <label htmlFor="thumbnails" className="form-label">
              Ảnh Phụ
            </label>
            <input
              type="file"
              multiple
              className="form-control"
              onChange={handleThumbnailChange}
              accept="image/*"
            />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              {previewThumbnails.map((url, index) => (
                <div
                  key={index}
                  style={{
                    position: "relative",
                    width: "100px",
                    height: "100px",
                  }}
                >
                  <img
                    src={url}
                    alt={`Thumbnail ${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <Button
                    type="danger"
                    onClick={() => handleRemoveThumbnail(index)}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      padding: "5px",
                      fontSize: "12px",
                    }}
                  >
                    X
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </form>

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
                justifyContent: "space-between", // Giúp các ô cách đều nhau
                alignItems: "center", // Căn giữa các ô nhập theo chiều dọc
              }}
            >
              <input
                type="text"
                placeholder="Màu Sắc"
                value={colorItem.name}
                onChange={(e) =>
                  handleColorChange(index, "name", e.target.value)
                }
                className="form-control mb-2"
                style={{
                  flex: 1, // Cho phép các ô chiếm không gian đều nhau
                  marginRight: "10px",
                  marginTop: "8px", // Khoảng cách giữa 2 ô
                }}
              />

              <input
                type="number"
                placeholder="Số Lượng"
                value={colorItem.quantity || ""}
                onChange={(e) =>
                  handleColorChange(index, "quantity", e.target.value)
                }
                className="form-control"
                style={{
                  flex: 1, // Cho phép các ô chiếm không gian đều nhau
                }}
              />
            </div>
          ))}
          <Button onClick={handleAddColor} type="primary" className="mb-3">
            Thêm Màu Sắc
          </Button>
        </div>

        <div className="col-12 mb-3">
          <label htmlFor="specList" className="form-label">
            Thông Số Kỹ Thuật
          </label>
          {specList.map((spec, index) => (
            <div
              key={index}
              className="mb-3"
              style={{ display: "flex", alignItems: "center" }}
            >
              <input
                type="text"
                placeholder="Tên Thông Số"
                value={spec.key}
                onChange={(e) => handleSpecChange(index, "key", e.target.value)}
                className="form-control mb-2"
                style={{
                  flex: 1,
                  marginRight: "10px",
                  marginTop: "8px",
                }} // Căn giữa dữ liệu nhập vào
              />
              <input
                type="text"
                placeholder="Giá Trị Thông Số"
                value={spec.value}
                onChange={(e) =>
                  handleSpecChange(index, "value", e.target.value)
                }
                className="form-control"
                style={{ flex: 1 }} // Căn giữa dữ liệu nhập vào
              />
            </div>
          ))}
          <Button
            onClick={handleAddSpecification}
            type="primary"
            className="mb-3"
          >
            Thêm Thông Số
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
            value={tags}
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
            style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}
          >
            Thêm
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

export default AddProduct;
