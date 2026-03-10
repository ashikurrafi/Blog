import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// Layouts
import DashboardLayout from "@/components/layout/DashboardLayout";
import PublicLayout from "@/components/layout/PublicLayout";

// Public Pages
import HomePage from "@/pages/public/HomePage";
import SinglePostPage from "@/pages/public/SinglePostPage";

// Auth Pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

// Dashboard Pages
import CreatePostPage from "@/pages/dashboard/CreatePostPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import EditPostPage from "@/pages/dashboard/EditPostPage";
import MyPostsPage from "@/pages/dashboard/MyPostsPage";
import ProfilePage from "@/pages/dashboard/ProfilePage";

// Admin Pages
import AdminCategoriesPage from "@/pages/admin/AdminCategoriesPage";
import AdminPostsPage from "@/pages/admin/AdminPostsPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";

import { setTheme } from "@/redux/uiSlice";

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Guest Route Component (redirect to dashboard if already logged in)
const GuestRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);

  // Apply theme on mount and theme change
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Check system preference on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (!savedTheme) {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      dispatch(setTheme(prefersDark ? "dark" : "light"));
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:slug" element={<SinglePostPage />} />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            }
          />
        </Route>

        {/* Dashboard Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/my-posts" element={<MyPostsPage />} />
          <Route path="/dashboard/create-post" element={<CreatePostPage />} />
          <Route path="/dashboard/edit-post/:id" element={<EditPostPage />} />
          <Route path="/dashboard/profile" element={<ProfilePage />} />

          {/* Admin Routes */}
          <Route
            path="/dashboard/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/categories"
            element={
              <ProtectedRoute adminOnly>
                <AdminCategoriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/posts"
            element={
              <ProtectedRoute adminOnly>
                <AdminPostsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
