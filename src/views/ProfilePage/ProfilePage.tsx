/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { storage, auth } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import defaultUser from "../../assets/images/defaultuser.png";
import Nav from "../../components/Nav/Nav";
import { User, onAuthStateChanged, updateProfile } from "firebase/auth";
import { Container, Grid, Paper, Typography } from "@mui/material";
import { ChangeEvent } from "react";

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
    if (!currentUser) {
      console.error("No user is currently logged in");
      alert(
        "Error: No user is currently logged in. Please log in and try again."
      );
      return;
    }

    if (!file || !(file instanceof Blob)) {
      console.error("No valid file selected");
      alert("Error: Please select a valid image file.");
      return;
    }

    try {
      console.log("Starting upload for user:", currentUser.uid);
      console.log("File size:", file.size, "bytes");
      console.log("File type:", file.type);

      const fileRef = ref(storage, currentUser.uid + ".png");
      console.log("Upload reference created:", fileRef.fullPath);

      await uploadBytes(fileRef, file);
      console.log("File uploaded successfully");

      const url = await getDownloadURL(fileRef);
      console.log("Download URL obtained:", url);

      await updateProfile(currentUser, { photoURL: url });
      console.log("Profile updated successfully");

      setPhotoURL(url);
      setPhoto(null);
      alert("Profile image updated successfully!");
    } catch (error: unknown) {
      console.error("Full error object:", error);

      let errorMessage = "Unknown error occurred";
      let errorCode = "";

      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        "message" in error
      ) {
        const firebaseError = error as { code: string; message: string };
        errorCode = firebaseError.code;
        errorMessage = firebaseError.message;

        console.error("Error code:", errorCode);
        console.error("Error message:", errorMessage);

        switch (errorCode) {
          case "storage/unauthorized":
            errorMessage =
              "You don't have permission to upload files. Please check your authentication.";
            break;
          case "storage/canceled":
            errorMessage = "Upload was canceled.";
            break;
          case "storage/unknown":
            errorMessage = "An unknown error occurred during upload.";
            break;
          case "storage/invalid-format":
            errorMessage = "Invalid file format. Please select an image file.";
            break;
          case "storage/quota-exceeded":
            errorMessage = "Storage quota exceeded.";
            break;
          default:
            errorMessage = `Upload failed: ${errorCode} - ${errorMessage}`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
        console.error("Error message:", errorMessage);
      }

      alert(`Upload failed: ${errorMessage}`);
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
                <input type="file" accept="image/*" onChange={handleChange} />
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
