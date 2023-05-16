import {
  getAuth
} from 'firebase/auth'
import { useEffect } from "react";
import { useRouter } from 'next/router';

const Logout = () => {
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await auth.signOut();
        router.push('/login');
      } catch (error) {
        console.error('ログアウトに失敗しました。', error);
      }
    };

    handleLogout();
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-pink-100 gap-10">
      <h1>ログアウト中...</h1>
    </div>
  );
};

export default Logout;
