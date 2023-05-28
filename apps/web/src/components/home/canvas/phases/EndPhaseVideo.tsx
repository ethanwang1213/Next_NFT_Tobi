import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import useHomeStore from "@/stores/homeStore";

/**
 * homeラストで再生する扉が開く動画のコンポーネント
 *
 * webGL上に表示するためにvideo要素の用意が必要
 * video要素としては0pxで見えないようにしている
 * @returns
 */
const EndPhaseVideo = () => {
  const endVideoRef = useHomeStore((state) => state.endVideoRef);
  const setEndVideoRef = useHomeStore((state) => state.setEndVideoRef);
  const initHomeStates = useHomeStore((state) => state.initStates);

  const router = useRouter();

  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.pause();
    setEndVideoRef(ref);
  }, [endVideoRef]);

  const handleEnded = async () => {
    await router.push("/saidan");
    initHomeStates();
  };

  return (
    <video
      ref={ref}
      onEnded={handleEnded}
      muted
      autoPlay
      playsInline
      style={{
        position: "absolute",
        left: "0%",
        top: "0%",
        width: "0%",
        height: "0%",
      }}
    >
      <source src="/home/end/open_the_tobira.mp4" type="video/mp4" />
    </video>
  );
};

export default EndPhaseVideo;
