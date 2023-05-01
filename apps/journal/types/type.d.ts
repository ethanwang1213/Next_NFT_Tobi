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