import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../../services/auth";
import { useLoginContext } from "../../../contexts/LoginContext";
import Recipe from "../../Recipe/Recipe";
import RecipesContainer from "../../RecipesContainer/RecipesContainer";
import "./Recipes.scss";
import { mockRecipes } from "../../../mockRecipes";

function Recipes() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn } = useLoginContext();
  const [input, setInput] = useState("");
  const filteredRecipes = mockRecipes.filter((recipe) =>
    recipe.title.toLocaleLowerCase().includes(input.toLocaleLowerCase())
  );

  return (
    <section className="recipes">
      <div className="recipes__container">
        <div className="recipes__header">
          {isLoggedIn && <button className="recipes__add-button">+</button>}
          <div className="recipes__search">
            <input
              type="text"
              placeholder="Search recipes..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </div>
        <RecipesContainer>
          {filteredRecipes.map((recipe) => (
            <Recipe key={recipe.id} recipe={recipe} />
          ))}
        </RecipesContainer>
      </div>
    </section>
  );
}

export default Recipes;
