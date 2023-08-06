import { PageIndexData } from "@/types/type";

/**
 * 現在表示ページが、
 * profileページやnekoページなどのページのまとまりの中に
 * 存在するかどうかを判定する関数
 **/
export const isInPage = (pageNo: number, pageIndexData: PageIndexData) =>
  pageNo >= pageIndexData.start && pageNo <= pageIndexData.end;
