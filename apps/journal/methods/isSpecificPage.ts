import { PageIndexData } from "types/journal-types";

/**
 * 現在表示ページが、
 * profileページやnekoページなどのページのまとまりの中に
 * 存在するかどうかを判定する関数
 **/
export const isInPage = (pageNo: number, pageIndexData: PageIndexData) =>
  pageNo >= pageIndexData.start && pageNo <= pageIndexData.end;

/**
 * 現在表示ページが、左ページであるかどうかの判定を行う関数
 */
export const isLeftPage = (pageNo: number) => pageNo % 2 === 0;
