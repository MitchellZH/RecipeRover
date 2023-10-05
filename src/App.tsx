import DemoHomePage from "./views/DemoHomePage/DemoHomePage";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RecipePage from "./views/RecipePage/RecipePage";
import RegisterPage from "./views/RegisterPage/RegisterPage";
import LogInPage from "./views/LogInPage/LogInPage";
import MyRecipes from "./views/MyRecipes/MyRecipes";

const theme = createTheme({
  palette: {
    primary: {
      main: "#be1e19",
      light: "#e5918d",
      dark: "#a30404",
    },
    secondary: {
      main: "#ffffff"
    },
    success: {
      main: "#04a3a3",
      light: "#7bc9ca",
      dark: "#006662",
    },
  },
});

function App() {
  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/" element={<DemoHomePage/>} />
            <Route path="/recipe-info/:id" element={<RecipePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/log-in" element={<LogInPage />} />
            <Route path="/my-recipes" element={<MyRecipes />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
