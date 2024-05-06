import { auth, storage } from "fetchers/firebase/client";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const fetchContentsInformation = async () => {
  try {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(
      "/backend/api/functions/native/admin/content",
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
      },
    );
    const result = await response.json();
    if (result.status == "success") {
      return result.data;
    } else {
      console.log("Error:", result);
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const updateContentsInformation = async (data) => {
  try {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(
      `/backend/api/functions/native/admin/content`,
      {
        method: "PUT",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    const result = await response.json();
    if (result.status == "success") {
      return result.data;
    } else {
      console.error("Error:", result);
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const uploadImageToFireStorage = async (image) => {
  try {
    if (image == "") return "";

    // Generate a unique filename for the file
    const storageFileName = `${Date.now()}.png`;

    let blob;
    // Check if the image is a Blob object or a base64 string
    if (typeof image === "string" && image.startsWith("blob:")) {
      blob = await fetch(image).then((response) => response.blob());
    } else if (image instanceof Blob) {
      blob = image;
    } else if (typeof image === "string" && image.startsWith("data:image")) {
      // Convert base64 string to Blob
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const byteCharacters = Buffer.from(base64Data, "base64");
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters[i];
      }
      const byteArray = new Uint8Array(byteNumbers);
      blob = new Blob([byteArray], { type: "image/png" });
    } else {
      return "";
    }

    // Upload the file to Firebase Storage
    const storageRef = ref(
      storage,
      `users/${auth.currentUser.uid}/contents/${storageFileName}`,
    );

    await uploadBytes(storageRef, blob);

    // Get the download URL of the uploaded file
    return await getDownloadURL(storageRef);
  } catch (error) {
    // Handle any errors that occur during the upload process
    console.error("Error uploading file:", error);
    return "";
  }
};
