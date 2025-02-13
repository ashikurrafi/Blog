import "./App.css";

import { Route, Routes } from "react-router-dom";

import ArticleDetailPage from "./pages/articleDetail/ArticleDetailPage";
import HomePage from "./pages/home/HomePage";
import RegisterPage from "./pages/register/RegisterPage";

function App() {
  return (
    <>
      <div className="App font-display">
        <Routes>
          <Route index path="/" element={<HomePage />} />
          <Route path="/blog/:slug" element={<ArticleDetailPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
