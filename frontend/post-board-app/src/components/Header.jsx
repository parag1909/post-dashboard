import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { token, logout } = useContext(AppContext); // Use context to get token
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setUsername(localStorage.getItem("username"));
    } else {
      setUsername("");
    }
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleHomeClick = () => {
    if (token) {
      navigate("/home-page"); 
    } else {
      navigate("/"); 
    }
  };

  return (
    <nav className="nav-bar d-flex justify-content-between text-white p-3 align-items-center">
      <div>
        <div className="">
          <span className="font-bold text-lg pe-4">Social WebApp</span>
          {token && (
            <button
              onClick={handleHomeClick} 
              className="text-white text-decoration-none bg-transparent border-0"
            >
              <i className="fa fa-home me-1" aria-hidden="true"></i> Home
            </button>
          )}
        </div>
      </div>

      <div className="d-flex">
        {/* Search Bar */}
        <div className="d-none d-md-block">
          <input
            type="text"
            placeholder="Search Here..."
            className="px-2 py-1 text-black"
          />
          <button className="border-0 text-white bg-primary p-1">
            <i className="fa fa-search m" aria-hidden="true"></i>
          </button>
        </div>

        {/* Conditional Navigation */}
        <div className="">
          {token ? (
            <>
              <a
                href="/my-post"
                className="px-4 text-white text-decoration-none"
              >
                <i className="fa-solid fa-user-shield me-1"></i>My Post
              </a>
              <a href="/new-post" className="text-white text-decoration-none">
                <i className="fa-solid fa-user-pen me-1"></i>New Post
              </a>
              <span className="px-4">
                <i className="fa fa-user me-1" aria-hidden="true"></i>
                {username}
              </span>
              <button onClick={handleLogout} className="btn text-white">
                <i className="fa fa-sign-out me-1" aria-hidden="true"></i>Log
                Out
              </button>
            </>
          ) : (
            <>
              <a href="/" className="px-4 text-white text-decoration-none">
                <i className="fa-solid fa-user"></i> Log In
              </a>
              <a href="/signup" className="text-white text-decoration-none">
                <i className="fa fa-sign-in" aria-hidden="true"></i> Sign Up
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
