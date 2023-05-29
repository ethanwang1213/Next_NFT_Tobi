import { Dispatch, SetStateAction } from "react";

type Props = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const CloseButton: React.FC<Props> = ({ isOpen, setOpen }) => <button
      className={`menu-close-btn ${isOpen ? "" : "menu-close-btn-closing"
        }`}
      onClick={() => setOpen(false)}
      type="button"
    >
      CLOSE
    </button>

export default CloseButton;