import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RecipeService } from "../../services/recipes";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./RecipeModal.scss";
import UploadIcon from "../../assets/icons/addWhite.svg";
import DeleteIcon from "../../assets/icons/deleteicon.svg";
import DeleteSmallIcon from "../../assets/icons/deleteSmall.svg";
import AddSmallIcon from "../../assets/icons/addSmall.svg";
import Close from "../../assets/icons/close.svg";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import MarkdownIt from "markdown-it";
import "react-toastify/dist/ReactToastify.css";

const mdParser = new MarkdownIt();

function RecipeModal({ isModalOpen, onClose, data, onUpdate }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([
    { name: "", amount: "", unit: "g" },
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setName(data.title || "");
      setDescription(data.content || "");
      setIngredients(
        data.ingredients?.length
          ? data.ingredients
          : [{ name: "", amount: "", unit: "g" }]
      );
      setImage(data.image || null);
    } else {
      setName("");
      setDescription("");
      setIngredients([{ name: "", amount: "", unit: "g" }]);
      setImage(null);
    }
  }, [data]);

  if (!isModalOpen) return null;

  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    } else {
      setIngredients([{ name: "", amount: "", unit: "g" }]);
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "", unit: "g" }]);
  };

  const handleEditorChange = ({ text }) => {
    setDescription(text);
  };

  const handleDeleteImage = () => {
    setImage(null);
    //document.getElementById("image").value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!name.trim()) {
        throw new Error("Name is required");
      }
      if (
        ingredients.some(
          (ing) => !ing.name.trim() || !ing.amount || isNaN(ing.amount)
        )
      ) {
        throw new Error("All ingredients must have a valid name and amount");
      }

      let imageUrl = data?.image || "";
      if (image && typeof image !== "string") {
        imageUrl = await RecipeService.uploadImage(image);
      } else if (!image) {
        imageUrl = "";
      }

      const recipeData = {
        title: name,
        image: imageUrl,
        content: description,
        ingredients: ingredients.map((ing) => ({
          name: ing.name,
          amount: parseFloat(ing.amount),
          unit: ing.unit,
        })),
      };

      if (data) {
        await RecipeService.updateRecipe(data.id, recipeData);
        toast.success("Recipe updated successfully!");
      } else {
        await RecipeService.createRecipe(recipeData);
        toast.success("Recipe created successfully!");
      }

      onClose(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!data) return;

    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-confirm">
            <h1>Are you sure?</h1>
            <p>
              You are about to delete <b>{data.title}</b>. This action cannot be
              undone.
            </p>
            <div className="custom-confirm__buttons">
              <button
                onClick={onClose}
                className="custom-confirm__btn custom-confirm__btn--cancel"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await RecipeService.deleteRecipe(data.id);
                    toast.success("Recipe deleted successfully!");
                    onClose();
                    onClose(false);
                    if (onUpdate) onUpdate();
                    navigate("/recipes");
                  } catch (err) {
                    toast.error(`Error deleting recipe: ${err.message}`);
                  }
                }}
                className="custom-confirm__btn custom-confirm__btn--delete"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        );
      },
    });
  };

  return (
    <div className="recipe-modal">
      <div className="recipe-modal__body">
        <h2 className="recipe-modal__title">
          {data ? "Edit recipe" : "Add recipe"}
        </h2>
        <form className="recipe-modal__form" onSubmit={handleSubmit}>
          <div className="recipe-modal__field">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter recipe name"
              required
            />
          </div>

          <div className="recipe-modal__field recipe-modal__field--gap">
            <label>Image:</label>
            <div className="recipe-modal__image-input">
              {image && (
                <img
                  src={
                    typeof image === "string"
                      ? image
                      : URL.createObjectURL(image)
                  }
                  alt="Recipe"
                  className="recipe-modal__image"
                />
              )}

              {image && (
                <img
                  src={DeleteIcon}
                  alt="Delete"
                  className="recipe-modal__delete-image"
                  onClick={handleDeleteImage}
                />
              )}

              {!image && (
                <>
                  <label htmlFor="image">
                    <img
                      src={UploadIcon}
                      alt="Upload"
                      className="recipe-modal__upload-icon"
                    />
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    id="image"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImage(e.target.files[0]);
                      }
                    }}
                  />
                </>
              )}
            </div>
          </div>

          <div className="recipe-modal__field">
            <label>Ingredients:</label>
            <div className="recipe-modal__ingredients">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="recipe-modal__ingredient">
                  <input
                    type="text"
                    value={ingredient.name}
                    placeholder="Name"
                    onChange={(e) =>
                      handleIngredientChange(index, "name", e.target.value)
                    }
                    required
                  />
                  <input
                    type="number"
                    value={ingredient.amount}
                    placeholder="Amount"
                    onChange={(e) =>
                      handleIngredientChange(index, "amount", e.target.value)
                    }
                    required
                    min="0"
                    step="any"
                  />
                  <select
                    value={ingredient.unit}
                    onChange={(e) =>
                      handleIngredientChange(index, "unit", e.target.value)
                    }
                  >
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="l">l</option>
                    <option value="tsp">tsp</option>
                    <option value="tbsp">tbsp</option>
                    <option value="pcs">pcs</option>
                  </select>
                  <button type="button" onClick={() => removeIngredient(index)}>
                    <img src={DeleteSmallIcon} alt="Delete" />
                  </button>
                </div>
              ))}
              <button
                className="recipe-modal__add-ingredient"
                type="button"
                onClick={addIngredient}
              >
                <img src={AddSmallIcon} alt="Add" />
              </button>
            </div>
          </div>

          <div className="recipe-modal__field">
            <label>Description:</label>
            <MdEditor
              className="mde"
              style={{ height: "300px", width: "100%" }}
              value={description}
              renderHTML={(text) => mdParser.render(text)}
              onChange={handleEditorChange}
              placeholder="Write recipe here..."
            />
          </div>

          {error && <p className="recipe-modal__error">{error}</p>}

          <div className="recipe-modal__actions">
            <button
              type="submit"
              className="recipe-modal__button"
              disabled={loading}
            >
              {loading ? "Saving..." : data ? "Update" : "Add"}
            </button>
            {data && (
              <button
                type="button"
                className="recipe-modal__button recipe-modal__button--delete"
                onClick={handleDelete}
              >
                Delete
              </button>
            )}
          </div>
        </form>

        <button
          type="button"
          className="recipe-modal__close"
          onClick={() => onClose(false)}
        >
          <img src={Close} alt="Close" />
        </button>
      </div>
    </div>
  );
}

export default RecipeModal;
