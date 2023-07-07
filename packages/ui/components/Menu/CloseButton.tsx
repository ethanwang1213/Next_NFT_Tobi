import { Dispatch, SetStateAction } from "react";

type Props = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const CloseButton: React.FC<Props> = ({ isOpen, setOpen }) => (
  <button
    className={`absolute top-6 right-4 z-50 
      btn btn-ghost hover:bg-black/20 
      text-[20px] font-['tachyon'] font-normal text-white sm:text-2xl 
      ${isOpen ? "" : `opacity-0 transition pointer-events-none`}`}
    onClick={() => setOpen(false)}
    type="button"
  >
    CLOSE
  </button>
);

export default CloseButton;
