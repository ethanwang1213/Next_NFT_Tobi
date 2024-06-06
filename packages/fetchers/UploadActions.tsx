import { auth, storage } from "fetchers/firebase/client";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export enum ImageType {
  AccountAvatar = 0,
  ContentBrand,
  SampleThumbnail,
  MaterialImage,
}

export const uploadImage = async (image, type) => {
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
      const byteCharacters = Buffer.from(image, "base64");
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters[i];
      }
      const byteArray = new Uint8Array(byteNumbers);
      blob = new Blob([byteArray], { type: "image/png" });
    }

    // Upload the file to Firebase Storage
    let path = "";
    switch (type) {
      case ImageType.AccountAvatar:
        path = `avatars/${auth.currentUser.uid}/${storageFileName}`;
        break;

      case ImageType.ContentBrand:
        path = `users/${auth.currentUser.uid}/contents/${storageFileName}`;
        break;

      case ImageType.SampleThumbnail:
        path = `thumbnails/${auth.currentUser.uid}/${storageFileName}`;
        break;

      case ImageType.MaterialImage:
        path = `materials/${auth.currentUser.uid}/${storageFileName}`;
        break;

      default:
        break;
    }

    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob);

    // Get the download URL of the uploaded file
    return await getDownloadURL(storageRef);
  } catch (error) {
    // Handle any errors that occur during the upload process
    console.error("Error uploading file:", error);
    return "";
  }
};
