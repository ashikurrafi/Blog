import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute

import About from "./pages/About";
import Blogs from "./pages/Blogs";
import BlogView from "./pages/BlogView";
import Comments from "./pages/Comments";
import CreateBlog from "./pages/CreateBlog";
import Dashboard from "./pages/Dashboard";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import NotFoundPage from "./pages/NotFoundPage";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import SearchList from "./pages/SearchList";
import UpdateBlog from "./pages/UpdateBlog";
import YourBlog from "./pages/YourBlog";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Homepage />
        <Footer />
      </>
    ),
  },
  {
    path: "/blogs",
    element: (
      <>
        <Navbar />
        <Blogs />
        <Footer />
      </>
    ),
  },
  {
    path: "/about",
    element: (
      <>
        <Navbar />
        <About />
        <Footer />
      </>
    ),
  },
  {
    path: "/search",
    element: (
      <>
        <Navbar />
        <SearchList />
        <Footer />
      </>
    ),
  },
  {
    path: "/blog/:id",
    element: (
      <>
        <Navbar />
        <BlogView />
        <Footer />
      </>
    ),
  },

  {
    path: "/dashboard",
    element: (
      <>
        <Navbar />
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
        <Footer />
      </>
    ),
    children: [
      {
        path: "create-blog",
        element: <CreateBlog />,
      },
      {
        path: "update-blog/:id",
        element: <UpdateBlog />,
      },
      {
        path: "your-blogs",
        element: <YourBlog />,
      },
      {
        path: "comments",
        element: <Comments />,
      },
      {
        path: "profile/:id",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <>
        <Navbar />
        <Login />
        <Footer />
      </>
    ),
  },
  {
    path: "/register",
    element: (
      <>
        <Navbar />
        <Register />
        <Footer />
      </>
    ),
  },
  {
    path: "*",
    element: (
      <>
        <Navbar />
        <NotFoundPage />
        <Footer />
      </>
    ),
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
