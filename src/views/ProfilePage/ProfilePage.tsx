/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { storage, auth } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import defaultUser from "../../assets/images/defaultuser.png";
import Nav from "../../components/Nav/Nav";
import { User, onAuthStateChanged, updateProfile } from "firebase/auth";
import { Container, Grid, Paper, Typography } from "@mui/material";
import { ChangeEvent } from "react"; // Import ChangeEvent

const ProfilePage = () => {
  const [photo, setPhoto] = useState<null | File>(null);
  const [photoURL, setPhotoURL] = useState(defaultUser);

  useEffect(() => {
    console.log(auth.currentUser);
    onAuthStateChanged(auth, (user) => {
      if (user?.photoURL) {
        const userImg: string = String(user.photoURL);
        setPhotoURL(userImg);
        console.log(userImg);
      }
    });
  }, []);

  // Correct the type of the parameter
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  }

  function handleClick() {
    upload(photo, auth.currentUser);
  }

  async function upload(
    file: Blob | ArrayBuffer | null,
    currentUser: User | null
  ) {
    const fileRef = ref(storage, auth.currentUser?.uid + ".png");

    if (file instanceof Blob) {
      // Check if the file is a Blob
      uploadBytes(fileRef, file)
        .then(() => {
          getDownloadURL(fileRef)
            .then((url) => {
              if (currentUser) {
                updateProfile(currentUser, { photoURL: url });
              }
              setPhotoURL(url);
            })
            .catch((error) => {
              console.log(error.message, "error getting the image URL");
            });
          setPhoto(null);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
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
                  style={{ maxWidth: "300px", minWidth: "100px" }}
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
};
export default ProfilePage;
