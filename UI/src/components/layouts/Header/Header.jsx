import { Link } from "react-router-dom";
import { useEffect } from "react";
import "./Header.scss";
import { AuthService } from "../../../services/auth";
import { useLoginContext } from "../../../contexts/LoginContext";

function Header() {
  const { isLoggedIn, logout } = useLoginContext();

  const handleLogout = () => {
    AuthService.logout(localStorage.getItem("user_id"));
    logout();
  };

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          Recipe Blog
        </Link>
        <div className="header__actions">
          {isLoggedIn ? (
            <Link to="/" className="header__logout" onClick={handleLogout}>
              Logout
            </Link>
          ) : (
            <>
              <Link to="/auth/login" className="header__login">
                Login
              </Link>
              <Link to="/auth/register" className="header__register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
