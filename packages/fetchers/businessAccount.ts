import { ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { TcpFormType } from "types/adminTypes";
import { auth, storage } from "./firebase/client";

export const useTcpRegistration = () => {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
      setResponse({});
      return false;
      const res = await postTcpData(data);
      if (res.ok) {
        const resData = await res.json();
        setResponse(resData);
      } else {
        const resData = await res.text();
        setError(resData);
      }
    } catch (error) {
      setError(String(error));
    }
    setLoading(false);
  };

  return [registerTcp, response, loading, error] as const;
};

const uploadFiles = async (files: File[], path: string) => {
  for (let i = 0; i < files.length; i++) {
    if (!files[i]) {
      return;
    }
    const storageRef = ref(storage, `${path}/copyright_${i}`);
    await uploadBytes(storageRef, files[i]);
  };
};

const postTcpData = async (data: TcpFormType) => {
  const postData = {
    ...data,
    copyright: {
      ...data.copyright,
      file1: data.copyright.file1?.name,
      file2: data.copyright.file1?.name,
      file3: data.copyright.file1?.name,
      file4: data.copyright.file1?.name,
    },
  };
  const idToken = await auth.currentUser.getIdToken();
  return await fetch(`/backend/api/functions/native/my/business/submission`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};
