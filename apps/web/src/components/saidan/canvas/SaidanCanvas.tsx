import {
  collection,
  DocumentData,
  getDocs,
  QueryDocumentSnapshot,
} from "@firebase/firestore";
import { Canvas } from "@react-three/fiber";
import {
  RefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Camera, Group, Raycaster, Vector3 } from "three";
import { useGesture } from "@use-gesture/react";
import useSaidanStore from "@/stores/saidanStore";
import useRelativeMove from "@/hooks/useRelativeMove";
import useDirectMove from "@/hooks/useDirectMove";
import useMouseScale from "@/hooks/useMouseScale";
import usePinchScale from "@/hooks/usePinchScale";
import useWheelScale from "@/hooks/useWheelScale";
import { db } from "@/../firebase/client";
import { ItemType } from "@/types/ItemType";
import { DBItemData } from "@/types/PlacedItemData";
import _, { round } from "lodash";
import useMacGestureScale from "@/hooks/useMacGestureScale";
import useIntervalBySec from "@/hooks/useIntervalSave";
import useDirectScale from "@/hooks/useDirectScale";
import { DirectControlProvider } from "@/context/directControl";
import { useAuth } from "../../../context/auth";
import CameraContainer from "./CameraContainer";
import Shelf from "./Shelf";
import PlacedItems from "./placedItem/PlacedItems";
import MovePointerTarget from "./placedItem/pointerTarget/MovePointerTarget";
import { useWindowSize } from "ui";
import isSpLandscape from "@/methods/home/isSpLandscape";
import { useCanvasDprContext } from "ui/contexts/canvasDprContext";
import { PerformanceMonitor } from "@react-three/drei";

type SaidanCanvasProps = {
  canvasRef: RefObject<HTMLCanvasElement>;
};

let isAddedItemsWhenLoad = false;

/**
 * saidanページのキャンバスを表示するコンポーネント
 */
const SaidanCanvas = ({ canvasRef }: SaidanCanvasProps) => {
  const auth = useAuth();

  const isCameraMode = useSaidanStore((state) => state.isCameraMode);
  const setCameraMode = useSaidanStore((state) => state.setCameraMode);
  const setCameraMoved = useSaidanStore((state) => state.setCameraMoved);
  const selectItem = useSaidanStore((state) => state.selectItem);
  const addNewSrc = useSaidanStore((state) => state.addNewSrc);
  const saveStates = useSaidanStore((state) => state.saveStates);
  const placeNewItem = useSaidanStore((state) => state.placeNewItem);
  const setItemPos = useSaidanStore((state) => state.setItemPos);
  const setPCropperParams = useSaidanStore((state) => state.setPCropperParams);
  const setItemScale = useSaidanStore((state) => state.setItemScale);
  const isSaved = useSaidanStore((state) => state.isSaved);

  // スマホでの横向き表示禁止
  const { displayWidth, displayHeight } = useWindowSize();
  const [isForbiddenDeviceRot, setIsForbiddenDeviceRot] = useState(false);

  useEffect(() => {
    setIsForbiddenDeviceRot(isSpLandscape(window, displayWidth, displayHeight));
  }, [displayWidth, displayHeight]);

  // ユーザー操作に関する定義
  const { handleRelativeMove } = useRelativeMove();
  const raycaster = useMemo(() => new Raycaster(), []);
  const cameraRef = useRef<Camera>(null);
  const movePointerTargetRef = useRef<Group>(null!);
  const { handleDirectDown, handleDirectMove } = useDirectMove({
    raycaster,
    cameraRef,
    movePointerTargetRef,
  });
  const { handleScaleMove } = useMouseScale();
  const scalePointerTargetRef = useRef<Group>(null!);
  const { handleDirectScaleDown, handleDirectScaleMove } = useDirectScale({
    raycaster,
    cameraRef,
    scalePointerTargetRef,
  });
  const { handleScalePinch } = usePinchScale();
  const { handleScaleWheel } = useWheelScale();
  const bind = useGesture(
    {
      onDrag: (state) => {
        // console.log('drag', state.delta)
        if (isCameraMode && !state.last) {
          setCameraMoved(!state.first);
        }
        if (state.pinching) {
          state.cancel();
          return;
        }
        handleDirectMove(state);
        handleDirectScaleMove(state);
        handleRelativeMove(state);
        handleScaleMove(state);
      },
      onPinch: (state) => {
        // console.log('pinch', state.delta)
        handleScalePinch(state);
      },
      onWheel: (state) => {
        // console.log('wheel', state.delta)
        handleScaleWheel(state);
      },
    },
    { drag: { pointer: { buttons: [1, 2] } } }
  );
  // Macのジェスチャーによるスケーリング
  useMacGestureScale();

  // 状態のロード処理
  const getSrcs = async () => {
    // ユーザーのSrc一覧を取得
    if (auth) {
      const srcSnapshots = await getDocs(
        collection(db, "users", auth.id, "src")
      );

      // forEachがawait効かないので、
      // 一旦別のリストに入れてからfor ofでawait
      const srcs: DocumentData[] = [];
      srcSnapshots.forEach((src) => {
        srcs.push({ id: src.id, data: src.data() });
      });
      // 投稿順に整列して画像追加処理
      _.orderBy(srcs, "data.createdAt", "asc").map((src) => {
        if (src.data.imageSrc) {
          addNewSrc(src.id, src.data.imageSrc, src.data.modelSrc);
        }
        if (src.data.pCropperParams) {
          if (src.data.pCropperParams.TIN_BADGE) {
            setPCropperParams(
              src.id,
              "TIN_BADGE",
              src.data.pCropperParams.TIN_BADGE
            );
          }
          if (src.data.pCropperParams.POSTER) {
            setPCropperParams(src.id, "POSTER", src.data.pCropperParams.POSTER);
          }
        }
      });
    }
  };

  const getItems = async () => {
    // ユーザーのItem一覧を取得
    if (auth) {
      const itemSnapshots = await getDocs(
        collection(db, "users", auth.id, "item")
      );

      // forEachがawait効かないので、
      // 一旦別のリストに入れてからfor ofでawait

      // const items: QueryDocumentSnapshot<DocumentData>[] = [];
      const registeredStrings = new Set(); // すでに画像生成が予定されているグッズタイプかどうかを判定するためのSet
      const firstItems: QueryDocumentSnapshot<DocumentData>[] = []; // 優先して処理すべき、画像生成を伴うグッズ生成用のデータ配列
      const laterItems: QueryDocumentSnapshot<DocumentData>[] = []; // 従属して処理される、画像生成を伴わないグッズ生成用のデータ配列

      itemSnapshots.forEach((item) => {
        const srcId = item.data().srcId as string;
        const itemType = item.data().itemType as ItemType;
        // チェック用文字列 /id[sq|wh]/
        // sq:アクスタ用、wh:缶バッジ,ポスター用
        const checkString = `${srcId}${
          itemType === "ACRYLIC_STAND" ? "sq" : "wh"
        }`;
        if (registeredStrings.has(checkString)) {
          // すでに画像生成が予定されている場合
          laterItems.push(item);
        } else {
          // まだ画像生成が予定されていない場合
          firstItems.push(item);
          registeredStrings.add(checkString);
        }
      });

      // itemTypeに応じて必要な画像生成を行ったうえでグッズを生成
      await Promise.all(
        firstItems.map(async (item) => {
          const itemId = item.id;
          const { srcId, itemType, position, scale, place, cropData } =
            item.data() as DBItemData;
          if (srcId !== "" && itemType && position && scale && place) {
            const posVec = new Vector3(position.x, position.y, position.z);
            await placeNewItem(srcId, itemType, true, cropData, itemId);
            setItemPos(itemId, posVec, place);
            setItemScale(itemId, scale);
          }
        })
      );
      // 画像生成は伴わずにグッズを生成
      await Promise.all(
        laterItems.map(async (item) => {
          const itemId = item.id;
          const { srcId, itemType, position, scale, place, cropData } =
            item.data() as DBItemData;
          if (srcId !== "" && itemType && position && scale && place) {
            const posVec = new Vector3(position.x, position.y, position.z);
            await placeNewItem(srcId, itemType, false, cropData, itemId);
            setItemPos(itemId, posVec, place);
            setItemScale(itemId, scale);
          }
        })
      );
    }
  };
  async function addItemsWhenLoad() {
    if (auth && !isAddedItemsWhenLoad) {
      await getSrcs();
      getItems();
      isAddedItemsWhenLoad = true;
    }
  }
  useEffect(() => {
    addItemsWhenLoad();
  }, [auth]);

  // グッズの配置に変更があれば、10秒に一回dbへ保存
  useIntervalBySec(() => {
    if (!isSaved) {
      // console.log("saving");
      saveStates();
    } else {
      // console.log("not save");
    }
  }, 10);

  // 入室時はカメラモードに
  useEffect(() => {
    setCameraMode(true);
  }, []);

  // dprの取得
  const { dpr, setMonitorFactor } = useCanvasDprContext();

  return (
    /* eslint-disable react/no-unknown-property */
    <div
      className="absolute z-0"
      style={{
        // DirectScalePointに記述しているHtmlの表示が、
        // Canvasのw,hが奇数だとなぜか縦,横にズレるので偶数に整えている
        width: Math.trunc(displayWidth / 2) * 2,
        height: Math.trunc(displayHeight / 2) * 2,
      }}
    >
      <Canvas
        ref={canvasRef}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        raycaster={raycaster}
        dpr={dpr}
        flat
        {...bind()}
        onPointerMissed={() => selectItem("")}
      >
        <PerformanceMonitor
          onChange={({ factor }) => {
            // console.log("factor: " + factor);
            setMonitorFactor(factor);
            // round((0.3 + 0.7 * factor) * window.devicePixelRatio, 1)
          }}
        />
        {/* <color attach="background" args={['#eee']} /> */}
        <ambientLight position={[10, 20, 10]} intensity={0.5} />
        <pointLight position={[2, 3, -8]} intensity={0.1} />
        <pointLight position={[-2, 3, -8]} intensity={0.1} />
        <pointLight position={[4, 8, -8]} intensity={0.2} />
        <pointLight position={[-4, 8, -8]} intensity={0.2} />
        <CameraContainer cameraRef={cameraRef} />
        {!isForbiddenDeviceRot && (
          <>
            <Shelf />
            <DirectControlProvider
              controls={{
                handleDirectMoveDown: handleDirectDown,
                handleDirectScaleDown,
                scalePointerTargetRef,
              }}
            >
              <PlacedItems />
            </DirectControlProvider>
            <MovePointerTarget movePointerTargetRef={movePointerTargetRef} />
          </>
        )}
      </Canvas>
    </div>
    /* eslint-enable react/no-unknown-property */
  );
};

export default SaidanCanvas;
