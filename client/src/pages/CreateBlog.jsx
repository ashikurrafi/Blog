import axios from "axios";
import {
  Calendar,
  Eye,
  EyeOff,
  FileText,
  Image as ImageIcon,
  Save,
  Tag,
  Type,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";

const CreateBlog = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    isPublished: false,
    imageBlog: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "/api/v1/demo/category/getAllCategories",
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const fetchedCategories = response.data.data.Categories;
        setCategories(fetchedCategories);
      }
    } catch (error) {
      toast.error("Failed to load categories");
      console.error("Category fetch error:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    e.target.value = null;

    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setFormData((prev) => ({ ...prev, imageBlog: file }));

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, imageBlog: null }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, content, category, isPublished, imageBlog } = formData;

    if (!title.trim()) return toast.error("Title is required");
    if (!content.trim()) return toast.error("Content is required");
    if (!category) return toast.error("Category is required");
    if (isPublished && !imageBlog)
      return toast.error("Image required for publishing");

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", title.trim());
      formDataToSend.append("content", content.trim());
      formDataToSend.append("category", category);
      formDataToSend.append("isPublished", isPublished);
      if (imageBlog) formDataToSend.append("imageBlog", imageBlog);

      const response = await axios.post(
        "/api/v1/demo/blog/createBlog",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Blog created successfully!");

        const blogId = response?.data?.data?.Blog?._id;
        if (blogId) {
          navigate(`/blog/${blogId}`);
        } else {
          toast.info("Blog created but redirection failed");
        }

        setFormData({
          title: "",
          content: "",
          category: "",
          isPublished: false,
          imageBlog: null,
        });
        setImagePreview(null);
        localStorage.removeItem("blogDraft");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create blog");
      console.error("Blog creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    const draftData = { ...formData, isPublished: false };
    localStorage.setItem("blogDraft", JSON.stringify(draftData));
    toast.success("Draft saved locally");
  };

  const loadDraft = () => {
    const savedDraft = localStorage.getItem("blogDraft");
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      setFormData(draft);
      toast.success("Draft loaded");
    } else {
      toast.info("No saved draft found");
    }
  };

  const formatPreviewContent = (content) =>
    content.split("\n").map((p, i) => (
      <p key={i} className="mb-4">
        {p}
      </p>
    ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Create New Blog
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Share your thoughts and ideas with the world
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" /> Blog Details
            </CardTitle>
            <CardDescription>
              Fill in the details below to create your blog post
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  <Type className="w-4 h-4" /> Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter your blog title..."
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Category
                </Label>

                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> Blog Image
                </Label>
                {!imagePreview ? (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                      <Label
                        htmlFor="imageBlog"
                        className="cursor-pointer text-blue-600 hover:underline"
                      >
                        Click to upload an image
                      </Label>
                      <p className="text-sm text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                      <Input
                        id="imageBlog"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Content
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={12}
                  placeholder="Write your blog content here..."
                  required
                />
                <p className="text-sm text-gray-500">
                  {formData.content.length} characters
                </p>
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isPublished: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-blue-600"
                />
                <Label
                  htmlFor="isPublished"
                  className="flex items-center gap-2"
                >
                  {formData.isPublished ? (
                    <Eye className="w-4 h-4 text-green-600" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                  Publish immediately
                </Label>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4">
                <Button type="submit" disabled={loading} className="gap-2">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {formData.isPublished ? "Publish Blog" : "Save as Draft"}
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Draft
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={loadDraft}
                  className="gap-2"
                >
                  Load Draft
                </Button>

                <Dialog
                  open={showPreviewDialog}
                  onOpenChange={setShowPreviewDialog}
                >
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" className="gap-2">
                      <Eye className="w-4 h-4" />
                      Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Blog Preview</DialogTitle>
                      <DialogDescription>
                        This is how your blog will appear to readers
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      )}
                      <div className="space-y-2">
                        <h1 className="text-2xl font-bold">
                          {formData.title || "Your Blog Title"}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />{" "}
                            {new Date().toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Tag className="w-4 h-4" />{" "}
                            {formData.category || "No category"}
                          </span>
                          <span className="flex items-center gap-1">
                            By {user?.user?.name || "Author"}
                          </span>
                        </div>
                      </div>
                      <div className="prose max-w-none">
                        {formData.content ? (
                          formatPreviewContent(formData.content)
                        ) : (
                          <p className="text-gray-500 italic">
                            Your blog content will appear here...
                          </p>
                        )}
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Close Preview</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Writing Tips */}
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Writing Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">📝 Content Tips:</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                  <li>• Write a compelling title that grabs attention</li>
                  <li>• Use clear and concise language</li>
                  <li>• Break content into readable paragraphs</li>
                  <li>• Include relevant examples and insights</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">🖼️ Image Tips:</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                  <li>• Use high-quality, relevant images</li>
                  <li>• Ensure images are properly sized</li>
                  <li>• Consider your audience when selecting images</li>
                  <li>• Images should complement your content</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateBlog;
