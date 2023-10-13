import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Nav from "../../components/Nav/Nav";
import SearchedRecipes from "../../components/SearchedRecipes/SearchedRecipes";
import RandomRecipes from "../../components/RandomRecipes/RandomRecipes";
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

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}


export default function DemoHomePage() {
  const [searchInput, setSearchInput] = useState("");
  const [recipeName, setRecipeName] = useState("");
  const [searchedRecipes, setSearchedRecipes] = useState<IRecipe[]>([
    {
      id: 0,
      title: "",
      readyInMinutes: 0,
      img: "",
      summary: "",
      dishTypes: [],
      healthScore: 0,
      ingredients: [],
      instructions: [],
    },
  ]);
  const [randomRecipes, setRandomRecipes] = useState<IRecipe[]>([
    {
      id: 0,
      title: "",
      readyInMinutes: 0,
      img: "",
      summary: "",
      dishTypes: [],
      healthScore: 0,
      ingredients: [],
      instructions: [],
    },
  ]);
  const [addedRecipe, setAddedRecipe] = useState<IRecipe>({
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

  useEffect(() => {
    if (recipeName) {
      recipeData(recipeName);
    } else {
      randomData()
    }
    if (addedRecipe.title.length > 1) {
      addRecipe()
    }
  }, [recipeName, addedRecipe]);

  const recipeData = async (search: string) => {
    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${search}&instructionsRequired=true&fillIngredients=true&addRecipeInformation=true&ignorePantry=false&number=99&limitLicense=false&ranking=2&apiKey=${import.meta.env.VITE_API_KEY}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, options);

    if (response.ok) {
      const data = await response.json();
      const recipes_: object[] = [{}];
      recipes_.pop();
      data.results.map((x) => {
        recipes_.push({
          id: x.id,
          title: x.title,
          readyInMinutes: x.readyInMinutes,
          img: x.image,
          summary: x.summary,
          dishTypes: x.dishTypes,
          healthScore: x.healthScore,
          ingredients: x.extendedIngredients,
          instructions: x.analyzedInstructions,
        });
      });
      setSearchedRecipes(recipes_);
    }
  };

  const randomData = async () => {
    const url = `https://api.spoonacular.com/recipes/random?number=99&apiKey=${
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
      const recipes_: object[] = [{}];
      recipes_.pop();
      data.recipes.map((x) => {
        recipes_.push({
          id: x.id,
          title: x.title,
          readyInMinutes: x.readyInMinutes,
          img: x.image,
          summary: x.summary,
          dishTypes: x.dishTypes,
          healthScore: x.healthScore,
          ingredients: x.extendedIngredients,
          instructions: x.analyzedInstructions,
        });
      });
      setRandomRecipes(recipes_);
    }
  };

  const onAdd = (recipe: IRecipe) => {
    setAddedRecipe(recipe);
    
  };

  const addRecipe = async () => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid
      await setDoc(doc(db, "users", userId, "recipes", addedRecipe.title), addedRecipe);
    }
  }
    

  return (
    <>
      <Nav />
      <div className="hero-banner">
        <Container maxWidth="md">
          <Grid container>
            <Grid item xs={12}>
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="secondary"
                gutterBottom
              >
                Welcome!
              </Typography>
              <Typography
                variant="h5"
                align="center"
                color="secondary"
                paragraph
              >
                Here you can find all sorts of recipes by name, category, and
                ingredient.
              </Typography>
              <Stack
                sx={{ pt: 4 }}
                direction="row"
                spacing={2}
                justifyContent="center"
              >
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    setRecipeName(searchInput);
                  }}
                >
                  <TextField
                    id="filled-basic"
                    label="Enter food here"
                    variant="filled"
                    onChange={(event) => setSearchInput(event.target.value)}
                    color="primary"
                    sx={{ backgroundColor: "white", marginBottom: "2px" }}
                  />
                  <Button
                    type="submit"
                    color="secondary"
                    variant="contained"
                    size="large"
                    style={{ padding: "15px", marginBottom: "2px" }}
                  >
                    Search
                  </Button>
                </form>
              </Stack>
              <Button
                variant="contained"
                onClick={() => window.location.reload()}
                sx={{ textAlign: "center", display: "block", margin: "auto", marginTop: "20px" }}
              >
                Explore Recipes
              </Button>
            </Grid>
          </Grid>
        </Container>
      </div>
      <main>
        {searchedRecipes.length > 2 ? (
          <SearchedRecipes searchedRecipes={searchedRecipes} onAdd={onAdd} />
        ) : (
          <RandomRecipes randomRecipes={randomRecipes} onAdd={onAdd} />
        )}
      </main>
      <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </Box>
    </>
  );
}
