import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import AppLayout from "./components/layout/AppLayout";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Blogs from "./pages/Blogs";
import Comments from "./pages/Comments";
import Contact from "./pages/Contact";
import CreateBlogs from "./pages/CreateBlogs";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import OTPverification from "./pages/OTPverification";
import Profile from "./pages/Profile";
import Registration from "./pages/Registration";
import YourBlog from "./pages/YourBlog";

const route = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/about",
        element: (
          <>
            <Navbar />
            <About />
          </>
        ),
      },
      {
        path: "/blogs",
        element: (
          <>
            <Navbar />
            <Blogs />
          </>
        ),
      },
      {
        path: "/contact",
        element: (
          <>
            <Navbar />
            <Contact />
          </>
        ),
      },
      {
        path: "/",
        element: (
          <>
            <Navbar />
            <Home />
          </>
        ),
      },
      {
        path: "/login",
        element: (
          <>
            <Navbar />
            <Login />
          </>
        ),
      },
      {
        path: "/signup",
        element: (
          <>
            <Navbar />
            <Registration />
          </>
        ),
      },
      {
        path: "/verifyOTP",
        element: (
          <>
            <Navbar />
            <OTPverification />
          </>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <>
            <Navbar />
            <Dashboard />
          </>
        ),
        children: [
          {
            path: "profile",
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
            element: <CreateBlogs/>,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={route} />
    </>
  );
}

export default App;
