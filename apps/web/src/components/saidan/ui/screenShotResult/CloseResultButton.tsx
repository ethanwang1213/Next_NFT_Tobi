type CloseProps = {
  isWhite: boolean;
  onClick: () => void;
};

/**
 * スクショ表示での閉じるボタン（再利用性できるように改良したい）
 * @param param0
 * @returns
 */
const CloseResultButton = ({ isWhite, onClick }: CloseProps) => (
  <div className="screenshot-close-container">
    <button
      type="button"
      className="screenshot-close-btn"
      style={{
        color: isWhite ? "white" : "#424242",
      }}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
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
  </div>
);

export default CloseResultButton;
