import { createContext, useContext, useState, useCallback } from "react";

const LoginContext = createContext();

export const useLoginContext = () => useContext(LoginContext);

export function LoginProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access_token")
  );
  const [user, setUser] = useState({
    id: localStorage.getItem("user_id") || null,
  });

  const login = useCallback((userId) => {
    setIsLoggedIn(true);
    setUser({ id: userId });
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUser({ id: null });
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
  }, []);

  return (
    <LoginContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
}
