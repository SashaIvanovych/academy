import { useState } from "react";
import "./RecipeModal.scss";
import UploadIcon from "../../assets/icons/addWhite.svg";
import DeleteIcon from "../../assets/icons/deleteicon.svg";
import DeleteSmallIcon from "../../assets/icons/deleteSmall.svg";
import AddSmallIcon from "../../assets/icons/addSmall.svg";
import Close from "../../assets/icons/close.svg";

import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import MarkdownIt from "markdown-it";

const mdParser = new MarkdownIt();

function RecipeModal({ isModalOpen, onClose, type }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([
    { name: "", amount: "", unit: "g" },
  ]);

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    } else {
      const updated = [...ingredients];
      updated[0] = { name: "", amount: "", unit: "g" };
      setIngredients(updated);
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "", unit: "g" }]);
  };

  const handleEditorChange = ({ text }) => {
    setDescription(text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const recipeData = {
      name,
      image,
      description,
      JSONString: JSON.stringify(ingredients),
    };

    console.log("Recipe data:", recipeData);

    setName("");
    setImage(null);
    setDescription("");
    setIngredients([{ name: "", amount: "", unit: "g" }]);

    onClose(false);
  };

  if (!isModalOpen) return null;

  return (
    <div className="recipe-modal">
      <div className="recipe-modal__body">
        <h2 className="recipe-modal__title">
          {type === "add" ? "Add recipe" : "Edit recipe"}
        </h2>
        <form className="recipe-modal__form" onSubmit={handleSubmit}>
          <div className="recipe-modal__field">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="recipe-modal__field recipe-modal__field--gap">
            <label>Image:</label>
            <div className="recipe-modal__image-input">
              {image && (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Recipe"
                  className="recipe-modal__image"
                />
              )}
              {!!image && (
                <img
                  src={DeleteIcon}
                  alt="Delete"
                  className="recipe-modal__delete-image"
                  onClick={() => {
                    setImage(null);
                    document.getElementById("image").value = "";
                  }}
                />
              )}
              <label htmlFor="image">
                {!image && (
                  <img
                    src={UploadIcon}
                    alt="Upload"
                    className="recipe-modal__upload-icon"
                  />
                )}
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
                  />
                  <input
                    type="text"
                    value={ingredient.amount}
                    placeholder="Amount"
                    onChange={(e) =>
                      handleIngredientChange(index, "amount", e.target.value)
                    }
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
            <MdEditor
              className="mde"
              style={{
                height: "300px",
                width: "100%",
              }}
              value={description}
              renderHTML={(text) => mdParser.render(text)}
              onChange={handleEditorChange}
              placeholder="Write recipe here..."
            />
          </div>

          <button type="submit" className="recipe-modal__button">
            {type === "add" ? "Add" : "Edit"}
          </button>
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
