import { Dispatch, SetStateAction } from "react";

type Props = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const CloseButton: React.FC<Props> = ({ isOpen, setOpen }) => (
  <button
    className={`absolute top-3 right-2 z-50 
      btn btn-ghost hover:bg-black/20 
      text-[20px] font-['tachyon'] font-normal text-white sm:text-2xl 
      ${
        isOpen
          ? ""
          : `absolute top-0 right-0 z-50 p-5 
            font-['tachyon'] text-[20px] sm:text-2xl text-white 
            cursor-pointer transition 
            opacity-0 pointer-events-none`
      }`}
    onClick={() => setOpen(false)}
    type="button"
  >
    CLOSE
  </button>
);

export default CloseButton;
