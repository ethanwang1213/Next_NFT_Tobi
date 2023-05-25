export type tagType = {
  page: number;
  image: string;
};

export type bookContext = {
  pageNo: {
    current: number;
    set: Dispatch<SetStateAction<number>>;
  };
  pages: {
    current: ReactNode[];
    set: Dispatch<SetStateAction<ReactNode[]>>;
  };
  tags: {
    current: tagType[];
    set: Dispatch<SetStateAction<tagType[]>>;
  };
};

// 本の画像の左上隅座標を表す型
export type BookPos = {
  left: number;
  top: number;
  width: number;
  height: number;
  center: number;
};

export type Birthday = {
  year: number;
  month: number;
  day: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  icon: string;
  createdAt: number;
  birthday?: Birthday;
};

export type UserContextType = {
  user: User | null | undefined;
  updateProfile: (
    newIcon: string,
    newName: string,
    newBirthday: Birthday
  ) => void;
};
