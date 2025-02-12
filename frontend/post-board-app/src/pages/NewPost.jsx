import axios from "axios";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const NewPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null, // initialize as null since we're dealing with a file object
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setFormData({ ...formData, [name]: files[0] }); // Set the image file object
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const { backendURL, token, notify } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.title || !formData.content) {
      setErrors({
        ...errors,
        title: !formData.title ? "Title is required." : "",
        content: !formData.content ? "Content is required" : "",
      });
      return;
    }

    // Create FormData instance
    const postData = new FormData();
    postData.append("title", formData.title);
    postData.append("content", formData.content);
    if (formData.image) {
      postData.append("image", formData.image); // Add image file to the FormData
    }

    // Call the API
    try {
      const { data } = await axios.post(`${backendURL}/api/posts`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        notify("Post created successfully");
        navigate("/my-post");
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <div className="container d-flex justify-content-center mt-3">
      <div className="row p-4 shadow-lg bg-light" style={{ width: "90%" }}>
        <form className="pb-4 w-100" onSubmit={handleSubmit}>
          <h2 className="mb-4 pb-2 fw-normal border-bottom">Post</h2>

          {/* Title Input */}
          <div className="mb-3">
            <label htmlFor="title" className="form-label fw-semibold">
              Title*
            </label>
            <input
              type="text"
              name="title"
              className={`form-control ${errors.title ? "is-invalid" : ""}`}
              value={formData.title}
              onChange={handleChange}
              required
            />
            {errors.title && (
              <div className="invalid-feedback">{errors.title}</div>
            )}
          </div>

          {/* Content Input */}
          <div className="mb-3">
            <label htmlFor="content" className="form-label fw-semibold">
              Content*
            </label>
            <textarea
              className={`form-control ${errors.content ? "is-invalid" : ""}`}
              id="content"
              rows="5"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
            ></textarea>
            {errors.content && (
              <div className="invalid-feedback">{errors.content}</div>
            )}
          </div>

          {/* File Upload (Optional) */}
          <div className="mb-3">
            <label htmlFor="fileUpload" className="form-label fw-semibold">
              File
            </label>
            <input
              type="file"
              className="d-block"
              id="fileUpload"
              onChange={handleChange}
              name="image"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="btn btn-outline-primary py-2 col-1 mt-4 d-flex align-items-center justify-content-center"
            >
              <i className="fas fa-upload me-2"></i>Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPost;
