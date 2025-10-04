import { useEffect, useState } from "react";
import apiclient from "../api/api.js";

const Homepage = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    try {
      const response = await apiclient.get("/blog/getAllBlogs");
      setBlogs(response.data.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Failed to load blogs. Please try again later.");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {blogs.length > 0 ? (
        <ul>
          {blogs.map((blog, index) => {
            const { title, description, imageUrl } = blog; // Destructure for better readability
            return (
              <li key={index}>
                <h2>{title}</h2>
                <p>{description}</p>
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={title}
                    style={{ maxWidth: "200px" }}
                  />
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No blogs found.</p>
      )}
    </div>
  );
};

export default Homepage;
