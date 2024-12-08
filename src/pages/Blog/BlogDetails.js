import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, Spin, Button } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const BlogDetails = () => {
  const { id } = useParams(); // Lấy ID blog từ URL
  const [blogData, setBlogData] = useState(null);
  const [authorName, setAuthorName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const searchText = location.state?.searchText || "";

  // Hàm lấy thông tin tác giả
  const fetchAuthorName = async (authorId) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/employees/${authorId}`
      );
      return response.data.username || "Không xác định";
    } catch (error) {
      console.error("Lỗi khi lấy thông tin tác giả:", error);
      return "Không xác định";
    }
  };

  // Hàm lấy tên danh mục
  const fetchCategoryName = async (categoryId) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/blogcategories/${categoryId}`
      );
      return response.data.cateBlogName || "Không xác định";
    } catch (error) {
      console.error("Lỗi khi lấy tên danh mục:", error);
      return "Không xác định";
    }
  };

  // Hàm lấy thông tin người dùng từ comment
  const fetchCommentUsers = async (comments) => {
    try {
      const users = await Promise.all(
        comments.map(async (comment) => {
          if (comment.user) {
            const response = await axios.get(
              `http://localhost:8081/api/users/${comment.user}`
            );
            return {
              ...comment,
              username: response.data.username || "Người dùng không xác định",
            };
          }
          return { ...comment, username: "Người dùng không xác định" };
        })
      );
      setComments(users);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng từ comment:", error);
    }
  };

  // Hàm lấy thông tin blog từ API
  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/blogs/${id}`
        );
        const blog = response.data;
        setBlogData(blog);

        // Lấy thông tin tác giả, danh mục, và người dùng từ comment
        const [author, category] = await Promise.all([
          fetchAuthorName(blog.author),
          fetchCategoryName(blog.category),
        ]);

        setAuthorName(author);
        setCategoryName(category);

        // Fetch comment user data
        if (blog.comments && blog.comments.length > 0) {
          await fetchCommentUsers(blog.comments);
        }

        console.log("Dữ liệu blog:", blog);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu blog:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogDetails();
    }
  }, [id, navigate]);

  if (loading) {
    return <Spin size="large" className="d-flex justify-content-center mt-5" />;
  }

  if (!blogData) {
    return (
      <div className="container mt-5">
        Không có thông tin chi tiết bài viết.
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <Card className="mb-4 shadow-sm">
        <div className="blog-images mb-3 d-flex">
          {blogData.blogImage && blogData.blogImage.length > 0 ? (
            blogData.blogImage.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Image ${index + 1} for Blog`}
                className="img-fluid mb-2"
                style={{
                  maxHeight: "200px",
                  objectFit: "cover",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            ))
          ) : (
            <p>Không có hình ảnh nào.</p>
          )}
        </div>

        <div className="card-body">
          <h2 className="card-title">{blogData.title}</h2>
          <p className="card-text">
            <strong>Tác Giả:</strong> {authorName}
            <br />
            <strong>Danh Mục:</strong> {categoryName}
            <br />
            <strong>Ngày Xuất Bản:</strong>{" "}
            {new Date(blogData.publishedDate).toLocaleDateString()}
            <br />
            <strong>Ngày Cập Nhật:</strong>{" "}
            {new Date(blogData.updatedAt).toLocaleDateString()}
          </p>
          <div
            className="card-text"
            dangerouslySetInnerHTML={{ __html: blogData.content }}
          />
        </div>
      </Card>

      <div className="comments-section mt-4">
        <h5>Bình Luận</h5>
        <ul className="list-group">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <li key={index} className="list-group-item">
                <strong>{comment.username}</strong>: {comment.comment} <br />
                <small>{new Date(comment.createdAt).toLocaleString()}</small>
              </li>
            ))
          ) : (
            <li className="list-group-item">Chưa có bình luận nào.</li>
          )}
        </ul>
      </div>
      <div className="text-start mt-5">
        <Button
          type="primary"
          onClick={() =>
            navigate("/admin/blog-list", { state: { searchText } })
          }
        >
          Quay lại Danh Bài Viết
        </Button>
      </div>
    </div>
  );
};

export default BlogDetails;
