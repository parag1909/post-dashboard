import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import logo from "../assets/images/user.png";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { backendURL } = useContext(AppContext);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${backendURL}/api/posts?page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  return (
    <div className="container d-flex justify-content-center flex-column align-items-center mt-5">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ul className="list-group" style={{ width: "90%" }}>
            {posts.map((post) => (
              <li
                key={post._id}
                className="list-group-item p-5 shadow-lg bg-light mb-5"
              >
                <div className="d-flex shadow-lg px-3 pb-4">
                  <div className="col-1 text-center">
                    <img
                      src={logo}
                      alt="no image"
                      className="img-fluid rounded-pill my-post-user-image"
                    />
                  </div>
                  <div className="col-11">
                    <h4 className="text-muted border-bottom py-2">
                      {post.author.username}
                    </h4>

                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="img-fluid post-image"
                      />
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="pagination mb-3">
            <button
              className="btn btn-primary"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="mx-3">
              {currentPage} / {totalPages}
            </span>
            <button
              className="btn btn-primary"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyPosts;
