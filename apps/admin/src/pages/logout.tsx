import { auth } from "fetchers/firebase/client";
import { useEffect } from "react";

const Logout = () => {
  useEffect(() => {
    // Logout process
    auth.signOut();
  }, []);
  return <div>Logout</div>;
};

export default Logout;
