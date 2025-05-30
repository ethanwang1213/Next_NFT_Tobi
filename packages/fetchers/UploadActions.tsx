import { auth, storage } from "fetchers/firebase/client";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";

export enum ImageType {
  AccountAvatar = 0,
  ContentBrand,
  SampleThumbnail,
  MaterialImage,
  ShowcaseThumbnail,
  ModelTempImage,
  ContentDocument,
  _3DModel,
}

export const uploadImage = async (image, type) => {
  try {
    if (image == "") return "";

    // Generate a unique filename for the file
    const storageFileName = `${Date.now()}.png`;

    let blob;
    // Check if the image is a Blob object or a base64 string
    if (image instanceof Blob) {
      blob = image;
    } else if (typeof image === "string") {
      if (image.startsWith("blob:")) {
        blob = await fetch(image).then((response) => response.blob());
      } else {
        // Convert base64 string to Blob
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const byteCharacters = Buffer.from(base64Data, "base64");
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters[i];
        }
        const byteArray = new Uint8Array(byteNumbers);
        blob = new Blob([byteArray], { type: "image/png" });
      }
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

      case ImageType.ShowcaseThumbnail:
        path = `users/${auth.currentUser.uid}/showcase/${storageFileName}`;
        break;

      case ImageType.ModelTempImage:
        path = `tmp/users/${auth.currentUser.uid}/${storageFileName}`;
        break;

      case ImageType.ContentDocument:
        path = `documents/${auth.currentUser.uid}/${storageFileName}`;
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

export const uploadFiles = async (file, extension, type) => {
  try {
    if (!file) return "";
    const storageFileName = `${Date.now()}.${extension}`;
    let blob;
    if (file instanceof Blob) {
      blob = file; // Use the Blob directly
    } else if (typeof file === "string") {
      if (file.startsWith("blob:")) {
        blob = await fetch(file).then((response) => response.blob());
      } else if (file.startsWith("data:")) {
        const matches = file.match(/data:(.*?);base64,(.+)/);
        if (matches) {
          const mimeType = matches[1];
          const base64Data = matches[2];
          const byteCharacters = Buffer.from(base64Data, "base64");
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters[i];
          }
          const byteArray = new Uint8Array(byteNumbers);
          blob = new Blob([byteArray], { type: mimeType });
        } else {
          throw new Error("Invalid base64 string.");
        }
      } else {
        const response = await fetch(file);
        if (!response.ok) throw new Error("Failed to fetch file from URL.");
        blob = await response.blob();
      }
    } else {
      throw new Error("Invalid file format.");
    }
    // Upload the file to Firebase Storage
    let path = "";
    switch (type) {
      case ImageType.ContentDocument:
        path = `documents/${auth.currentUser.uid}/${storageFileName}`;
        break;
      case ImageType._3DModel:
        path = `users/${auth.currentUser.uid}/item/uploaded/models/${storageFileName}`;
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

const createGlbBlob = (binaryData: Uint8Array) => {
  return new Blob([binaryData], { type: "model/gltf-binary" });
};

export const decodeBase64ToBinary = (base64String: string) => {
  const binaryString = window.atob(base64String);
  const length = binaryString.length;
  const bytes = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
};

export const uploadData = async (binaryData: Uint8Array) => {
  const storageDataName = `${Date.now()}.glb`;
  const path = `nftModels/${auth.currentUser.uid}/${storageDataName}`;
  const storageRef = ref(storage, path);
  const metadata = {
    contentType: "model/gltf-binary",
  };

  const uploadTask = uploadBytesResumable(
    storageRef,
    createGlbBlob(binaryData),
    metadata,
  );

  return new Promise<string>((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress.toFixed(2)}% done`);
      },
      (error) => {
        console.error("Upload error:", error);
        reject(error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadUrl);
      },
    );
  });
};

export const getDownloadUrlFromPath = async (
  fileUrl: string,
): Promise<string> => {
  // Extract the file path from the URL
  const matches = fileUrl.match(
    /https:\/\/(?:firebasestorage\.googleapis\.com\/v0\/b\/[^\/]+\/o\/|storage\.googleapis\.com\/[^\/]+\/)(.+)/,
  );
  if (!matches) {
    throw new Error("Invalid URL format");
  }

  const filePath = decodeURIComponent(matches[1]);
  // Remove '?alt=media'
  const fileRef = ref(storage, filePath.split("?")[0]);

  try {
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    console.error("Error getting download URL:", error);
    throw error;
  }
};
