import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
  Stack,
  Pagination,
} from "@mui/material";
import  { DocumentData, collection, getDocs, doc, deleteDoc} from "firebase/firestore";
import { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import Nav from "../../components/Nav/Nav";
import { Link } from "react-router-dom"

const MyRecipes = () => {
  const [recipes, setRecipes] = useState<Array<DocumentData>>([]);
  useEffect(() => {
    getRecipes();
  }, [])

  const getRecipes = async () => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const recipesCollection = collection(db, "users", userId, "recipes");

      const allRecipes = await getDocs(recipesCollection);
      setRecipes(() => {
        return allRecipes.docs.map((recipe) => ({
          id: recipe.id,
          ...recipe.data(),
        }));
      });
    }
  };

  const handleDelete = async (recipeId: number, recipeTitle: string) => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;

      await deleteDoc(
        doc(db, "users", userId, "recipes", recipeTitle)
      );
      
      setRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe.id !== recipeId)
      );
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 9;
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );

  const paginate = (e: unknown, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 1800, behavior: "smooth" });
  };

  return (
    <>
      <Nav />
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Typography variant="h4" gutterBottom style={{ textAlign: "center" }}>
          My Recipes
        </Typography>
        <hr style={{ marginBottom: "40px" }} />
        <Grid container spacing={4}>
          {recipes.length > 0 &&
            currentRecipes.map((recipe, idx) => (
              <Grid item key={idx} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: "56.25%",
                    }}
                    image={recipe.img}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {recipe.title}
                    </Typography>
                    <Typography variant="subtitle2">
                      <b>Health Score:</b> {recipe.healthScore}
                    </Typography>
                    <Typography variant="subtitle2">
                      <b>Time to cook:</b> {recipe.readyInMinutes}
                    </Typography>
                    <Typography variant="subtitle2">
                      <b>Category:</b>
                      <br></br>|{" "}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Link to={`/recipe-info/${recipe.id}`}>
                      <Button
                        sx={{ marginRight: "10px" }}
                        color="info"
                        variant="outlined"
                      >
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(recipe.id, recipe.title)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
        <Stack mt="100px" alignItems="center">
          {recipes.length > 9 && (
            <Pagination
              color="standard"
              shape="rounded"
              defaultPage={1}
              count={Math.ceil(recipes.length / recipesPerPage)}
              page={currentPage}
              onChange={paginate}
              size="large"
            />
          )}
        </Stack>
      </Container>
    </>
  );
};
export default MyRecipes;
