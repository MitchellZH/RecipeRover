import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText
} from "@mui/material";

interface IRecipe {
  id: number;
  title: string;
  readyInMinutes: number;
  img: string;
  summary: string;
  dishTypes: string[];
  healthScore: number;
  ingredients: object[];
  instructions: object[];
}

const RecipePage = () => {

  const {recipeId} = useParams();
  const [recipe, setRecipe] = useState<IRecipe>({
    id: 0,
    title: "",
    readyInMinutes: 0,
    img: "",
    summary: "",
    dishTypes: [],
    healthScore: 0,
    ingredients: [],
    instructions: [],
  });
  const [ingredients, setIngredients] = useState<Array<string>>([]);
  const [instructions, setInstructions] = useState<Array<string>>([]);
  const [image, setImage] = useState<string>("")
   
  useEffect(() => {
    console.log(recipe.img)
    console.log("recipeId:", recipeId);
    if (recipeId) {
      const id = parseInt(recipeId, 10);
      recipeData(id);
    }
  },[])

  

  const recipeData = async (id: number) => {
    const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${
      import.meta.env.VITE_API_KEY
    }`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, options);

    if (response.ok) {
      const data = await response.json();
      // Create new arrays for ingredients and instructions
      const newIngredients = data.extendedIngredients.map(
        (ingredient: { original: string }) => ingredient.original
      );
      const newInstructions = data.analyzedInstructions[0].steps.map(
        (step: { step: string }) => step.step
      );
      setImage(data.image);
      setIngredients(newIngredients);
      setInstructions(newInstructions);
      setRecipe(data);
    }
  };

  return (
    <>
      <div className="recipe-page">
        <Container maxWidth="md" style={{ marginTop: "40px" }}>
          <Paper
            elevation={3}
            style={{
              padding: "30px",
              backgroundColor: "rgba(255, 255, 255, 0.555)",
            }}
          >
            <Typography variant="h4" gutterBottom>
              Recipe Info
            </Typography>
            <img
              src={image}
              alt={recipe.title}
              style={{
                width: "100%", // Make the image fluid
                height: "auto", // Maintain aspect ratio
              }}
            />
            <Typography variant="h5" gutterBottom color={"primary.main"}>
              {recipe.title}
            </Typography>
            <hr />
            <Typography variant="subtitle1">
              <strong>Prep Time:</strong> {recipe.healthScore}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Cook Time:</strong> {recipe.readyInMinutes}
            </Typography>
            <Typography
              variant="subtitle1"
              dangerouslySetInnerHTML={{
                __html: recipe.summary.replace(
                  /<a/g,
                  '<a style="color: red; text-decoration: underline"'
                ),
              }}
            ></Typography>

            <section style={{ marginTop: "20px" }}>
              <Typography variant="h6" gutterBottom>
                Ingredients
              </Typography>
              <hr />
              <ol>
                {ingredients.map((ingredient, idx) => (
                  <li key={idx}>{ingredient}</li>
                ))}
              </ol>
            </section>

            <section style={{ marginTop: "30px" }}>
              <Typography variant="h6" gutterBottom>
                Instructions
              </Typography>
              <hr />
              <ol>
                {instructions.map((instruction, idx) => (
                  <li key={idx}>{instruction}</li>
                ))}
              </ol>
            </section>
          </Paper>
        </Container>
      </div>
    </>
  );
};
export default RecipePage;
