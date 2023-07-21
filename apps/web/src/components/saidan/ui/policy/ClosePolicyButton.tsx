import { useWindowSize } from "ui";
import { RESPONSIVE_BORDER } from "@/constants/saidanConstants";

type Props = {
  onClick: () => void;
};

const ClosePolicyButton = ({ onClick }: Props) => {
  const { innerWidth } = useWindowSize();
  return (
    <div className="flex justify-end absolute right-0 top-0">
      <button
        className="btn btn-circle btn-ghost text-[#414142]"
        onClick={onClick}
        style={{
          width: innerWidth > RESPONSIVE_BORDER ? "52px" : "48px",
          height: innerWidth > RESPONSIVE_BORDER ? "52px" : "30px",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style={{
            width: innerWidth > RESPONSIVE_BORDER ? "40px" : "30px",
            height: innerWidth > RESPONSIVE_BORDER ? "40px" : "30px",
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default ClosePolicyButton;
