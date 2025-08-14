import { useRef } from "react";
import { Link } from "react-router-dom";
import heroImage from "../../../assets/image/hero.webp";
import { useInView } from "../../../hooks/useInView";

import "./Home.scss";
function Home() {
  const ref = useRef(null);
  const ref2 = useRef(null);
  useInView(ref, { threshold: 0.1 });
  useInView(ref2, { threshold: 0.1 });

  return (
    <div className="hero">
      <div className="hero__container">
        <div className="hero__info " ref={ref}>
          <h1 className="hero__title">Your Personal Recipe Hub</h1>
          <p className="hero__text">
            ✨Explore, add, and edit your favorite recipes — all in one
            beautifully organized space for everyday cooking inspiration.
          </p>
          <Link to="/recipes" className="hero__button">
            Go to recipes
          </Link>
        </div>
        <div className="hero__image" ref={ref2}>
          <img src={heroImage} alt="Hero image" />
        </div>
      </div>
    </div>
  );
}

export default Home;
