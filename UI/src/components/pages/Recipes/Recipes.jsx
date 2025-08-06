import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../../services/auth";
import { useLoginContext } from "../../../contexts/LoginContext";

function Recipes() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn } = useLoginContext();

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await AuthService.getProfile();
      setProfile(data);
    } catch (err) {
      setError(err.message);
      if (err.message.includes("Session expired")) {
        navigate("/auth/login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchProfile();
    } else {
      navigate("/auth/login");
    }
  }, [isLoggedIn, navigate, fetchProfile]);

  return (
    <section className="recipes">
      <div className="recipes__container">
        {isLoading && <p>Loading...</p>}
        {error && <p className="recipes__error">{error}</p>}
        {profile && (
          <div className="recipes__profile">
            <h2>Welcome, {profile.email}</h2>
            <p>User ID: {profile.id}</p>
            <button onClick={fetchProfile} disabled={isLoading}>
              Refresh Profile
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Recipes;
