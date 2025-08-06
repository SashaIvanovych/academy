import { createContext, useContext, useState } from "react";

const LoginContext = createContext();

export const useLoginContext = () => useContext(LoginContext);

export function LoginProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("user_id")
  );

  const logout = () => {
    setIsLoggedIn(false);
  };

  const login = () => {
    setIsLoggedIn(true);
  };

  return (
    <LoginContext.Provider value={{ isLoggedIn, logout, login }}>
      {children}
    </LoginContext.Provider>
  );
}
