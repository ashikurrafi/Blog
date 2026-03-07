import { useState } from "react";
import { useSelector } from "react-redux";
import Blog from "./pages/Blog.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

const App = () => {
  const user = useSelector((state) => state.auth.user);
  const [page, setPage] = useState("login"); // 'login', 'register', 'blog'

  const renderPage = () => {
    if (!user) {
      if (page === "login") return <Login />;
      if (page === "register") return <Register />;
    } else {
      return <Blog />;
    }
  };

  return (
    <>
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
                <span>Welcome, {user.name}</span>
                <button onClick={() => window.location.reload()}>Logout</button>
              </>
            )}
          </nav>
        </header>

        <main>{renderPage()}</main>
      </div>
    </>
  );
};

export default App;
