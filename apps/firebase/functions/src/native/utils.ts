/**
 * Adds object if object is empty.
 * @param {object} obj The parameter of function.
 * @returns {boolean} The if obj is empty.
 */

export function isEmptyObject(obj: object): boolean {
  const len = Object.keys(obj).length;
  if (len) {
    return true;
  } else {
    return false;
  }
}

export function getBoxAddress(userId: number, boxId: number): string {
  const userIdPad = userId.toString().padStart(4, "0");
  const boxIdPad = boxId.toString().padStart(5, "0");
  let address = Buffer.from(userIdPad + "_" + boxIdPad, "ascii").toString("base64");
  address = "TB" + address.replace("==", "");
  return address;
}

export const statusOfShowcase = {
  private: 0,
  public: 1,
  publicSchedule: 2,
};

// export const statusOfDigitalItem = {
//   draft: 1,
//   private: 2,
//   public: 3,
//   onSale: 4,
//   unListed: 5,
//   publicSchedule: 6,
//   saleSchedule: 7,
// };

export const metaDataStatus = {
  draft: 1,
  fixed: 2,
}

export const visibilityStatus = {
  private: 1,
  unlisted: 2,
  public: 3,
}

export const salesStatus = {
  viewingOnly: 1,
  sales: 2,
}

export const mintStatus = {
  minting: 1,
  minted: 2,
  opened: 3,
}

// export function getStatusOfShowcase(
//   status: number,
//   updatedTime: Date,
//   scheduleDate: Date|null,
// ): number{
//   if (!scheduleDate) {
//     return status;
//   }
//   const scheduleTime = +new Date(scheduleDate);
//   const nowTime = Date.now();
//   if (nowTime>scheduleTime) {
//     return status;
//   }else {

//   }
//   return 1;
// }
