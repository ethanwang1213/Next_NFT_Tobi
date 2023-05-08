import Image from "next/image";
import { useContext, useState } from "react";
import { BookContext } from "../../pages/_app";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleLeft,
  faCircleRight,
} from "@fortawesome/free-regular-svg-icons";
import Tag from "../Tag";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
const Mobile = () => {
  const [isLeftPage, setIsLeftPage] = useState<Boolean>(true);
  const [isShowTag, setIsShowTag] = useState<Boolean>(false);
  const bookContext = useContext(BookContext);

  return (
    <div className="overflow-hidden">
      <div
        className={`relative ${
          isLeftPage ? "left-[calc(100vw_-_60vh)]" : "left-[-70vh]"
        } w-[130vh] h-screen transition-[left]`}
      >
        <Image
          src="/images/book/openpage.png"
          fill
          alt="page"
          className="object-contain"
          priority
        ></Image>
        <div className="absolute top-4 left-10 bottom-5 right-[70vh] flex justify-end">
          <div className="max-w-[calc(100vw_-_1.5rem)] w-full h-full mr-3">
            {bookContext.pages.current[bookContext.pageNo.current]}
          </div>
        </div>
        <div className="absolute top-4 left-[70vh] bottom-5 right-5 flex justify-start">
          <div className="max-w-[calc(100vw_-_1.5rem)] w-full h-full ml-3">
            {bookContext.pages.current[bookContext.pageNo.current + 1]}
          </div>
        </div>
      </div>
      <FontAwesomeIcon
        icon={isLeftPage ? faCircleRight : faCircleLeft}
        size="3x"
        className="absolute bottom-0 right-0 p-5"
        onClick={() => setIsLeftPage(!isLeftPage)}
      />
      <div className="absolute bottom-0 py-5 flex flex-col gap-2 left-[-30px]">
        <div
          className={`flex flex-col gap-2 ${
            isShowTag ? "opcaity-100" : "opacity-0 pointer-events-none"
          } transition-opacity`}
        >
          {bookContext.tags.current.map((tag, i) => (
            <Tag image={tag.image} page={tag.page} key={i} />
          ))}
        </div>
        <Tag
          image={
            isShowTag ? (
              <FontAwesomeIcon icon={faXmark} className="text-[40px] w-full" />
            ) : (
              <FontAwesomeIcon icon={faBars} className="text-[40px] w-full" />
            )
          }
          page={() => setIsShowTag(!isShowTag)}
          key={-1}
        />
      </div>
    </div>
  );
};

export default Mobile;
