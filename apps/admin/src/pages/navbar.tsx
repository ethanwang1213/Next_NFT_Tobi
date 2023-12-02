import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();
  return (
    <div className="navbar bg-neutral shadow-xl">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl">Tobiratory</a>
      </div>
      <div className="navbar-center">
        <div className="form-control">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Tobiratory.com で検索"
              className="rounded-full w-98 block p-4 ps-10 text-sm text-gray-900 border border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500rounded-full"
            />
          </div>
        </div>
      </div>
      <div className="navbar-end">
        <button
          className="btn btn-primary rounded-full w-40 text-neutral"
          onClick={() => router.replace("/logout")} // TODO: デバッグ用にlogoutにしているので、後で直す
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default Navbar;
