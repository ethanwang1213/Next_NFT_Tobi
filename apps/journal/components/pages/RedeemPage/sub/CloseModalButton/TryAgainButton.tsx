import CloseModalButton from "./CloseModalButton";

type Props = {
  className: string;
};

const TryAgainButton: React.FC<Props> = ({ className }) => {
  return <CloseModalButton className={className}>Try again</CloseModalButton>;
};

export default TryAgainButton;
