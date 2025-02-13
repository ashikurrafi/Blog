import "./App.css";

import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";

import ArticleDetailPage from "./pages/articleDetail/ArticleDetailPage";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/login/LoginPage";
import ProfilePage from "./pages/profile/ProfilePage";
import RegisterPage from "./pages/register/RegisterPage";

function App() {
  return (
    <>
      <div className="App font-display">
        <Routes>
          <Route index path="/" element={<HomePage />} />
          <Route path="/blog/:slug" element={<ArticleDetailPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        <Toaster />
      </div>
    </>
  );
}

export default App;
