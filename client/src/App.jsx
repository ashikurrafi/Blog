import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

import Footer from "./components/Footer";
import Header from "./components/Header";
import About from "./pages/About";
import AllBlogs from "./pages/AllBlogs";
import Blog from "./pages/Blog";
import Comments from "./pages/Comments";
import Contact from "./pages/Contact";
import CreateBlog from "./pages/CreateBlog";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import UpdateBlog from "./pages/UpdateBlog";
import YourBlog from "./pages/YourBlog";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header />
        <Home />
        <Footer />
      </>
    ),
  },
  {
    path: "/blogs",
    element: (
      <>
        <Header />
        <AllBlogs />
        <Footer />
      </>
    ),
  },
  {
    path: "/contact",
    element: (
      <>
        <Header />
        <Contact />
        <Footer />
      </>
    ),
  },
  {
    path: "/about",
    element: (
      <>
        <Header />
        <About />
        <Footer />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Header />
        <Login />
        <Footer />
      </>
    ),
  },
  {
    path: "/register",
    element: (
      <>
        <Header />
        <Register />
        <Footer />
      </>
    ),
  },
  {
    path: "blog/:id",
    element: (
      <>
        <Header />
        <Blog />
        <Footer />
      </>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <>
        <Header />
        <Dashboard />
        <Footer />
      </>
    ),
    children: [
      {
        path: "profile/:id",
        element: <Profile />,
      },
      {
        path: "your-blog",
        element: <YourBlog />,
      },
      {
        path: "comments",
        element: <Comments />,
      },
      {
        path: "write-blog",
        element: <CreateBlog />,
      },
      {
        path: "update-blog/:blogId",
        element: <UpdateBlog />,
      },
    ],
  },
  {
    path: "*",
    element: (
      <>
        <Header />
        <PageNotFound />
        <Footer />
      </>
    ),
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
