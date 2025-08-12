import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import Home from "./components/pages/Home/Home";
import Auth from "./components/pages/Auth/Auth";
import Recipes from "./components/pages/Recipes/Recipes";
import RecipePage from "./components/pages/RecipePage/RecipePage";
import { LoginProvider } from "./contexts/LoginContext";
import { ToastContainer } from "react-toastify";
import "./styles/App.scss";

function App() {
  return (
    <div className="App">
      <LoginProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="auth/login" element={<Auth isLogin />} />
              <Route path="auth/register" element={<Auth />} />
              <Route path="recipes" element={<Recipes />} />
              <Route path="recipes/:id" element={<RecipePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LoginProvider>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
