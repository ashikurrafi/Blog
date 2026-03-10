import apiClient from "@/api/apiClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit,
  FolderOpen,
  Loader2,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminCategoriesPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  // Extra safeguard - redirect if not admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/category");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
    setError("");
    setDialogOpen(true);
  };

  const openEditDialog = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setError("");
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!formData.name.trim()) {
      setError("Category name is required");
      setSaving(false);
      return;
    }

    try {
      if (editingCategory) {
        const response = await apiClient.put(
          `/category/${editingCategory._id}`,
          formData,
        );
        setCategories(
          categories.map((c) =>
            c._id === editingCategory._id ? response.data.data : c,
          ),
        );
      } else {
        const response = await apiClient.post("/category", formData);
        setCategories([...categories, response.data.data]);
      }
      setDialogOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/category/${categoryToDelete._id}`);
      setCategories(categories.filter((c) => c._id !== categoryToDelete._id));
    } catch (error) {
      console.error("Failed to delete category:", error);
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage blog categories</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          New Category
        </Button>
      </div>

      {/* Categories Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center">
              <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No categories</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first category
              </p>
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Create Category
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Slug</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Description
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Created
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {category.slug}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="line-clamp-1 max-w-50">
                        {category.description || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {formatDate(category.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openEditDialog(category)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setCategoryToDelete(category);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Create Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update the category details"
                : "Add a new category for your blog posts"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Category name"
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description (optional)"
                  rows={3}
                  disabled={saving}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingCategory ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{categoryToDelete?.name}"? Posts
              in this category will no longer be categorized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCategoriesPage;
