import SkipTutorial from "@/../public/saidan/saidan-ui/skiptutorial.svg";

type SkipButtonProps = {
  onClick: () => void;
};

const SkipButton = ({ onClick }: SkipButtonProps) => <div className="ui-btn-skip-tutorial-container">
  <button
    type="button"
    className="ui-btn-skip-tutorial"
    onClick={onClick}
  >
    <SkipTutorial className="w-full h-full" />
  </button>
</div>;

export default SkipButton;
