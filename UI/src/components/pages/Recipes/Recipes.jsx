import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { RecipeService } from "../../../services/recipes";
import { useLoginContext } from "../../../contexts/LoginContext";
import Recipe from "../../Recipe/Recipe";
import RecipesContainer from "../../RecipesContainer/RecipesContainer";
import "./Recipes.scss";

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();
  const { isLoggedIn } = useLoginContext();
  const debounceTimeout = useRef(null);

  const fetchRecipes = useCallback(
    async (searchValue = search) => {
      setIsLoading(true);
      setError("");
      try {
        const { recipes, total } = await RecipeService.getRecipes({
          search: searchValue,
          limit,
          offset,
        });
        setRecipes(recipes);
        setTotal(total);
      } catch (err) {
        setError(err.message);
        if (err.message.includes("Session expired")) {
          navigate("/auth/login");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [limit, offset, navigate]
  );

  useEffect(() => {
    if (isLoggedIn) {
      fetchRecipes();
    } else {
      navigate("/auth/login");
    }
  }, [isLoggedIn, fetchRecipes, navigate]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      setSearch(value);
      setOffset(0);
      fetchRecipes(value);
    }, 500);
  };

  return (
    <section className="recipes">
      <div className="recipes__container">
        <div className="recipes__header">
          {isLoggedIn && <button className="recipes__add-button">+</button>}
          <div className="recipes__search">
            <input
              type="text"
              placeholder="Search recipes..."
              value={inputValue}
              onChange={handleSearch}
            />
          </div>
        </div>
        {isLoading && <p>Loading...</p>}
        {error && <p className="recipes__error">{error}</p>}
        <RecipesContainer
          itemsPerPage={limit}
          totalItems={total}
          currentOffset={offset}
          setOffset={setOffset}
        >
          {recipes.map((recipe) => (
            <Recipe key={recipe.id} recipe={recipe} />
          ))}
        </RecipesContainer>
      </div>
    </section>
  );
}

export default Recipes;
