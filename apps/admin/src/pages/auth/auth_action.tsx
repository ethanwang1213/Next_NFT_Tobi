import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AuthAction = () => {
  const router = useRouter();
  const { mode, oobCode, lang } = router.query;
  const [message, setMessage] = useState("Verifying email...");

  useEffect(() => {
    if (!router.isReady) return;
    if (!mode || !oobCode || typeof oobCode !== "string") {
      setMessage("Invalid or expired verification link.");
      return;
    }

    if (mode === "verifyEmail") {
      setTimeout(() => router.push(`/${lang}/auth/verified_email`), 2000);
    }
  }, [mode, oobCode, router]);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
};

export default AuthAction;
