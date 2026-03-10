import apiClient from "@/api/apiClient";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ImagePlus, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: "",
    status: "published",
  });
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [originalCover, setOriginalCover] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPost();
    fetchCategories();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/blog/getBlog/${id}`);
      const post = response.data.data;
      setFormData({
        title: post.title || "",
        content: post.content || "",
        excerpt: post.excerpt || "",
        category: post.category?._id || "",
        tags: post.tags?.join(", ") || "",
        status: post.status || "published",
      });
      if (post.coverImage) {
        setCoverPreview(post.coverImage);
        setOriginalCover(post.coverImage);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get("/category");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const getSelectedCategoryName = () => {
    if (!formData.category) return null;
    const category = categories.find((c) => c._id === formData.category);
    return category?.name;
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setCoverImage(null);
    setCoverPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content are required");
      setSaving(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title.trim());
      submitData.append("content", formData.content.trim());
      submitData.append("excerpt", formData.excerpt.trim());
      submitData.append("category", formData.category || "");
      submitData.append("tags", formData.tags.trim());
      submitData.append("status", formData.status);

      if (coverImage) {
        submitData.append("file", coverImage);
      }

      const response = await apiClient.patch(
        `/blog/updateBlog/${id}`,
        submitData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      navigate(`/post/${response.data.data.slug}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Post</h1>
          <p className="text-muted-foreground">
            Make changes to your blog post
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter post title"
                    value={formData.title}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    placeholder="Brief description of the post"
                    value={formData.excerpt}
                    onChange={handleChange}
                    rows={2}
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Write your post content here..."
                    value={formData.content}
                    onChange={handleChange}
                    rows={15}
                    disabled={saving}
                  />
                  <p className="text-xs text-muted-foreground">
                    You can use HTML for formatting
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="status">Published</Label>
                  <Switch
                    id="status"
                    checked={formData.status === "published"}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        status: checked ? "published" : "draft",
                      })
                    }
                    disabled={saving}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Post
                </Button>
              </CardContent>
            </Card>

            {/* Cover Image */}
            <Card>
              <CardHeader>
                <CardTitle>Cover Image</CardTitle>
              </CardHeader>
              <CardContent>
                {coverPreview ? (
                  <div className="relative">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                      disabled={saving}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent transition-colors">
                    <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      disabled={saving}
                    />
                  </label>
                )}
              </CardContent>
            </Card>

            {/* Category & Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                    disabled={saving || categories.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          categories.length === 0
                            ? "No categories available"
                            : "Select category"
                        }
                      >
                        {getSelectedCategoryName()}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {categories.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      No categories yet. Admin can create them in the Categories
                      section.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    name="tags"
                    placeholder="tag1, tag2, tag3"
                    value={formData.tags}
                    onChange={handleChange}
                    disabled={saving}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate tags with commas
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditPostPage;
