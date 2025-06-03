import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

const Blog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  console.log(blog);
  const imgPath = import.meta.env.VITE_SERVER_URL;

  const singleBlog = async () => {
    try {
      const response = await axios.get(`/api/v1/demo/blog/getBlogById/${id}`, {
        withCredentials: true,
      });

      const data = response.data?.data?.Blog;
      setBlog(data);
    } catch (error) {
      toast.error("Can't fetch data");
      console.error("Blog fetching error:", error);
    }
  };

  useEffect(() => {
    singleBlog();
  }, []);

  if (!blog) return <p className="text-center py-10">Loading blog...</p>;

  return (
    <>
      <div className="flex py-20 w-full items-center justify-center p-6 md:p-10">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <blockquote>
              <h1 className="text-center text-4xl font-semibold lg:text-5xl pb-5">
                {blog.title}
              </h1>
              <img src={`${imgPath}/images/${blog.image}`} alt={blog.title} />
              {/* <p className="pt-5 text-lg font-medium sm:text-xl md:text-3xl text-justify"> */}
              <p className="pt-5 text-lg text-justify">{blog.content}</p>

              <div className="mt-12 flex  gap-6">
                <Avatar className="size-12">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="Ashikur Rafi"
                    height="400"
                    width="400"
                    loading="lazy"
                  />
                  <AvatarFallback>AR</AvatarFallback>
                </Avatar>

                <div className="space-y-1 border-l pl-6">
                  <cite className="font-medium">Ashikur Rafi</cite>
                  <span className="text-muted-foreground block text-sm">
                    {/* CEO, Nvidia */}Blog Creation time :{" "}
                    {new Date().toLocaleDateString("en-GB")}
                  </span>
                </div>
              </div>
            </blockquote>
          </div>
          <div className="pt-5">
            <div className="*:not-first:mt-2">
              <Label>Comment</Label>
              <Textarea placeholder="Leave a comment" />
              <div className="flex justify-end">
                <Button variant="outline">Send</Button>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Comments</h2>
            {blog.comments?.length > 0 ? (
              <ul className="space-y-4">
                {blog.comments.map((comment) => (
                  <li
                    key={comment._id}
                    className="p-4 border rounded-md shadow-sm"
                  >
                    <p className="text-gray-800">{comment.comments}</p>
                    <div className="text-sm text-gray-500 mt-2">
                      By {comment.userId?.name || "Anonymous"} on{" "}
                      {new Date(comment.createdAt).toLocaleDateString("en-GB")}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
