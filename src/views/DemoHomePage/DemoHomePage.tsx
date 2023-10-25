import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Nav from "../../components/Nav/Nav";
import SearchedRecipes from "../../components/SearchedRecipes/SearchedRecipes";
import RandomRecipes from "../../components/RandomRecipes/RandomRecipes";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
    <Typography variant="body2" color="white" align="center">
      {"Copyright © "}
      <Link href="https://portfolio.mitchellhamm.com/">
        <span style={{ color: "#7bc9ca" }}>Mitchell Hamm</span>
      </Link>{" "}
      2023
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
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (auth.currentUser) {
      setOpen(true);
    } else {
      alert("please log in to use this feature");
    }
  };

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  useEffect(() => {
    if (recipeName) {
      recipeData(recipeName);
    } else {
      randomData();
    }
  }, [recipeName]);

  const recipeData = async (search: string) => {
    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${search}&instructionsRequired=true&fillIngredients=true&addRecipeInformation=true&ignorePantry=false&number=99&limitLicense=false&ranking=2&apiKey=${
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

      const recipes_: IRecipe[] = [
        {
          id: 0,
          title: "",
          readyInMinutes: 0,
          img: "",
          summary: "",
          dishTypes: [""],
          healthScore: 0,
          ingredients: [],
          instructions: [],
        },
      ];

      recipes_.pop();
      data.results.map(
        (x: {
          id: number;
          title: string;
          readyInMinutes: number;
          image: string;
          summary: string;
          dishTypes: string[];
          healthScore: number;
          extendedIngredients: object[];
          analyzedInstructions: object[];
        }) => {
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
        }
      );
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

      
        const recipes_: IRecipe[] = [
          {
            id: 0,
            title: "",
            readyInMinutes: 0,
            img: "",
            summary: "",
            dishTypes: [""],
            healthScore: 0,
            ingredients: [],
            instructions: [],
          },
        ];

        recipes_.pop();
        data.recipes.map(
          (x: {
            id: number;
            title: string;
            readyInMinutes: number;
            image: string;
            summary: string;
            dishTypes: string[];
            healthScore: number;
            extendedIngredients: object[];
            analyzedInstructions: object[];
          }) => {
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
          }
        );
        setRandomRecipes(recipes_);
      
        alert("Invalid data format for recipes");
      
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
      <div>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message="Recipe added"
          action={action}
        />
      </div>
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
                <Paper
                  component="form"
                  sx={{
                    p: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    width: 400,
                  }}
                  onSubmit={(event) => {
                    event.preventDefault();
                    setRecipeName(searchInput);
                  }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search Recipes"
                    inputProps={{ "aria-label": "search recipes" }}
                    onChange={(event) => setSearchInput(event.target.value)}
                  />
                  <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                  <IconButton
                    type="submit"
                    sx={{ p: "10px" }}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                </Paper>
              </Stack>
              <Button
                size="large"
                variant="contained"
                onClick={() => window.location.reload()}
                sx={{
                  textAlign: "center",
                  display: "block",
                  margin: "auto",
                  mt: 5,
                }}
              >
                Random Recipes
              </Button>
            </Grid>
          </Grid>
        </Container>
      </div>
      <main>
        {searchedRecipes.length > 2 ? (
          <SearchedRecipes
            searchedRecipes={searchedRecipes}
            addRecipe={addRecipe}
            handleClick={handleClick}
          />
        ) : (
          <RandomRecipes
            randomRecipes={randomRecipes}
            addRecipe={addRecipe}
            handleClick={handleClick}
          />
        )}
      </main>
      <Box sx={{ bgcolor: "#494949", color: "white", p: 6 }} component="footer">
        <Copyright />
      </Box>
    </>
  );
}
