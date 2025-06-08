import { Card } from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const imgPath = import.meta.env.VITE_SERVER_URL;

  const navigate = useNavigate();

  const handleNavigate = (id) => {
    navigate(`/blog/${id}`);
  };

  const getAllBlog = async () => {
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
    getAllBlog();
  }, []);

  return (
    <section className="py-[60px] md:py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex justify-center items-center w-full px-4">
          <Input
            type="text"
            placeholder="Search here ..."
            className="w-full max-w-md mb-5 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button className="ml-2 mb-5">Search</Button>
        </div>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold">
            Explore Our Blog
          </h2>
          <p className="text-muted-foreground mt-4">
            Read insights and tutorials to boost your knowledge.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs &&
            blogs.map((blogs, index) => (
              <Card className="p-6" key={index}>
                <div className="relative">
                  <img
                    className="mx-auto rounded-md object-cover w-full h-40"
                    src={`${imgPath}/images/${blogs.image}`}
                    alt={blogs.title}
                  />

                  <div className="space-y-2 py-6">
                    <h3 className="text-base font-medium">{blogs.title}</h3>
                    <p className="text-muted-foreground line-clamp-3 text-sm">
                      {blogs.content}
                    </p>
                  </div>

                  <div className="flex gap-3 border-t border-dashed pt-6">
                    <Button onClick={() => handleNavigate(blogs._id)}>
                      Read More
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </section>
  );
};

export default AllBlogs;
