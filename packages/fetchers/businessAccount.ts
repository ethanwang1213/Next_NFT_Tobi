import { ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { TcpFormType } from "types/adminTypes";
import { auth, storage } from "./firebase/client";

export const useTcpRegistration = (setResponse, setError) => {
  const [loading, setLoading] = useState<boolean>(false);

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
      const filePath = `/users/${auth.currentUser.uid}/tcp/copyright/files`;
      await uploadFiles(files, filePath);
      const res = await postTcpData(data);
      if (res.ok) {
        const resData = await res.json();
        setResponse(resData);
      } else {
        const resData = await res.text();
        setError(resData);
        setLoading(false);
      }
    } catch (error) {
      setError(String(error));
      setLoading(false);
    }
  };

  return [registerTcp, loading] as const;
};

const uploadFiles = async (files: File[], path: string) => {
  // When using foreach, we cannot catch exceptions thrown by uploadBytes,
  // so we should use for loop instead.
  for (let i = 0; i < files.length; i++) {
    const maxFileSize = 20 * 1024 * 1024; // 20MB
    const fileTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!files[i]) continue;

    validateCopyrightFile(files[i])

    const storageRef = ref(storage, `${path}/${files[i].name}`);
    await uploadBytes(storageRef, files[i]);
  }
};

export const validateCopyrightFile = (file: File) => {
    const maxFileSize = 20 * 1024 * 1024; // 20MB
    const fileTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!fileTypes.includes(file.type)) {
        throw new Error("アップロードできるファイル形式は、JPEG、PNG、PDFのみです");
    }

    if (file.size > maxFileSize) {
        throw new Error("ファイルサイズは20MB以内にしてください");
    }
}

const postTcpData = async (data: TcpFormType) => {
  const postData = {
    ...data,
    copyright: {
      ...data.copyright,
      file1: data.copyright.file1?.name,
      file2: data.copyright.file2?.name,
      file3: data.copyright.file3?.name,
      file4: data.copyright.file4?.name,
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
