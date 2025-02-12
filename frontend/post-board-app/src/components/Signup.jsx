import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    } else if (/^\d+$/.test(formData.password)) {
      errors.password = "Password can't be entirely numeric.";
    }

    if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setIsLoading(true);

      const { data } = await axios.post(`${backendURL}/api/user/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        notify("User registered successfully");
        navigate("/home-page"); // TODO: Show notify and Proper Navigation
      } else {
        notify("Signup failed.", "error");
      }
    } catch (error) {
      console.log(error);
      notify("Signup failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center">
      <div className="row p-4 shadow-lg bg-light" style={{ width: "90%" }}>
        <form className="pb-4 w-100" onSubmit={handleSubmit}>
          <h2 className=" mb-4 pb-2 fw-normal border-bottom">Join Today</h2>

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
            <p className="text-secondary">
              Required. 150 characters or fewer. Letters, digits and @/./+/-/_
              only.
            </p>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email*</label>
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
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
            <ul>
              <li>
                Your password cant be to similar to you other personal
                information
              </li>
              <li>Your password must contain atleast 8 charcters</li>
              <li>Your password cant be commonly used password</li>
              <li>Your password cant be entirely numeric</li>
            </ul>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Confirm Password*</label>
            <input
              type="password"
              name="confirmPassword"
              className={`form-control ${
                errors.confirmPassword ? "is-invalid" : ""
              }`}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback">{errors.confirmPassword}</div>
            )}
            <p className="text-secondary">
              Enter same password as before, for verification.
            </p>
          </div>

          <div>
            <button
              type="submit"
              className="btn btn-outline-primary py-2 col-1"
            >
              Sign Up
            </button>
          </div>
        </form>
        <hr />
        <div>
          Already have an account?{" "}
          <a href="/" className="text-primary fw-semibold">
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
