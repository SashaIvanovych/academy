import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import Home from "./components/pages/Home/Home";
import Auth from "./components/pages/Auth/Auth";
import Recipes from "./components/pages/Recipes/Recipes";
import { LoginProvider } from "./contexts/LoginContext";
import "./styles/App.scss";

function App() {
  return (
    <div className="App">
      <LoginProvider>
        <BrowserRouter>
          <Routes>
            {
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="auth/*" element={<Auth />} />
                <Route path="recipes" element={<Recipes />} />
              </Route>
            }
          </Routes>
        </BrowserRouter>
      </LoginProvider>
    </div>
  );
}
export default App;
