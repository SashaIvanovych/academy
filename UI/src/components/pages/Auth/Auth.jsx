import { useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import eye from "../../../assets/icons/eye.svg";
import eyeSlash from "../../../assets/icons/eyeSlash.svg";
import { AuthService } from "../../../services/auth";
import { useLoginContext } from "../../../contexts/LoginContext";
import "./Auth.scss";

function Auth() {
  const { login } = useLoginContext();
  const { pathname } = useLocation();
  const isLogin = pathname === "/auth/login";
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({ email: false, password: false, confirmPassword: false });

    let hasError = false;
    const newFieldErrors = {
      email: false,
      password: false,
      confirmPassword: false,
    };

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      newFieldErrors.email = true;
      hasError = true;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      newFieldErrors.password = true;
      hasError = true;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      newFieldErrors.confirmPassword = true;
      hasError = true;
    }

    if (hasError) {
      setFieldErrors(newFieldErrors);
      return;
    }

    if (isLogin) {
      AuthService.login(email, password);
      navigate("/recipes");
      login();
    } else {
      AuthService.register(email, password);
      navigate("/auth/login");
    }

    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="page__auth auth">
      <div className="auth__container">
        <div className="auth__info">
          <h1 className="auth__title">
            {isLogin ? "Log in to your account" : "Create an account"}
          </h1>
          <p className="auth__text">
            {isLogin
              ? "Welcome back! Please enter your credentials."
              : "Join us and start cooking!"}
          </p>
        </div>

        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="auth__group">
            <label className="auth__label" htmlFor="email">
              Email
            </label>
            <input
              className={"auth__input" + (fieldErrors.email ? " error" : "")}
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              required
              autoComplete="username"
            />
          </div>

          <div className="auth__group">
            <label className="auth__label" htmlFor="password">
              Password
            </label>
            <input
              className={"auth__input" + (fieldErrors.password ? " error" : "")}
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="●●●●●●●●"
              required
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
            {password && (
              <button
                type="button"
                className="auth__toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img
                  src={showPassword ? eye : eyeSlash}
                  alt={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                />
              </button>
            )}
          </div>

          {!isLogin && (
            <div className="auth__group">
              <label className="auth__label" htmlFor="confirm-password">
                Confirm Password
              </label>
              <input
                className={
                  "auth__input" + (fieldErrors.confirmPassword ? " error" : "")
                }
                type={showPassword ? "text" : "password"}
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="●●●●●●●●"
                required
                autoComplete="new-password"
              />
              {password && (
                <button
                  type="button"
                  className="auth__toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img
                    src={showPassword ? eye : eyeSlash}
                    alt={showPassword ? "Hide password" : "Show password"}
                    title={showPassword ? "Hide password" : "Show password"}
                  />
                </button>
              )}
            </div>
          )}

          {error && <p className="auth__error">{error}</p>}

          <button type="submit" className="auth__button">
            {isLogin ? "Log In" : "Register"}
          </button>
        </form>

        <p className="auth__switch">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link to={isLogin ? "/auth/register" : "/auth/login"}>
            {isLogin ? "Register" : "Log In"}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Auth;
