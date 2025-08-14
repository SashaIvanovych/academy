import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { RecipeService } from "../../../services/recipes";
import { useLoginContext } from "../../../contexts/LoginContext";
import Recipe from "../../Recipe/Recipe";
import RecipesContainer from "../../RecipesContainer/RecipesContainer";
import RecipeModal from "../../RecipeModal/RecipeModal";
import ClipLoader from "react-spinners/ClipLoader";
import "./Recipes.scss";
import { useInView } from "../../../hooks/useInView";

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myRecipesOnly, setMyRecipesOnly] = useState(false);
  const debounceTimeout = useRef(null);

  const navigate = useNavigate();
  const { isLoggedIn, user } = useLoginContext();
  const ref = useRef(null);
  const ref2 = useRef(null);
  useInView(ref, { threshold: 0.1 });
  useInView(ref2, { threshold: 0.1 });

  const fetchRecipes = useCallback(
    async (searchValue = search) => {
      setIsLoading(true);
      setError("");
      try {
        const { recipes, total } = await RecipeService.getRecipes({
          search: searchValue,
          limit,
          offset,
          authorId: isLoggedIn && myRecipesOnly ? user.id : undefined,
        });
        setRecipes(recipes);
        setTotal(total);
      } catch (err) {
        setError(err.message);
        if (err.message === "Session expired. Please log in again.") {
          navigate("/auth/login");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [limit, offset, search, myRecipesOnly, isLoggedIn, user, navigate]
  );

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  useEffect(() => {
    if (isModalOpen || isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen, isLoading]);

  const handleSearch = (e) => {
    if (isLoading) return;
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
          {isLoggedIn && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="recipes__add-button"
              disabled={isLoading}
              ref={ref}
            >
              +
            </button>
          )}
          {isModalOpen && (
            <RecipeModal
              onClose={() => setIsModalOpen(false)}
              isModalOpen
              onUpdate={fetchRecipes}
            />
          )}
          <div className="recipes__filter" ref={ref2}>
            {isLoggedIn && (
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  checked={myRecipesOnly}
                  onChange={(e) => {
                    setMyRecipesOnly(e.target.checked);
                    setOffset(0);
                    fetchRecipes(search);
                  }}
                  disabled={isLoading}
                />
                <span></span>
                My Recipes
              </label>
            )}
            <div className="recipes__search">
              <input
                type="text"
                placeholder="Search recipes..."
                value={inputValue}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="recipes__overlay">
            <div className="recipes__spinner">
              <ClipLoader color="#fff" size={60} />
            </div>
          </div>
        )}
        {error && <p className="recipes__error">{error}</p>}
        {!isLoading && recipes.length === 0 && (
          <p className="recipes__empty">No recipes found.</p>
        )}
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
