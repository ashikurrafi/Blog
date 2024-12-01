import { Route, Routes } from "react-router-dom";
import NavbarComponent from "./components/NavbarComponent";
import UserAuthFormPage from "./pages/UserAuthFormPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<NavbarComponent />}>
          <Route path="/signin" element={<UserAuthFormPage type="sign-in" />} />
          <Route path="/signup" element={<UserAuthFormPage type="sign-up" />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
