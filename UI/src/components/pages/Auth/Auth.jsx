import { useState, useCallback, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { AuthService } from "../../../services/auth";
import { useLoginContext } from "../../../contexts/LoginContext";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import eye from "../../../assets/icons/eye.svg";
import eyeSlash from "../../../assets/icons/eyeSlash.svg";
import "./Auth.scss";
import "react-toastify/dist/ReactToastify.css";
import { useInView } from "../../../hooks/useInView";

function Auth({ isLogin = false }) {
  const { login } = useLoginContext();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const ref = useRef(null);
  useInView(ref, { threshold: 0.1 });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {
      email: "",
      password: "",
      confirmPassword: "",
      general: "",
    };
    let isValid = true;

    if (!formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [formData, isLogin]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setErrors({ email: "", password: "", confirmPassword: "", general: "" });

      if (!validateForm()) {
        setIsLoading(false);
        return;
      }

      try {
        if (isLogin) {
          const { id } = await AuthService.login(
            formData.email,
            formData.password
          );
          login(id);
          navigate("/recipes");
        } else {
          await AuthService.register(formData.email, formData.password);
          toast.success("Registered successfully! Please log in.");
          navigate("/auth/login");
        }
        setFormData({ email: "", password: "", confirmPassword: "" });
      } catch (error) {
        setErrors((prev) => ({ ...prev, general: error.message }));
        toast.error(error.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
    [formData, isLogin, login, navigate, validateForm]
  );

  return (
    <section className="page__auth auth" ref={ref}>
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
              className={`auth__input${errors.email ? " error" : ""}`}
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              required
              autoComplete="username"
            />
            {errors.email && (
              <p className="auth__field-error">{errors.email}</p>
            )}
          </div>

          <div className="auth__group">
            <label className="auth__label" htmlFor="password">
              Password
            </label>
            <input
              className={`auth__input${errors.password ? " error" : ""}`}
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="●●●●●●"
              required
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
            {formData.password && (
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
            {errors.password && (
              <p className="auth__field-error">{errors.password}</p>
            )}
          </div>

          {!isLogin && (
            <div className="auth__group">
              <label className="auth__label" htmlFor="confirm-password">
                Confirm Password
              </label>
              <input
                className={`auth__input${
                  errors.confirmPassword ? " error" : ""
                }`}
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirm-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="●●●●●●"
                required
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="auth__field-error">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {errors.general && <p className="auth__error">{errors.general}</p>}

          <button type="submit" className="auth__button" disabled={isLoading}>
            {isLoading ? (
              <ClipLoader color="#fff" size={20} />
            ) : isLogin ? (
              "Log In"
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="auth__switch">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link to={isLogin ? "/auth/register" : "/auth/login"}>
            {isLogin ? "Register" : "Log In"}
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Auth;
