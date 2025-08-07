import { Link } from "react-router-dom";
import "./Recipe.scss";
function Recipe({ recipe }) {
  return (
    <article className="recipe recipes__recipe">
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
