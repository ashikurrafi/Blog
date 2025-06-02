import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  console.log(blogs);
  const getBlog = async () => {
    try {
      const response = await axios.get(`/api/v1/demo/blog/getAllBlogs`, {
        withCredentials: true,
      });

      const blogs = response?.data?.data?.Allblogs;
      setBlogs(blogs || []);
    } catch (error) {
      toast.error("Can't fetch data");
      console.error("Blog fetching error:", error);
    }
  };

  useEffect(() => {
    getBlog();
  }, []);

  return (
    <>
      {blogs &&
        blogs.map((blog, index) => (
          <Card className="w-90 m-2" key={index}>
            <img
              className="mx-auto object-top rounded-2xl w-80 object-cover transform hover:scale-110 transition duration-900"
              src="painting-mountain-lake-with-mountain-background.jpg"
              alt={blog.title}
            />

            <CardHeader>
              <CardTitle>{blog.title}</CardTitle>
              <CardDescription>{blog.content}</CardDescription>
              <Button asChild>
                <Link to={`/blogs/${blog._id}`}>Read more</Link>
              </Button>
            </CardHeader>
          </Card>
        ))}
    </>
  );
};

export default AllBlogs;
