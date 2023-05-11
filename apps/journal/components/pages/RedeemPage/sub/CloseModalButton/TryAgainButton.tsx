import CloseModalButton from "./parent/CloseModalButton";

type Props = {
  className: string;
};

/**
 * Try againボタン
 * @param param0 
 * @returns 
 */
const TryAgainButton: React.FC<Props> = ({ className }) => {
  return <CloseModalButton className={className}>Try again</CloseModalButton>;
};

export default TryAgainButton;
