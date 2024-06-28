import { useKeyPress } from "react-use";

const useWASDKeys = () => {
  const [wPressed] = useKeyPress("w");
  const [aPressed] = useKeyPress("a");
  const [sPressed] = useKeyPress("s");
  const [dPressed] = useKeyPress("d");

  return {
    wKey: wPressed,
    aKey: aPressed,
    sKey: sPressed,
    dKey: dPressed,
  };
};

export default useWASDKeys;
