import apiClient from "@/api/apiClient";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setToken, setUser } from "@/redux/authSlice";
import { Loader2, Lock, Trash2, User } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
    setProfileError("");
    setProfileSuccess("");
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError("");
    setProfileSuccess("");

    try {
      const response = await apiClient.patch("/user/updateUser", {
        name: profileData.name.trim(),
      });
      dispatch(setUser(response.data.data));
      setProfileSuccess("Profile updated successfully");
    } catch (err) {
      setProfileError(
        err.response?.data?.message || "Failed to update profile",
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      setPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      setPasswordLoading(false);
      return;
    }

    try {
      await apiClient.patch("/user/updatePassword", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordSuccess("Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Failed to update password",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await apiClient.delete(`/user/deleteUser/${user._id}`);
      dispatch(setUser(null));
      dispatch(setToken(null));
      navigate("/");
    } catch (err) {
      console.error("Failed to delete account:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your account profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            {profileError && (
              <Alert variant="destructive">
                <AlertDescription>{profileError}</AlertDescription>
              </Alert>
            )}
            {profileSuccess && (
              <Alert>
                <AlertDescription>{profileSuccess}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.photoUrl} />
                <AvatarFallback className="text-2xl">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.role}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                disabled={profileLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profileData.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="text">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={profileData.phone}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Phone cannot be changed
              </p>
            </div>

            <Button type="submit" disabled={profileLoading}>
              {profileLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            {passwordError && (
              <Alert variant="destructive">
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}
            {passwordSuccess && (
              <Alert>
                <AlertDescription>{passwordSuccess}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                disabled={passwordLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                disabled={passwordLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                disabled={passwordLoading}
              />
            </div>

            <Button type="submit" disabled={passwordLoading}>
              {passwordLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all of your content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={deleteLoading}>
                {deleteLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Account</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account, all your posts, and comments.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
