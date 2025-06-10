import axios from "axios";
import {
  AlertTriangle,
  Calendar,
  Camera,
  Edit,
  Mail,
  MapPin,
  Phone,
  Save,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
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
import { Textarea } from "../components/ui/textarea";
import { removeUser } from "../redux/authSlice";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [formData, setFormData] = useState({
    name: user?.user?.name || "",
    email: user?.user?.email || "",
    phone: user?.user?.phone || "",
    bio: user?.user?.bio || "",
    address: user?.user?.address || "",
    website: user?.user?.website || "",
    imageUser: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageUser: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.patch(
        "/api/v1/demo/user/update",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        setImagePreview(null);
        // You might want to update Redux state here
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      console.error("Profile update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmationText !== "DELETE") {
      toast.error('Please type "DELETE" to confirm account deletion');
      return;
    }

    setDeleteLoading(true);

    try {
      const response = await axios.delete(
        `/api/v1/demo/user/delete/${user?.user?._id}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Account deleted successfully");
        dispatch(removeUser());
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
      console.error("Account deletion error:", error);
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setConfirmationText("");
    }
  };

  const resetForm = () => {
    setFormData({
      name: user?.user?.name || "",
      email: user?.user?.email || "",
      phone: user?.user?.phone || "",
      bio: user?.user?.bio || "",
      address: user?.user?.address || "",
      website: user?.user?.website || "",
      imageUser: null,
    });
    setImagePreview(null);
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Main Profile Card */}
        <Card className="overflow-hidden shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <div className="relative h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          <CardContent className="relative px-6 pb-6">
            {/* Profile Image Section */}
            <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6 -mt-16">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                  <AvatarImage
                    src={
                      imagePreview ||
                      user?.user?.image ||
                      "https://github.com/shadcn.png"
                    }
                    alt={user?.user?.name || "User"}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {user?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                {isEditing && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="flex-1 text-center md:text-left space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {user?.user?.name || "User Name"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-md">
                  {user?.user?.bio ||
                    "No bio available. Add a bio to tell others about yourself."}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {formatDate(user?.user?.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {!isEditing ? (
                  <>
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </Button>

                    {/* Delete Account Dialog */}
                    <Dialog
                      open={deleteDialogOpen}
                      onOpenChange={setDeleteDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="gap-2">
                          <Trash2 className="w-4 h-4" />
                          Delete Account
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                            Delete Account
                          </DialogTitle>
                          <DialogDescription className="text-left space-y-3">
                            <p>
                              This action cannot be undone. This will
                              permanently delete your account and remove all
                              your data from our servers.
                            </p>
                            <p>
                              All your blog posts, comments, and personal
                              information will be permanently deleted.
                            </p>
                            <p className="font-semibold text-red-600">
                              Type "DELETE" below to confirm:
                            </p>
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <Input
                            value={confirmationText}
                            onChange={(e) =>
                              setConfirmationText(e.target.value)
                            }
                            placeholder="Type DELETE to confirm"
                            className="text-center font-mono"
                          />
                        </div>
                        <DialogFooter className="gap-2">
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={
                              confirmationText !== "DELETE" || deleteLoading
                            }
                            className="gap-2"
                          >
                            {deleteLoading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4" />
                                Delete Account
                              </>
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={resetForm}
                      variant="outline"
                      className="gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {loading ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Your basic account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Full Name
                      </p>
                      <p className="font-medium">
                        {user?.user?.name || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Email
                      </p>
                      <p className="font-medium">
                        {user?.user?.email || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Phone
                      </p>
                      <p className="font-medium">
                        {user?.user?.phone || "Not specified"}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Additional Information
              </CardTitle>
              <CardDescription>Optional details about yourself</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://your-website.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Address
                      </p>
                      <p className="font-medium">
                        {user?.user?.address || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Website
                      </p>
                      <p className="font-medium">
                        {user?.user?.website ? (
                          <a
                            href={user.user.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {user.user.website}
                          </a>
                        ) : (
                          "Not specified"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Bio
                    </p>
                    <p className="font-medium leading-relaxed">
                      {user?.user?.bio ||
                        "No bio available. Add a bio to tell others about yourself."}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Account Statistics */}
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
            <CardDescription>Your activity overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  0
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Blog Posts
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  0
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Comments
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  0
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Likes
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  0
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Views
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
