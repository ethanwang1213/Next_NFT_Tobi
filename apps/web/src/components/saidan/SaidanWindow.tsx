import { useRef } from "react";
import ForbidLandcape from "../home/ui/ForbidLandcape";
import SaidanCanvas from "./canvas/SaidanCanvas";
import SaidanUI from "./ui/SaidanUI";

type Props = {};

/**
 * saidanページの表示をまとめたコンポーネント
 * @param param0
 * @returns
 */
const SaidanWindow: React.FC<Props> = ({ }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <>
      <SaidanCanvas canvasRef={canvasRef} />
      <SaidanUI canvasRef={canvasRef} />
      <ForbidLandcape />
    </>
  );
};

export default SaidanWindow;
