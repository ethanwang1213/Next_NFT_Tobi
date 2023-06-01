import { Vector3 } from "three";
import { ItemType } from "@/types/ItemType";
import { CropperParams, SrcItemData } from "@/types/PlacedItemData";
import { MovePointerTargetName } from "@/types/PointerTargetName";

export const FLOOR_OFFSET = 0.3;
export const WALL_OFFSET = -0.02;
export const MOVE_RATE_X = 200;
export const MOVE_RATE_YZ = 150;

export const GRAY_COLOR = "#414142";

export const DEBUG_MODE = false;

type PlaceType = "FLOOR" | "WALL";
type PlaceLimit = "NONE" | "FLOOR" | "WALL";
type ItemTypeData = {
  [itemType in ItemType]: {
    // eslint-disable-line no-unused-vars
    placeLimit: PlaceLimit;
    defaultScale: number;
    maxScale: number;
    minScale: number;
    rotation: {
      [place in MovePointerTargetName]: number; // eslint-disable-line no-unused-vars
    };
    originPosition: number; // position of origin point. bottom is 0, center is 1/2, and top is 1
    initialPlace: PlaceType;
  };
};
export const ITEM_TYPE_DATA: ItemTypeData = {
  ACRYLIC_STAND: {
    placeLimit: "WALL",
    defaultScale: 0.5,
    maxScale: 1.5,
    minScale: 0.2,
    rotation: {
      FLOOR: 0,
      TOWARDS_BAG: 0,
      WALL: 0,
    },
    originPosition: 0,
    initialPlace: "FLOOR",
  },
  TIN_BADGE: {
    placeLimit: "NONE",
    defaultScale: 0.3,
    maxScale: 0.5,
    minScale: 0.2,
    rotation: {
      FLOOR: (Math.PI * 1) / 3,
      TOWARDS_BAG: (Math.PI * 1) / 3,
      WALL: 0,
    },
    originPosition: 0,
    initialPlace: "FLOOR",
  },
  POSTER: {
    placeLimit: "FLOOR",
    defaultScale: 1.0,
    maxScale: 3.3,
    minScale: 0.7,
    rotation: {
      FLOOR: 0,
      TOWARDS_BAG: 0,
      WALL: 0,
    },
    originPosition: 1 / 2.0,
    initialPlace: "WALL",
  },
};

type DefaultPosition = {
  [place in PlaceType]: Vector3; // eslint-disable-line no-unused-vars
};
export const DEFAULT_POSITION: DefaultPosition = {
  FLOOR: new Vector3(0, 0, -2.5),
  WALL: new Vector3(0, 2.5, -0),
};

type MovePointerTarget = {
  name: MovePointerTargetName;
  validNormal: Vector3;
};
export const POINTER_TARGETS: MovePointerTarget[] = [
  { name: "FLOOR", validNormal: new Vector3(0, 1, 0) },
  { name: "WALL", validNormal: new Vector3(0, 0, -1) },
  { name: "TOWARDS_BAG", validNormal: new Vector3(0, 1, 0) },
];

export const DEFAULT_CROPPER_PARAMS: CropperParams = {
  crop: {
    x: 0,
    y: 0,
  },
  zoom: 1,
};

export const SAMPLE_ITEMS: SrcItemData[] = [
  {
    id: "0",
    isSample: true,
    imageSrc: "/saidan/sample/images/cat.png",
    squareImageSrc: "/saidan/sample/images/squared/cat-squared.png",
    whitedImageSrc: "/saidan/sample/images/whited/cat-whited.png",
    acstModelSrc: "/saidan/sample/models/cat.glb",
    isAcstAlreadyRequested: false,
    pCropperParams: {
      TIN_BADGE: DEFAULT_CROPPER_PARAMS, // 要変更
      POSTER: DEFAULT_CROPPER_PARAMS, // 要変更
    },
  },
  {
    id: "1",
    isSample: true,
    imageSrc: "/saidan/sample/images/simple.png",
    squareImageSrc: "/saidan/sample/images/squared/simple-squared.png",
    whitedImageSrc: "/saidan/sample/images/simple.png",
    acstModelSrc: "/saidan/sample/models/poster_test.glb",
    isAcstAlreadyRequested: false,
    pCropperParams: {
      TIN_BADGE: DEFAULT_CROPPER_PARAMS, // 要変更
      POSTER: DEFAULT_CROPPER_PARAMS, // 要変更
    },
  },
  {
    id: "2",
    isSample: true,
    imageSrc: "/saidan/sample/images/poster2.png",
    squareImageSrc: "/saidan/sample/images/squared/poster2-squared.png",
    whitedImageSrc: "/saidan/sample/images/poster2.png",
    acstModelSrc: "/saidan/sample/models/poster_test.glb",
    isAcstAlreadyRequested: false,
    pCropperParams: {
      TIN_BADGE: DEFAULT_CROPPER_PARAMS, // 要変更
      POSTER: DEFAULT_CROPPER_PARAMS, // 要変更
    },
  },
];

export const TIN_BADGE_MODEL_SRC = "/saidan/sample/models/tin-badge.glb";
export const SAIDAN_SRC = "/saidan/shelf/shelf.glb";

export const MOCK_IMAGE_SRC = "/saidan/others/mock.png";

export const BANNER = {
  pc: "/saidan/banner/banner-pc.webp",
  sp: "/saidan/banner/banner-sp.webp",
};

export const RESPONSIVE_BORDER = 520;

export const TWEET_URL = "tobiratory.com";
export const TWEET_HASH_TAG = "Tobiratory";
// export const TWEET_TEXT = ''
