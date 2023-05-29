const DEBUG_MODE = false;

/**
 * "(timestamp)(uid)"の形式の文字列をハッシュ化した値を得る
 * @returns
 */
const generateHash = async (uid: string) => {
  if (DEBUG_MODE) {
    return Date.now().toString();
  }
  const txt = `${Date.now()}${uid}`;
  const encoded = new TextEncoder().encode(txt);
  const hashBuf = await crypto.subtle.digest("SHA-256", encoded);
  const hashArr = Array.from(new Uint8Array(hashBuf));
  const hashHex = hashArr.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
};

export default generateHash;
