/**
 * body-scroll-lockのallowTouchMoveの設定
 * data-allowscroll="true"の属性を持つ要素のみスクロールを許可する
 * @param el
 * @returns
 */
const allowScrollRule = (el: HTMLElement | Element) => {
  while (el && el !== document.body) {
    if ("dataset" in el) {
      if (el.dataset.allowscroll) {
        return true;
      }
    }
    if (!el.parentElement) break;
    el = el.parentElement;
  }
  return false;
};

export default allowScrollRule;
