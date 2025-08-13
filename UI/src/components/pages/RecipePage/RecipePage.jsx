import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RecipeService } from "../../../services/recipes";
import MarkdownIt from "markdown-it";
import ClipLoader from "react-spinners/ClipLoader";
import "./RecipePage.scss";
import IconEdit from "../../../assets/icons/edit.svg";
import RecipeModal from "../../RecipeModal/RecipeModal";

const mdParser = new MarkdownIt();

function RecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = () => setIsModalOpen(true);

  const fetchRecipe = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await RecipeService.getRecipeById(id);
      setRecipe(data);
    } catch (err) {
      setError(err.message);
      if (err.message.includes("Session expired")) {
        navigate("/auth/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRecipe();
    } else {
      setError("Recipe ID is missing");
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="recipes__overlay">
        <div className="recipes__spinner">
          <ClipLoader color="#fff" size={60} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <section className="recipe-page">
        <div className="recipe-page__container">
          <p className="recipe-page__error">{error}</p>
        </div>
      </section>
    );
  }

  if (!recipe) {
    return (
      <section className="recipe-page">
        <div className="recipe-page__container">
          <p className="recipe-page__error">Recipe not found</p>
        </div>
      </section>
    );
  }

  return (
    <section className="recipe-page">
      <div className="recipe-page__container">
        <h1 className="recipe-page__title">{recipe.title}</h1>
        {recipe.image && (
          <div className="recipe-page__image">
            <img src={recipe.image} alt={recipe.title} />
          </div>
        )}
        <div className="recipe-page__ingredients">
          <h2 className="recipe-page__ingredients-title">Ingredients:</h2>
          <ul className="recipe-page__ingredients-list">
            {recipe.ingredients.map((ingredient, index) => (
              <li className="recipe-page__ingredients-item" key={index}>
                {ingredient.name} - {ingredient.amount} {ingredient.unit}
              </li>
            ))}
          </ul>
        </div>
        <div
          className="recipe-page__content"
          dangerouslySetInnerHTML={{
            __html: mdParser.render(recipe.content || ""),
          }}
        />
        <p className="recipe-page__created">
          Created: {new Date(recipe.createdAt).toLocaleDateString()}
        </p>
        {localStorage.getItem("user_id") === recipe.authorId && (
          <button onClick={handleEdit} className="recipe-page__button-edit">
            <img src={IconEdit} alt="Edit icon" />
          </button>
        )}
        <RecipeModal
          isModalOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={recipe}
          onUpdate={fetchRecipe}
        />
      </div>
    </section>
  );
}

export default RecipePage;
