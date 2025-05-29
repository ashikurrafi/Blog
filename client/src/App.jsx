import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

import Blog from "./pages/Blog";
import Home from "./pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Home />
      </>
    ),
  },
  {
    path: "/blog/:id",
    element: (
      <>
        <Blog />
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
