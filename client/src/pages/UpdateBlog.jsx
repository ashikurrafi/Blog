import axios from "axios";
import { FileText, Type } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const UpdateBlog = () => {
  const params = useParams();
  const navigate = useNavigate();

  console.log("Blog id ", params.blogId);

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(
        `/api/v1/demo/blog/getBlogById/${params.blogId}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const blog = res.data.data.Blog;
        setFormData({
          title: blog.title,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load blog");
    }
  };

  const [formData, setFormData] = useState({
    title: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title } = formData;

    setLoading(true);

    try {
      const updateData = new FormData();

      updateData.append("title", title);

      const res = await axios.patch(
        `/api/v1/demo/blog/updateBlog/${params.blogId}`,
        updateData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Blog updated successfully");
        navigate(`/blog/${params.blogId}`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Update Blog
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Update your thoughts and ideas with the world
            </p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" /> Blog Details
              </CardTitle>
              <CardDescription>
                Fill in the details below to update your blog post
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center gap-2">
                    <Type className="w-4 h-4" /> Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Blog"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default UpdateBlog;
