
import React from 'react';
import Image from 'next/image';

const CustomInput=({ birthday, setBirthday }) => {
  return (
    <div className="relative">
                <input
                  value={birthday ? birthday.toLocaleDateString("ja-JP") : ""}
                  readOnly
                  className="rounded-full w-full border border-neutral-200 py-3 pl-3 pr-10 outline-none text-black text-sm leading-4"
                  placeholder="YYYY/MM/DD"
                />
                {birthday && (
                  <button
                    type="button"
                    onClick={() => setBirthday(null)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    aria-label="Clear date"
                  >
                    <span
                      role="img"
                      aria-label="clear"
                      className="flex items-center justify-center w-5 h-5 bg-primary rounded-full text-base-white text-[10px] font-semibold"
                      style={{ lineHeight: "1" }}
                    >
                      <Image
                        src="/admin/images/icon/close2.svg"
                        width={16}
                        height={16}
                        className="invert text-white font-semibold"
                        alt="close icon"
                      />
                    </span>
                  </button>
                )}
              </div>
  )
}

export default CustomInput