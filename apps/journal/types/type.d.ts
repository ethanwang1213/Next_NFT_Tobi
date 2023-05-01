export type tagType = {
    page: number,
    image: string
}

export type bookContext = {
    pageNo: {
        current: number,
        set: Dispatch<SetStateAction<number>>
    },
    pages: {
        current: ReactNode[],
        set: Dispatch<SetStateAction<ReactNode[]>>
    },
    tags: {
        current: tagType[],
        set: Dispatch<SetStateAction<tagType[]>>
    }
}

// 本の画像の左上隅座標を表す型
export type BookPos = {
    left: number;
    top: number;
    width: number;
    height: number;
    center: number;
  };