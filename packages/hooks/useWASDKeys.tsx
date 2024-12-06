import { useKeyPress } from "react-use";

const useWASDKeys = () => {
  const [wPressed] = useKeyPress("w");
  const [aPressed] = useKeyPress("a");
  const [sPressed] = useKeyPress("s");
  const [dPressed] = useKeyPress("d");

  const [arrowUpPressed] = useKeyPress("ArrowUp");
  const [arrowLeftPressed] = useKeyPress("ArrowLeft");
  const [arrowDownPressed] = useKeyPress("ArrowDown");
  const [arrowRightPressed] = useKeyPress("ArrowRight");

  return {
    wKey: wPressed || arrowUpPressed,
    aKey: aPressed || arrowLeftPressed,
    sKey: sPressed || arrowDownPressed,
    dKey: dPressed || arrowRightPressed,
  };
};

export default useWASDKeys;
