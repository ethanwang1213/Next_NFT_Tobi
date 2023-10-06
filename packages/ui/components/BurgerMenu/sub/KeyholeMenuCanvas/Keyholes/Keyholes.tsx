import { useEffect, ReactNode, Dispatch, SetStateAction } from "react";
import { menuItem } from "../../../assets/menuItems";
import { KeyholeObject } from "./KeyholeObject";
import { gsap } from "gsap";
import { useGLTF, useTexture } from "@react-three/drei";
import { useWindowSize } from "hooks";
import { useRouter } from "next/router";

type Props = {
  rotate: number;
  downX: number | null;
  setRotate: Dispatch<SetStateAction<number>>;
  initHomeStates?: () => void;
};

/**
 * keyholeを表示するコンポーネント
 *
 * useGLTFはr3fのCanvasコンポーネント内でしか使用できないので、
 * 少しやりすぎ感のあるコンポーネント分割になっている
 * @param param0
 * @returns
 */
export const Keyholes: React.FC<Props> = ({
  rotate,
  downX,
  setRotate,
  initHomeStates,
}) => {
  const router = useRouter();
  const { length } = menuItem.map((item) => item.show).filter((item) => item);
  const { isWide } = useWindowSize();
  const loop = isWide ? 4 : 2;

  const { nodes }: any = useGLTF(
    `${router.basePath ? router.basePath : ""}/menu/keyhole.glb`
  );

  // 自動で定位置まで移動
  useEffect(() => {
    if (!downX) {
      const value = { value: rotate };
      const per = 360 / (length * loop);
      const goal =
        Math.round((rotate % 360) / per) * per + Math.trunc(rotate / 360) * 360;
      gsap.to(value, {
        value: goal,
        duration: 0.2,
        onUpdate() {
          setRotate(value.value);
        },
      });
    }
  }, [downX]);

  // メニュー項目の鍵を一周分追加する
  const createOneLoop = (loop: number, id: number) =>
    menuItem
      .filter((item) => item.show)
      .map(
        (item, index) =>
          item.show && (
            <KeyholeObject
              keyholeNodes={nodes}
              item={{
                name: item.name,
                keyImage: item.keyImage,
                loadImage: item.loadImage,
                link: item.link,
              }}
              index={length * id + index}
              length={length * loop}
              rotate={rotate}
              setRotate={setRotate}
              key={item.name}
              initHomeStates={initHomeStates}
            />
          )
      );

  // メニュー項目の鍵を「項目数 x ループ数」生成する
  const getMenuItems = () => {
    const res: ReactNode[] = [];

    Array(loop)
      .fill(0)
      .map((v, i) => {
        // console.log(v, i)
        res.push(createOneLoop(loop, i));
      });
    return res;
  };

  return <>{getMenuItems()}</>;
};

// モデルとテクスチャのpreload
// useGLTF.preload("/menu/keyhole.glb");
menuItem.forEach((item) => {
  if (item.show) {
    useTexture.preload(item.keyImage);
  }
});
