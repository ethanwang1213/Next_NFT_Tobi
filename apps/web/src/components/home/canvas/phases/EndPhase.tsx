import { SpringValue } from "@react-spring/three";
import { useEffect, useState } from "react";
import { VideoTexture } from "three";
import useHomeStore from "@/stores/homeStore";
import AMeshBasicMaterial from "../animatedThrees/AMeshBasicMaterial";

type Props = {
  isVideoStarted: boolean;
  start: SpringValue<number>;
};

/**
 * end 扉を開く動画の表示
 */
const EndPhase = ({ isVideoStarted, start }: Props) => {
  const endVideoRef = useHomeStore((state) => state.endVideoRef);

  // const texture = useVideoTexture('/home/end/end.mp4')

  const [videoTexture, setVideoTexture] = useState<VideoTexture>();
  const w = (1920 * innerHeight) / 1080;
  const h = innerHeight;

  useEffect(() => {
    if (!isVideoStarted) return;
    if (!endVideoRef || !endVideoRef.current) return;
    endVideoRef.current.play().then(() => {
      if (!endVideoRef || !endVideoRef.current) return;
      setVideoTexture(new VideoTexture(endVideoRef.current));
    });
  }, [isVideoStarted]);

  return (
    <>
      {videoTexture && (
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[w, h]} />
          <AMeshBasicMaterial map={videoTexture} opacity={start.to((v) => v)} />
        </mesh>
      )}
    </>
  );
};

export default EndPhase;
