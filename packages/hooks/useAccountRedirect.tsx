import { useAuth } from "contexts/AdminAuthProvider";
import { doc, getDoc } from "firebase/firestore/lite";
import { useRouter } from "next/router";
import { useEffect } from "react";

const useAccountRedirect = (auth, db) => {
  const router = useRouter();
  const { user } = useAuth();
  useEffect(() => {
    let interval;

    const fetchAccountData = async () => {
      if (auth.currentUser && auth.currentUser.uid) {
        const { uid } = auth.currentUser;
        const accountRef = doc(db, `businessAccount/${uid}`);

        const snapshot = await getDoc(accountRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.cmsApprove) {
            user.hasBusinessAccount = "exist";
            router.push("/items");
          } else if (data.cmsApprove === false) {
            user.hasBusinessAccount = "rejected";
            router.push("/apply/contentRejected");
          }
        }
      }
    };

    fetchAccountData();

    interval = setInterval(fetchAccountData, 5000);

    return () => clearInterval(interval);
  }, [auth.currentUser, db, router, user]);
};

export default useAccountRedirect;
