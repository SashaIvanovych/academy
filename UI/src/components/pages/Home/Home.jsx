import { Link } from "react-router-dom";
import heroImage from "../../../assets/image/hero.webp";
import "./Home.scss";
function Home() {
  return (
    <div className="hero">
      <div className="hero__container">
        <div className="hero__info">
          <h1 className="hero__title">Your Personal Recipe Hub</h1>
          <p className="hero__text">
            ✨Explore, add, and edit your favorite recipes — all in one
            beautifully organized space for everyday cooking inspiration.
          </p>
          <Link to="/recipes" className="hero__button">
            Go to recipes
          </Link>
        </div>
        <div className="hero__image">
          <img src={heroImage} alt="Hero image" />
        </div>
      </div>
    </div>
  );
}

export default Home;
