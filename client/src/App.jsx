import "./App.css";

import { Route, Routes } from "react-router-dom";

import ArticleDetailPage from "./pages/articleDetail/ArticleDetailPage";
import HomePage from "./pages/home/HomePage";

function App() {
  return (
    <>
      <div className="App font-display">
        <Routes>
          <Route index path="/" element={<HomePage />} />
          <Route path="/blog/:id" element={<ArticleDetailPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
