import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const { backendURL, setIsLoading, setToken, notify } = useContext(AppContext);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.username) {
      errors.username = "Username is required.";
    } else if (!/^[a-zA-Z0-9@.+-_]+$/.test(formData.username)) {
      errors.username = "Invalid username format.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setIsLoading(true);

      const { data } = await axios.post(
        `${backendURL}/api/user/login`,
        {
          username: formData.username,
          password: formData.password,
        },
        {}
      );

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        notify("Logged in successfully");
        navigate("/home-page");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        notify(error.response.data.message, "error");
      } else {
        notify("Login failed", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center mt-3">
      <div className="row p-4 shadow-lg bg-light" style={{ width: "90%" }}>
        <form className="pb-4 w-100" onSubmit={handleSubmit}>
          <h2 className=" mb-4 pb-2 fw-normal border-bottom">Login</h2>

          <div className="mb-3">
            <label className="form-label fw-semibold">Username*</label>
            <input
              type="text"
              name="username"
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
            />
            {errors.username && (
              <div className="invalid-feedback">{errors.username}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password*</label>
            <input
              type="password"
              name="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="btn btn-outline-primary py-2 col-1"
            >
              Login
            </button>
          </div>
        </form>
        <hr />
        <div>
          Need an account?{" "}
          <a href="/signup" className="text-primary fw-semibold">
            Sign Up Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
