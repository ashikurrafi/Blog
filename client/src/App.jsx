import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import apiClient from "./api/apiClient";
import Blog from "./pages/Blog.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { setToken, setUser } from "./redux/authSlice";
import { setBlog, setYourBlog } from "./redux/blogSlice";
import { setComments } from "./redux/commentSlice";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [page, setPage] = useState("login");

  const clearReduxState = () => {
    dispatch(setUser(null));
    dispatch(setToken(null));
    dispatch(setBlog(null));
    dispatch(setYourBlog(null));
    dispatch(setComments([]));
    setPage("login");
  };

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // ignore network errors on logout
    }
    clearReduxState();
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "⚠️ This will permanently delete your account, all your blogs, comments, and images. Continue?",
      )
    )
      return;

    try {
      await apiClient.delete(`/user/deleteUser/${user._id}`);
      alert("Account deleted successfully.");
    } catch (err) {
      alert(err.message);
    }
    clearReduxState();
  };

  const renderPage = () => {
    if (!user) {
      if (page === "register") return <Register />;
      return <Login />;
    }
    return <Blog />;
  };

  return (
    <div>
      <header>
        <h1>My Blog App</h1>
        <nav>
          {!user && (
            <>
              <button onClick={() => setPage("login")}>Login</button>
              <button onClick={() => setPage("register")}>Register</button>
            </>
          )}
          {user && (
            <>
              <span>
                Welcome, {user.name} ({user.role})
              </span>
              <button onClick={handleLogout}>Logout</button>
              <button
                onClick={handleDeleteAccount}
                style={{ color: "red", marginLeft: 8 }}
              >
                Delete Account
              </button>
            </>
          )}
        </nav>
      </header>
      <main>{renderPage()}</main>
    </div>
  );
};

export default App;
