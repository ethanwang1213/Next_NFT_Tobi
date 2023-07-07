type Props = {
  onClick: () => void;
};

const CloseButton = ({ onClick }: Props) => (
  <button
    type="button"
    className="btn btn-circle sm:btn-lg btn-ghost text-white"
    onClick={onClick}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 sm:h-8 sm:w-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
);

export default CloseButton;
