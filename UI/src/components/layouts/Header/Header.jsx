import { Link, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { AuthService } from "../../../services/auth";
import { useLoginContext } from "../../../contexts/LoginContext";
import logoutIcon from "../../../assets/icons/logout.svg";
import "./Header.scss";

function Header() {
  const { isLoggedIn, logout } = useLoginContext();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      await AuthService.logout();
      logout();
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  }, [logout, navigate]);

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          Recipe Blog
        </Link>
        <div className="header__actions">
          {isLoggedIn ? (
            <button className="header__logout" onClick={handleLogout}>
              <img src={logoutIcon} alt="Logout" />
            </button>
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
