import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Nav from "../../components/Nav/Nav";
import { Container, Paper, Typography, Button } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

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
  const { recipeId } = useParams();
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

  useEffect(() => {
    console.log("recipeId:", recipeId);
    if (recipeId) {
      const id = parseInt(recipeId, 10);
      recipeData(id);
    }
  }, []);

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
      setIngredients(newIngredients);
      setInstructions(newInstructions);
      setRecipe({
        id: data.id,
        title: data.title,
        readyInMinutes: data.readyInMinutes,
        img: data.image,
        summary: data.summary,
        dishTypes: data.dishTypes,
        healthScore: data.healthScore,
        ingredients: data.extendedIngredients,
        instructions: data.analyzedInstructions,
      });
    }
  };

  const addRecipe = async (recipe: IRecipe) => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      await setDoc(doc(db, "users", userId, "recipes", recipe.title), recipe);
    }
  };

  return (
    <>
      <Nav />
      <div className="recipe-page">
        <Typography variant="h4" gutterBottom style={{ textAlign: "center" }}>
          Recipe Details
        </Typography>
        <Container maxWidth="md" style={{ marginTop: "40px" }}>
          <img
            src={recipe.img}
            alt={recipe.title}
            style={{
              width: "100%",
              height: "auto",
              marginBottom: "0",
            }}
          />
          <Paper
            elevation={3}
            style={{
              padding: "30px",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              marginBottom: "40px",
            }}
          >
            <Typography variant="h5" gutterBottom color={"primary.main"}>
              {recipe.title}
            </Typography>
            <Button
              variant="outlined"
              color="success"
              sx={{ marginRight: "10px" }}
              onClick={() => addRecipe(recipe)}
            >
              Add
            </Button>
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
