import {useEffect, useState} from "react";
import { storage, auth } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import defaultUser from "../../assets/images/defaultuser.png";
import Nav from "../../components/Nav/Nav";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { Container, Grid, Paper, Typography } from "@mui/material";

const ProfilePage = () => {
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(defaultUser);
  const [user, setUser] = useState({
    id: "",
    email: "",
  });

  useEffect(() => {
    console.log(auth.currentUser)
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userImg: string = String(user.photoURL)
        setPhotoURL(userImg);
        console.log(userImg);
      }
    });
  }, [])

  function handleChange(e) {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  }

  function handleClick() {
    upload(photo, auth.currentUser);
  }

  async function upload(file, currentUser) {
    const fileRef = ref(storage, auth.currentUser?.uid + ".png");

    uploadBytes(fileRef, file).then(() => {
      getDownloadURL(fileRef)
        .then((url) => {
          updateProfile(currentUser, {photoURL:url})
          setPhotoURL(url);
        })
        .catch((error) => {
          console.log(error.message, "error getting the image url");
        });
        setPhoto(null)
    })
    .catch((error) => {
      console.log(error.message)
    });
  }
    
  return (
    <>
      <Nav />
      <Container maxWidth="md">
        <Paper
          elevation={3}
          style={{
            padding: "30px",
            margin: "50px",
            marginBottom: "40px",
          }}
        >
          <Grid container>
            <Grid item xs={12}>
              <Typography
                component="h1"
                variant="h5"
                align="center"
                gutterBottom
              >
                Currently Logged In As: {auth.currentUser?.email}
              </Typography>
              <Grid sx={{ textAlign: "center" }} item xs={12}>
                <img
                  src={photoURL}
                  alt={`${auth.currentUser}'s Avatar`}
                  className="avatar"
                  style={{ maxWidth: "300px", minWidth:"100px" }}
                />
              </Grid>
              <Grid sx={{ textAlign: "center" }} item xs={12}>
                <input type="file" onChange={handleChange} />
                <button disabled={!photo} onClick={handleClick}>
                  Upload
                </button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
}
export default ProfilePage;