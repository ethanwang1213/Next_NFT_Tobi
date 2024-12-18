import { deleteObject, listAll, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { TcpFormType } from "types/adminTypes";
import { auth, storage } from "./firebase/client";

export const useTcpRegistration = (setError: (arg: string | null) => void) => {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const filePath = `/users/${auth.currentUser.uid}/tcp/copyright/files`;

  const registerTcp = async (data: TcpFormType) => {
    try {
      setLoading(true);
      setError(null);
      const files = [
        data.copyright.file1,
        data.copyright.file2,
        data.copyright.file3,
        data.copyright.file4,
      ];
      const validFiles = files.filter(
        (file): file is File => file instanceof File,
      );
      const fileNames = validFiles.map((file) => replaceFileName(file.name));
      await uploadFiles(validFiles, fileNames, filePath);
      const res = await postTcpData(data, fileNames);
      if (res.ok) {
        setResponse("登録が完了しました。");
      } else {
        const resData = await res.text();
        console.error(resData);
        setError("エラーが発生しました。もう一度お試しください。");
        setLoading(false);
      }
    } catch (error) {
      deleteFiles(filePath).catch((e) => console.error(e));
      console.error(String(error));
      setError("エラーが発生しました。もう一度お試しください。");
      setLoading(false);
    }
  };

  return [registerTcp, response, loading] as const;
};

const uploadFiles = async (
  files: File[],
  fileNames: string[],
  path: string,
) => {
  // When using foreach, we cannot catch exceptions thrown by uploadBytes,
  // so we should use for loop instead.
  for (let i = 0; i < files.length; i++) {
    if (!files[i]) continue;

    validateCopyrightFile(files[i]);

    const storageRef = ref(storage, `${path}/${fileNames[i]}`);
    await uploadBytes(storageRef, files[i]);
  }
};

export const validateCopyrightFile = (file: File) => {
  const maxFileSize = 20 * 1024 * 1024; // 20MB
  const fileTypes = ["image/jpeg", "image/png", "application/pdf"];

  if (!fileTypes.includes(file.type)) {
    throw new Error("アップロードできるファイル形式は、JPEG、PNG、PDFのみです");
  }

  if (file.size > maxFileSize) {
    throw new Error("ファイルサイズは20MB以内にしてください");
  }
};

const postTcpData = async (data: TcpFormType, fileNames: string[]) => {
  const postData = {
    ...data,
    copyright: {
      ...data.copyright,
      copyrightHolder: [data.copyright.copyrightHolder],
      file1: fileNames[0],
      file2: fileNames[1],
      file3: fileNames[2],
      file4: fileNames[3],
    },
  };
  const idToken = await auth.currentUser.getIdToken();
  return await fetch(`/backend/api/functions/native/my/business/submission`, {
    method: "POST",
    headers: {
      Authorization: idToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });
};

const deleteFiles = async (path: string) => {
  const listRef = ref(storage, path);
  const list = await listAll(listRef);
  // When using foreach, we cannot catch exceptions thrown by deleteObject,
  // so we should use for loop instead.
  for (let i = 0; i < list.items.length; i++) {
    deleteObject(list.items[i]);
  }
};

const replaceFileName = (name?: string) => {
  if (!name) {
    return "";
  }

  let newFileName = crypto.randomUUID();
  const lastDotIndex = name.lastIndexOf(".");
  if (lastDotIndex !== -1) {
    const extension = name.substring(lastDotIndex);
    newFileName += extension;
  }
  return newFileName;
};

export const checkBusinessAccount = async () => {
  const idToken = await auth.currentUser.getIdToken();
  const res = await fetch(
    `/backend/api/functions/native/my/business/checkexist`,
    {
      method: "POST",
      headers: {
        Authorization: idToken,
        "Content-Type": "application/json",
      },
    },
  );
  if (res.ok) {
    const resData = await res.json();
    return resData.data;
  } else {
    const resData = await res.text();
    console.log(resData);
    throw new Error("エラーが発生しました。もう一度お試しください。");
  }
};
