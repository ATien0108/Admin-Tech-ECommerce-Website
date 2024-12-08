import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Input, message, Form, Spin } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "antd/dist/reset.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const EditAbout = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [creators, setCreators] = useState([]);
  const [createdAt, setCreatedAt] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecord = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8081/api/about/${id}`);
        if (!response.ok) {
          throw new Error("Lấy thông tin về không thành công");
        }
        const record = await response.json();
        setTitle(record.title || "");
        setContent(record.content || "");
        setImages(record.image || []);
        setCreators(record.creator || []);
        setCreatedAt(record.createdAt ? new Date(record.createdAt) : null);
        setUpdatedAt(record.updatedAt ? new Date(record.updatedAt) : null);
      } catch (error) {
        message.error(error.message || "Lấy thông tin về không thành công");
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  const handleCreatorChange = (index, key, value) => {
    const newCreators = [...creators];
    newCreators[index][key] = value;
    setCreators(newCreators);
  };

  const handleAddImage = () => {
    setImages([...images, ""]); // Placeholder cho URL hình ảnh mới
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleAddCreator = () => {
    const newCreator = {
      avatar: "",
      name: "",
      age: "",
      gender: "",
      occupation: "",
      workplace: "",
    };
    setCreators([...creators, newCreator]);
  };

  const handleRemoveCreator = (index) => {
    const newCreators = creators.filter((_, i) => i !== index);
    setCreators(newCreators);
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Kiểm tra các trường bắt buộc
    if (!title.trim()) {
      message.error("Vui lòng nhập tiêu đề.");
      setLoading(false);
      return;
    }

    if (!content.trim()) {
      message.error("Vui lòng nhập nội dung.");
      setLoading(false);
      return;
    }

    if (images.some((image) => !image.trim())) {
      message.error("Vui lòng nhập đầy đủ URL hình ảnh.");
      setLoading(false);
      return;
    }

    if (
      creators.some((creator) => {
        const {
          avatar = "",
          name = "",
          age = "",
          gender = "",
          occupation = "",
          workplace = "",
        } = creator;

        return (
          !avatar.trim() ||
          !name.trim() ||
          !String(age).trim() || // Convert `age` to a string before trimming
          !gender.trim() ||
          !occupation.trim() ||
          !workplace.trim()
        );
      })
    ) {
      message.error(
        "Vui lòng điền đầy đủ thông tin cho tất cả người sáng tạo."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8081/api/about/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
            image: images,
            creator: creators,
            createdAt,
            updatedAt: new Date().toISOString(),
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Cập nhật thông tin về không thành công");
      }
      message.success("Cập nhật thông tin về thành công.");
      navigate("/admin/about");
    } catch (error) {
      message.error(error.message || "Cập nhật thông tin về không thành công.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 title">Chỉnh sửa thông tin về</h3>
      <Spin spinning={loading}>
        <Form layout="vertical">
          <Form.Item label="Tiêu đề">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Form.Item>
          <Form.Item label="Nội dung">
            <ReactQuill value={content} onChange={setContent} />
          </Form.Item>
          <Form.Item label="Hình ảnh">
            {images.map((image, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <Input
                  style={{ width: "70%" }}
                  value={image}
                  onChange={(e) => {
                    const newImages = [...images];
                    newImages[index] = e.target.value;
                    setImages(newImages);
                  }}
                  placeholder="Nhập URL hình ảnh"
                />
                <img
                  src={image}
                  alt={`Image ${index + 1}`}
                  style={{
                    width: "50px",
                    height: "50px",
                    marginLeft: "10px", // Khoảng cách giữa URL và ảnh
                    objectFit: "cover", // Đảm bảo ảnh không bị méo
                  }}
                />
                <Button
                  type="link"
                  danger
                  onClick={() => handleRemoveImage(index)}
                  style={{ marginLeft: "10px" }}
                >
                  Xóa
                </Button>
              </div>
            ))}
            <Button
              type="dashed"
              onClick={handleAddImage}
              style={{ marginTop: "10px" }}
            >
              Thêm hình ảnh
            </Button>
          </Form.Item>

          <h4>Người sáng tạo</h4>
          {creators.map((creator, index) => (
            <div key={index} className="mb-4">
              <img
                src={creator.avatar}
                alt={`Avatar của ${creator.name}`}
                style={{ width: "50px", marginRight: "10px" }}
              />
              <Form.Item label="URL Avatar">
                <Input
                  value={creator.avatar}
                  onChange={(e) =>
                    handleCreatorChange(index, "avatar", e.target.value)
                  }
                  placeholder="Nhập URL avatar"
                />
              </Form.Item>
              <Form.Item label="Tên">
                <Input
                  value={creator.name}
                  onChange={(e) =>
                    handleCreatorChange(index, "name", e.target.value)
                  }
                />
              </Form.Item>
              <Form.Item label="Tuổi">
                <Input
                  type="number"
                  value={creator.age}
                  onChange={(e) =>
                    handleCreatorChange(index, "age", e.target.value)
                  }
                />
              </Form.Item>
              <Form.Item label="Giới tính">
                <Input
                  value={creator.gender}
                  onChange={(e) =>
                    handleCreatorChange(index, "gender", e.target.value)
                  }
                />
              </Form.Item>
              <Form.Item label="Nghề nghiệp">
                <Input
                  value={creator.occupation}
                  onChange={(e) =>
                    handleCreatorChange(index, "occupation", e.target.value)
                  }
                />
              </Form.Item>
              <Form.Item label="Nơi làm việc">
                <Input
                  value={creator.workplace}
                  onChange={(e) =>
                    handleCreatorChange(index, "workplace", e.target.value)
                  }
                />
              </Form.Item>
              <Button
                type="link"
                danger
                onClick={() => handleRemoveCreator(index)}
              >
                Xóa người sáng tạo
              </Button>
            </div>
          ))}
          <Button
            type="dashed"
            onClick={handleAddCreator}
            style={{ marginBottom: "10px" }}
          >
            Thêm người sáng tạo
          </Button>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="createdAt" className="form-label">
                Ngày tạo
              </label>
              <input
                type="text"
                id="createdAt"
                className="form-control"
                value={createdAt ? createdAt.toLocaleString() : ""}
                disabled
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="updatedAt" className="form-label">
                Ngày cập nhật
              </label>
              <input
                type="text"
                id="updatedAt"
                className="form-control"
                value={updatedAt ? updatedAt.toLocaleString() : ""}
                disabled
              />
            </div>
          </div>
          <div className="text-center">
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              style={{ backgroundColor: "#28a745", borderColor: "#28a745" }} // Màu xanh lá
            >
              Lưu
            </Button>
          </div>
          <div className="text-start mt-5">
            <Button type="primary" onClick={() => navigate("/admin/about")}>
              Quay lại Giới Thiệu
            </Button>
          </div>
        </Form>
      </Spin>
    </div>
  );
};

export default EditAbout;
