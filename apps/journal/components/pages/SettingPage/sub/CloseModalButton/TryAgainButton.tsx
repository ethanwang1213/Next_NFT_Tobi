import CloseModalButton from ".";

type Props = {
  text: string;
  className: string;
};

/**
 * Try againボタン
 * @param param0
 * @returns
 */
const TryAgainButton: React.FC<Props> = ({ text, className }) => {
  return <CloseModalButton className={className}>{text}</CloseModalButton>;
};

export default TryAgainButton;
