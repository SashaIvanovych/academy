import { useRef } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import "./Recipe.scss";
import { useInView } from "../../hooks/useInView";
function Recipe({ recipe }) {
  const navigate = useNavigate();
  const ref = useRef(null);
  useInView(ref, { threshold: 0.1, rootMargin: "0px 0px 0px 0px" });
  const handleClick = () => {
    navigate(`/recipes/${recipe.id}`);
  };
  return (
    <article
      onClick={() => handleClick()}
      className="recipe recipes__recipe"
      ref={ref}
    >
      <div className="recipe__image">
        <img src={recipe.image} alt="Recipe image" />
      </div>
      <h2 className="recipe__name">{recipe.title}</h2>
      <Link to={`/recipes/${recipe.id}`} className="recipe__button">
        Read more...
      </Link>
    </article>
  );
}

export default Recipe;
