import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

// import AdminLayout from "./layout/AdminLayout";
// import Layout from "./layout/Layout";
// import UserLayout from "./layout/UserLayout";
import About from "./pages/About";
// import AddBlog from "./pages/AddBlog";
// import AdminDashboard from "./pages/AdminDashboard";
import AllBlogs from "./pages/AllBlogs";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Login from "./pages/Login";
// import ManageUser from "./pages/ManageUser";
// import OTP from "./pages/OTP";
import PageNotFound from "./pages/PageNotFound";
// import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Register from "./pages/Register";

// const router = createBrowserRouter([
//   {
//     path: "/user",
//     element: <UserLayout />,
//     children: [
//       {
//         index: true, // /user
//         element: <Profile />,
//       },
//       {
//         path: "createblog", // /user/createblog
//         element: <AddBlog />,
//       },
//     ],
//   },
//   {
//     path: "/",
//     element: <Layout />,
//     children: [
//       {
//         index: true, // /
//         element: <Home />,
//       },
//       {
//         path: "allblogs", // /allblogs
//         element: <AllBlogs />,
//       },
//       {
//         path: "login", // /login
//         element: <Login />,
//       },
//       {
//         path: "register", // /register
//         element: <Register />,
//       },
//       {
//         path: "contact", // /contact
//         element: <Contact />,
//       },
//       {
//         path: "about", // /contact
//         element: <About />,
//       },
//       {
//         path: "*",
//         element: <PageNotFound />,
//       },
//       {
//         path: "verifyOTP",
//         element: <OTP />,
//       },
//       {
//         path: "blog/:id",
//         element: <Blog />,
//       },
//     ],
//   },
//   {
//     path: "/admin",
//     element: <AdminLayout />,
//     children: [
//       {
//         index: true, // /admin
//         element: <Profile />,
//       },
//       {
//         path: "dashboard", // /admin/dashboard
//         element: <AdminDashboard />,
//       },
//       {
//         path: "manageuser", // /admin/manageuser
//         element: <ManageUser />,
//       },
//       {
//         path: "createblog", // /admin/createblog
//         element: <AddBlog />,
//       },
//     ],
//   },
// ]);

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
