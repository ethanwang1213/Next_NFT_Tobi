import { Vector3 } from "three";
import { create } from "zustand";
import { RefObject } from "react";
import {
  DEFAULT_CROPPER_PARAMS,
  DEFAULT_POSITION,
  ITEM_TYPE_DATA,
  SAMPLE_ITEMS,
  WALL_OFFSET,
} from "@/constants/saidanConstants";
import {
  getFloorDepthLimit,
  getFloorLeftLimit,
  getFloorNearLimit,
  getFloorRightLimit,
  getWallBottomLimit,
  getWallTopLimit,
} from "@/methods/saidan/getLimits";
import { ItemType } from "@/types/ItemType";
import {
  CropData,
  CropperParams,
  ItemSizeData,
  PlacedItemData,
  SrcItemData,
} from "@/types/PlacedItemData";
import { auth, db } from "fetchers/firebase/client";
import { deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore/lite";
import generateHash from "@/methods/saidan/generateHash";
import getWhitedImageSrc from "@/methods/saidan/whitenImageBg";
import makeImageSquare from "@/methods/saidan/makeImageSquare";
import { MovePointerTargetName } from "@/types/PointerTargetName";

type TutorialPhase =
  | "TITLE"
  | "TERMS"
  | "ZOOM_UP"
  | "OPEN_BAG"
  | "SELECT_ITEM"
  | "ADD_ITEM"
  | "READY"
  | "END";

type TutorialDataType = {
  [phase in TutorialPhase]: TutorialPhase; // eslint-disable-line no-unused-vars
};
const TUTORIAL_NEXT_DATA: TutorialDataType = {
  TITLE: "TERMS",
  TERMS: "ZOOM_UP",
  ZOOM_UP: "OPEN_BAG",
  OPEN_BAG: "SELECT_ITEM",
  SELECT_ITEM: "ADD_ITEM",
  ADD_ITEM: "READY",
  READY: "END",
  END: "END",
};

type MoveState =
  | "NONE"
  | "DIRECT"
  | "DIRECT_MOVING"
  | "RELATIVE"
  | "RELATIVE_MOVING"
  | "MOUSE_SCALE"
  | "MOUSE_SCALING"
  | "DIRECT_MOUSE_SCALE"
  | "DIRECT_MOUSE_SCALING"
  | "PINCH_SCALE"
  | "PINCH_SCALING"
  | "WHEEL_SCALE"
  | "WHEEL_SCALING"
  | "MAC_GESTURE_SCALE"
  | "MAC_GESTURE_SCALING";

type CropSrc = {
  itemType: ItemType;
  imageId: string;
  // pCropperParams: CropperParams
};

export type TextureData = {
  srcId: string;
  srcImage: string;
};

type SaidanState = {
  /* eslint-disable no-unused-vars */

  // tutorial
  tutorialPhase: TutorialPhase;
  canTutorialProceed: boolean;
  setCanTutorialProceed: (b: boolean) => void;
  proceedTutorial: () => void;
  restartTutorial: () => void;
  skipTutorial: () => void;
  isSpotted: boolean;
  setIsSpotted: (b: boolean) => void;
  // bag
  isBagOpen: boolean;
  openBag: () => void;
  closeBag: () => void;
  isBagVisible: boolean;
  hideBag: () => void;
  isTypeModalVisible: boolean;
  typeModalSrcId: number;
  openTypeModal: (id: number) => void;
  closeTypeModal: () => void;

  isPolicyAccepted: boolean;
  acceptPolicy: () => void;
  isPolicyOpen: boolean;
  openPolicy: () => void;
  closePolicy: () => void;
  isPolicyVisible: boolean;
  hidePolicy: () => void;

  // crop
  isCropWindowOpen: boolean;
  cropSrc: CropSrc | null;
  openCropWindow: (cropSrc: CropSrc) => void;
  closeCropWindow: () => void;
  isCropWindowVisible: boolean;
  hideCropWindow: () => void;
  // 次回に同じクロップを繰り返しやすいように、クロップ設定を保存する
  setPCropperParams: (
    imageId: string,
    itemType: ItemType,
    pCropperParams: CropperParams
  ) => void;

  // items
  allSrcs: SrcItemData[];
  imageInputRef: RefObject<HTMLInputElement> | null;
  setImageInputRef: (ref: RefObject<HTMLInputElement>) => void;
  addNewSrc: (srcId: string, imageSrc: string, acstModelSrc?: string) => void;
  setAcstModelSrc: (srcId: string, acstSrc: string) => void;
  setIsAcstAlreadyRequested: (srcId: string, isRequesting: boolean) => void;

  placedItems: PlacedItemData[];
  itemSizeData: ItemSizeData;
  placeNewItem: (
    srcId: string,
    itemType: ItemType,
    needGeneratingTextureSrc: boolean,
    cropData?: CropData,
    itemId?: string
  ) => Promise<void>;
  putBackItem: (id: string) => void;
  selectedItemId: string;
  selectItem: (id: string) => void;
  // addNewSrcImage: (imageSrc: string) => void;
  // removeTexture: (imageSrc: string) => void;
  // move
  moveState: MoveState;
  setMoveState: (move: MoveState) => void;
  isDirectScalePaused: boolean;
  setIsDirectScalePaused: (b: boolean) => void;
  setItemPos: (id: string, pos: Vector3, place: MovePointerTargetName) => void;
  setItemScale: (id: string, scale: number) => void;
  setItemSize: (id: string, size: Vector3) => void;
  isNearByBag: boolean;
  setIsNearByBag: (b: boolean) => void;
  // wall order
  wallOrder: string[]; // id列
  pushWallOrderId: (id: string) => void;
  // removeWallOrderId: (id: number) => void;
  // camera
  isCameraMode: boolean;
  setCameraMode: (b: boolean) => void;
  isCameraMoved: boolean;
  setCameraMoved: (b: boolean) => void;
  // other button
  isOtherOpen: boolean;
  openOther: () => void;
  closeOther: () => void;
  // screen shot
  isScreenShotVisible: boolean;
  openScreenShotResult: () => void;
  closeScreenShotResult: () => void;

  // init at logout
  isSaved: boolean;
  setIsSaved: (b: boolean) => void;
  saveStates: () => Promise<void>;

  // アクスタ生成リクエスト時のモーダルの表示状態を管理する
  isAcstGeneratingMsgShowing: boolean;
  openAcstGeneratingMsg: () => void;
  closeAcstGeneratingMsg: () => void;

  // アクスタ生成リクエスト失敗時のモーダルの表示状態を管理する
  isAcstFailedModalOpen: boolean;
  acstFailedTitle: string;
  acstFailedText: string;
  openAcstFailedModal: (title: string, text: string) => void;
  closeAcstFailedModal: () => void;

  // アクスタ生成リクエストがすでに行われている時のモーダルの表示状態を管理する
  isAcstAlreadyRequestedModalOpen: boolean;
  openAcstAlreadyRequestedModal: () => void;
  closeAcstAlreadyRequestedModal: () => void;

  /* eslint-enable no-unused-vars */
};

const addWallItem = (id: string, wallOrder: string[]) => {
  const newOrder = wallOrder;
  newOrder.push(id);
  return newOrder;
};

const selectWallItem = (id: string, wallOrder: string[]) => {
  const newOrder = wallOrder.filter((v) => v !== id);
  newOrder.push(id);
  return newOrder;
};

const removeWallItem = (id: string, wallOrder: string[]) =>
  wallOrder.filter((v) => v !== id);

const updateWallItems = (
  wallOrder: string[],
  placedItems: PlacedItemData[],
  itemSizeData: ItemSizeData
) => {
  const newItems = placedItems.map((v) => {
    const newItem = v;
    if (v.place === "WALL") {
      const newPos = v.position.clone();
      const size = itemSizeData[v.id];
      const itemYHalf = (size.y * v.scale) / 2.0;
      newPos.z =
        WALL_OFFSET -
        itemYHalf * Math.abs(Math.sin(v.rotation)) -
        wallOrder.findIndex((x) => x === v.id) * 0.01;
      newItem.position = newPos;
      return newItem;
    }
    return newItem;
  });
  return newItems;
};

const limitLeft = (posX: number, itemXHalf: number) => {
  const leftLimit = getFloorLeftLimit(itemXHalf);
  if (posX > leftLimit) {
    return leftLimit;
  }
  return posX;
};

const limitRight = (posX: number, itemXHalf: number) => {
  const rightLimit = getFloorRightLimit(itemXHalf);
  if (posX < rightLimit) {
    return rightLimit;
  }
  return posX;
};

const limitFloorDepth = (
  posZ: number,
  itemOriginY: number,
  itemHeight: number,
  rotation: number,
  wallLength: number
) => {
  const depthLimit = getFloorDepthLimit(
    itemHeight,
    itemOriginY,
    rotation,
    wallLength
  );
  if (posZ > depthLimit) {
    return depthLimit;
  }
  return posZ;
};

const limitFloorNear = (posZ: number) => {
  const nearLimit = getFloorNearLimit();
  if (posZ < nearLimit) {
    return nearLimit;
  }
  return posZ;
};

const limitWallBottom = (
  posY: number,
  itemOriginY: number,
  rotation: number
) => {
  const bottomLimit = getWallBottomLimit(itemOriginY, rotation);
  if (posY < bottomLimit) {
    return bottomLimit;
  }
  return posY;
};

const limitWallTop = (
  posY: number,
  itemOriginY: number,
  itemHeight: number
) => {
  const topLimit = getWallTopLimit(itemOriginY, itemHeight);
  // console.log(posY, itemOriginY, topLimit)
  if (posY > topLimit) {
    return topLimit;
  }
  return posY;
};

const updatePosition = (
  id: string,
  pos: Vector3,
  place: MovePointerTargetName,
  placedItems: PlacedItemData[],
  wallOrder: string[],
  moveState: MoveState,
  itemSizeData: ItemSizeData
) => {
  const index = placedItems.findIndex((v) => v.id === id);
  let newItems = placedItems;
  const item = newItems[index];
  item.position = pos.clone();
  item.place = place;
  item.rotation = ITEM_TYPE_DATA[item.itemType].rotation[place];
  const size = itemSizeData[id];
  const itemXHalf = (size.x * item.scale) / 2.0;
  // const itemYHalf = item.size.y * item.scale / 2.0
  const itemHeight = size.y * item.scale;
  const itemOriginY =
    size.y * item.scale * ITEM_TYPE_DATA[item.itemType].originPosition;

  const itemDepth = size.z * item.scale;

  item.position.x = limitLeft(item.position.x, itemXHalf); // left
  item.position.x = limitRight(item.position.x, itemXHalf); // right

  let newOrder = wallOrder;
  if (item.place === "FLOOR" || item.place === "TOWARDS_BAG") {
    const floor =
      item.itemType === "ACRYLIC_STAND"
        ? -0.01
        : item.itemType === "TIN_BADGE"
          ? 0.06
          : 0.01;
    item.position.y = itemOriginY * Math.cos(item.rotation) + floor; // y1
    item.position.z = limitFloorDepth(
      item.position.z,
      itemOriginY,
      itemHeight,
      item.rotation,
      wallOrder.length
    ); // depth
    if (moveState === "RELATIVE_MOVING") {
      item.position.z = limitFloorNear(item.position.z); // near
    }
    // 壁から離れたときにwallOrderから排除
    if (wallOrder.length > 0 && wallOrder[wallOrder.length - 1] === id) {
      newOrder = removeWallItem(id, wallOrder);
    }
  } else if (item.place === "WALL") {
    item.position.y = limitWallBottom(
      item.position.y,
      itemOriginY,
      item.rotation
    ); // bottom
    item.position.y = limitWallTop(item.position.y, itemOriginY, itemHeight); // top
    // wallOrder
    if (wallOrder.length > 0 && wallOrder[wallOrder.length - 1] !== id) {
      newOrder = selectWallItem(id, newOrder);
      newItems = updateWallItems(newOrder, newItems, itemSizeData);
    }
    item.position.z =
      WALL_OFFSET -
      (itemHeight - itemOriginY) * Math.abs(Math.sin(item.rotation)) -
      (newOrder.length - 1) * 0.01; // z
  }

  // 配置可能範囲外での表示処理
  item.isInLimitedPlace =
    item.place === ITEM_TYPE_DATA[item.itemType].placeLimit ||
    item.place === "TOWARDS_BAG";
  return { positionedItems: newItems, positionedOrder: newOrder };
};

const useSaidanStore = create<SaidanState>((set) => ({
  // tutorial
  tutorialPhase: "TITLE",
  canTutorialProceed: false,
  setCanTutorialProceed: (b) => set(() => ({ canTutorialProceed: b })),
  proceedTutorial: () =>
    set((state) => {
      if (!state.canTutorialProceed) return {};
      const tutorialPhase = TUTORIAL_NEXT_DATA[state.tutorialPhase];
      if (state.tutorialPhase === "ADD_ITEM") {
        return { tutorialPhase, isSpotted: false };
      }
      if (state.tutorialPhase === "READY") {
        if (auth.currentUser) {
          const ref = doc(db, `users/${auth.currentUser.uid}`);
          updateDoc(ref, { isSkipTutorial: true });
        }
        return { tutorialPhase, isSpotted: true };
      }
      return { tutorialPhase };
    }),
  restartTutorial: () =>
    set(() => {
      // チュートリアル完了情報を更新
      if (auth.currentUser) {
        const ref = doc(db, `users/${auth.currentUser.uid}`);
        updateDoc(ref, { isSkipTutorial: false });
      }
      return { tutorialPhase: "TITLE" };
    }),
  skipTutorial: () =>
    set(() => {
      if (auth.currentUser) {
        const ref = doc(db, `users/${auth.currentUser.uid}`);
        updateDoc(ref, { isSkipTutorial: true });
      }
      return { tutorialPhase: "END", isSpotted: true };
    }),
  isSpotted: true,
  setIsSpotted: (b) => set(() => ({ isSpotted: b })),
  // bag
  isBagOpen: false,
  isBagVisible: false,
  openBag: () => set(() => ({ isBagOpen: true, isBagVisible: true })),
  closeBag: () => set(() => ({ isBagOpen: false })),
  hideBag: () => set(() => ({ isBagVisible: false })),
  isTypeModalVisible: false,
  typeModalSrcId: -1,
  openTypeModal: (id) =>
    set(() => ({ isTypeModalVisible: true, typeModalSrcId: id })),
  closeTypeModal: () => set(() => ({ isTypeModalVisible: false })),

  isPolicyAccepted: false,
  acceptPolicy: () => set(() => ({ isPolicyAccepted: true })),
  isPolicyOpen: false,
  isPolicyVisible: false,
  openPolicy: () => set(() => ({ isPolicyOpen: true, isPolicyVisible: true })),
  closePolicy: () => set(() => ({ isPolicyOpen: false })),
  hidePolicy: () => set(() => ({ isPolicyVisible: false })),
  // crop
  isCropWindowOpen: false,
  isCropWindowVisible: false,
  cropSrc: null,
  openCropWindow: (cropSrc) =>
    set(() => ({ isCropWindowOpen: true, isCropWindowVisible: true, cropSrc })),
  closeCropWindow: () =>
    set(() => ({ isCropWindowOpen: false, cropSrc: null })),
  hideCropWindow: () => set(() => ({ isCropWindowVisible: false })),
  // 次回に同じクロップを繰り返しやすいように、クロップ設定を保存する
  setPCropperParams: (imageId, itemType, pCropperParams) => {
    set((state) => {
      if (itemType === "ACRYLIC_STAND") return {};
      const newSrcs = [...state.allSrcs];
      const src = newSrcs.find((v) => v.id === imageId);
      if (!src) return {};
      src.pCropperParams[itemType] = pCropperParams;
      return {
        allSrcs: newSrcs,
      };
    });
  },

  allSrcs: SAMPLE_ITEMS.map((v) => ({ ...v, isSample: true })),
  imageInputRef: null,
  setImageInputRef: (ref) => set(() => ({ imageInputRef: ref })),
  addNewSrc: (srcId, imageSrc, acstModelSrc?) => {
    set((state) => {
      const newSrcs = [...state.allSrcs];

      const acst = !acstModelSrc || acstModelSrc === "" ? "" : acstModelSrc;

      newSrcs.push({
        id: srcId,
        isSample: false,
        imageSrc,
        // squareImageSrc,
        // whitedImageSrc,
        squareImageSrc: "",
        whitedImageSrc: "",
        acstModelSrc: acst,
        isAcstAlreadyRequested: false,
        pCropperParams: {
          TIN_BADGE: DEFAULT_CROPPER_PARAMS,
          POSTER: DEFAULT_CROPPER_PARAMS,
        },
      });
      // console.log(newSrcs)
      return {
        allSrcs: newSrcs,
      };
    });
  },
  setAcstModelSrc: (srcId, acstSrc) =>
    set((state) => {
      const newSrcs = [...state.allSrcs];
      const targetSrc = newSrcs.find((v) => v.id === srcId);
      if (!targetSrc) return {};
      targetSrc.acstModelSrc = acstSrc;
      return { allSrcs: newSrcs };
    }),
  setIsAcstAlreadyRequested: (srcId, isRequesting) =>
    set((state) => {
      const newSrcs = [...state.allSrcs];
      const targetSrc = newSrcs.find((v) => v.id === srcId);
      if (!targetSrc) return {};
      targetSrc.isAcstAlreadyRequested = isRequesting;
      return { allSrcs: newSrcs };
    }),
  placedItems: [],
  itemSizeData: {},
  placeNewItem: async (
    srcId,
    itemType,
    needGeneratingTextureSrc: boolean,
    cropData?: CropData,
    itemId?: string
  ) => {
    let newSrcs: SrcItemData[] = [];
    set((state) => {
      newSrcs = [...state.allSrcs];
      return {};
    });
    // let generatedImageSrc = '';
    if (needGeneratingTextureSrc) {
      const src = newSrcs.find((v) => v.id === srcId);
      if (src) {
        if (itemType === "ACRYLIC_STAND") {
          // await generateSquareImage
          // アクスタ用に正方形化した画像を用意する。
          const square = await makeImageSquare(src.imageSrc);
          // generatedImageSrc =
          src.squareImageSrc = await square.getBase64Async("image/jpeg");
        } else {
          // await generateWhitedImage
          // 缶バッジ・ポスター用に背景を白色にした画像を用意する。
          // generatedImageSrc =
          src.whitedImageSrc = await getWhitedImageSrc(src.imageSrc);
        }
      }
    }

    // itemId指定あり：データベースからの追加
    // itemId指定なし：新規追加
    const newId: string =
      itemId !== undefined && itemId !== "" ? itemId : await generateHash();

    set((state) => {
      let newItems = state.placedItems;

      // ポスターグッズの時は、壁に生成するので、壁のグッズ前後用のレイヤーを更新する
      if (itemType === "POSTER") {
        const newOrder = addWallItem(newId, state.wallOrder);
        newItems = updateWallItems(
          newOrder,
          state.placedItems,
          state.itemSizeData
        );
      }

      const place = ITEM_TYPE_DATA[itemType].initialPlace;
      const rotation = ITEM_TYPE_DATA[itemType].rotation[place];
      const position = DEFAULT_POSITION[place].clone();
      const scale = ITEM_TYPE_DATA[itemType].defaultScale;

      newItems.push({
        id: newId,
        srcId,
        itemType,
        position,
        scale,
        rotation,
        place,
        isInLimitedPlace: false,
        cropData,
      });

      const newSizeData = state.itemSizeData;
      newSizeData[newId] = new Vector3(0);

      return {
        allSrcs: newSrcs,
        placedItems: newItems,
        // totalPlacedCount: nextTotalPlacedCount,
        selectedItemId: newId,
        itemSizeData: newSizeData,
        isCameraMode: false,
        isSaved: false,
      };
    });
  },
  putBackItem: (id) =>
    set((state) => {
      const newItems = state.placedItems.filter((v) => v.id !== id);
      if (auth.currentUser) {
        const { uid } = auth.currentUser;
        const usersItemRef = doc(db, `users/${uid}/item/${id}`);
        deleteDoc(usersItemRef);
      }

      return {
        placedItems: newItems,
        selectedItemId: "",
        moveState: "NONE",
        isNearByBag: false,
        isSaved: false,
      };
    }),
  selectedItemId: "",
  selectItem: (id) =>
    set((state) => {
      const item = state.placedItems.find((v) => v.id === id);
      if (
        item &&
        item.place === "WALL" &&
        state.wallOrder[state.wallOrder.length - 1] !== id
      ) {
        const newOrder = selectWallItem(id, state.wallOrder);
        const newItems = updateWallItems(
          newOrder,
          state.placedItems,
          state.itemSizeData
        );
        return {
          selectedItemId: id,
          wallOrder: newOrder,
          placedItems: newItems,
        };
      }
      return { selectedItemId: id };
    }),
  // move
  moveState: "NONE",
  setMoveState: (move) =>
    set((state) => {
      // 配置可能範囲外で移動が終了した場合の処理
      const newItems = [...state.placedItems];
      if (move === "NONE" && state.selectedItemId !== "") {
        const index = newItems.findIndex(
          (v) =>
            // console.log(v.id, state.selectedItemId)
            v.id === state.selectedItemId
        );
        const item = newItems[index];
        if (item && item.isInLimitedPlace) {
          const { placeLimit } = ITEM_TYPE_DATA[item.itemType];
          // const size = state.itemSizeData[index];
          const size = state.itemSizeData[state.selectedItemId];
          const itemYHalf = (size.y * item.scale) / 2.0;
          // item.position.y = itemYHalf * Math.abs(Math.cos(item.rotation));
          const itemOriginY =
            size.y * item.scale * ITEM_TYPE_DATA[item.itemType].originPosition;
          item.position.y =
            0.05 + itemOriginY * Math.abs(Math.cos(item.rotation));
          if (placeLimit === "FLOOR") {
            // 壁へ移動
            item.position.z = -size.z / 2.0;
            item.place = "WALL";
          } else if (placeLimit === "WALL" || placeLimit === "NONE") {
            // 床へ移動
            item.position.z =
              -4.8 + itemYHalf * Math.abs(Math.sin(item.rotation));
            // console.log(itemYHalf * Math.abs(Math.sin(item.rotation)))
            item.place = "FLOOR";
          }
        }
        newItems[index].position = item.position.clone();
        newItems[index].isInLimitedPlace = false;
      }
      return { moveState: move, placedItems: newItems };
    }),
  isDirectScalePaused: false,
  setIsDirectScalePaused: (b) => set((state) => ({ isDirectScalePaused: b })),
  setItemPos: (id, pos, place) =>
    set((state) => {
      const { positionedItems, positionedOrder } = updatePosition(
        id,
        pos,
        place,
        state.placedItems,
        state.wallOrder,
        state.moveState,
        state.itemSizeData
      );
      return {
        placedItems: positionedItems,
        wallOrder: positionedOrder,
        isSaved: false,
      };
    }),
  setItemScale: (id, scale) =>
    set((state) => {
      if (
        scale * state.itemSizeData[id].x > 5.0 ||
        scale * state.itemSizeData[id].y > 5.0 ||
        scale * state.itemSizeData[id].z > 5.0
      ) {
        return {};
      }
      const index = state.placedItems.findIndex((v) => v.id === id);
      const newItems = state.placedItems;
      newItems[index].scale = scale;
      return { placedItems: newItems, isSaved: false };
    }),
  setItemSize: (id, size) =>
    set((state) => {
      const index = state.placedItems.findIndex((v) => v.id === id);
      const newSizeData = state.itemSizeData;
      newSizeData[id] = size;

      const newItems = state.placedItems;
      // newItems[index].size = size;
      const { positionedItems, positionedOrder } = updatePosition(
        id,
        newItems[index].position,
        newItems[index].place,
        newItems,
        state.wallOrder,
        state.moveState,
        newSizeData
      );
      // console.log("じゃんばらや", newSizeData);
      return {
        placedItems: positionedItems,
        itemSizeData: newSizeData,
        wallOrder: positionedOrder,
        isSaved: false,
      };
      // return { itemSizeData: newSizeData,  }
    }),
  isNearByBag: false,
  setIsNearByBag: (b) => set(() => ({ isNearByBag: b })),
  // wall order
  wallOrder: [],
  pushWallOrderId: (id) =>
    set((state) => {
      const newOrder = state.wallOrder;
      newOrder.push(id);
      return { wallOrder: newOrder };
    }),
  // camera
  isCameraMode: false,
  setCameraMode: (b) => set(() => ({ isCameraMode: b })),
  isCameraMoved: false,
  setCameraMoved: (b) => set(() => ({ isCameraMoved: b })),
  // other
  isOtherOpen: false,
  openOther: () => set(() => ({ isOtherOpen: true })),
  closeOther: () => set(() => ({ isOtherOpen: false })),
  // screenshot
  isScreenShotVisible: false,
  openScreenShotResult: () => set(() => ({ isScreenShotVisible: true })),
  closeScreenShotResult: () => set(() => ({ isScreenShotVisible: false })),

  // dbへの保存処理
  isSaved: true,
  setIsSaved: (b) => set(() => ({ isSaved: b })),
  saveStates: async () => {
    let placedItems: PlacedItemData[] = [];
    let allSrcs: SrcItemData[] = [];
    set((state) => {
      placedItems = state.placedItems;
      allSrcs = state.allSrcs;
      return { isSaved: true };
    });

    if (auth.currentUser) {
      const { uid } = auth.currentUser;
      await Promise.all(
        placedItems.map(async (item, i) => {
          const usersItemRef = doc(db, `users/${uid}/item/${item.id}`);
          const res = await setDoc(usersItemRef, {
            srcId: item.srcId,
            itemType: item.itemType.toString(),
            scale: item.scale,
            position: {
              x: item.position.x,
              y: item.position.y,
              z: item.position.z,
            },
            cropData: item.cropData || {},
            place: item.place.toString(),
          });
          return res;
        })
      );

      // await Promise.all(allSrcs.map(async (src, id) => {
      //   const usersSrcRef = doc(db, `users/${uid}/src/${src.id}`);
      //   return await setDoc(usersSrcRef, {
      //     pCropperParams: src.pCropperParams,
      //   }, { merge: true });
      // }))
    }
  },

  // アクスタ生成リクエスト時のモーダルの表示状態を管理する
  isAcstGeneratingMsgShowing: false,
  openAcstGeneratingMsg: () =>
    set((state) => ({
      isAcstGeneratingMsgShowing: true,
      // 他モーダルを閉じる
      isAcstFailedModalOpen: false,
      isAcstAlreadyRequestedModalOpen: false,
    })),
  closeAcstGeneratingMsg: () =>
    set((state) => ({ isAcstGeneratingMsgShowing: false })),

  // アクスタ生成リクエスト失敗時のモーダルの表示状態を管理する
  isAcstFailedModalOpen: false,
  acstFailedTitle: "",
  acstFailedText: "",
  openAcstFailedModal: (title: string, text: string) =>
    set((state) => ({
      isAcstFailedModalOpen: true,
      acstFailedTitle: title,
      acstFailedText: text,
      // 他モーダルを閉じる
      isAcstGeneratingMsgShowing: false,
      isAcstAlreadyRequestedModalOpen: false,
    })),
  closeAcstFailedModal: () =>
    set((state) => ({ isAcstFailedModalOpen: false })),

  // アクスタ生成リクエストがすでに行われている時のモーダルの表示状態を管理する
  isAcstAlreadyRequestedModalOpen: false,
  openAcstAlreadyRequestedModal: () =>
    set((state) => ({
      isAcstAlreadyRequestedModalOpen: true,
      // 他モーダルを閉じる
      // isAcstGeneratingMsgShowing: false,
      isAcstFailedModalOpen: false,
    })),
  closeAcstAlreadyRequestedModal: () =>
    set((state) => ({ isAcstAlreadyRequestedModalOpen: false })),
}));

export default useSaidanStore;
