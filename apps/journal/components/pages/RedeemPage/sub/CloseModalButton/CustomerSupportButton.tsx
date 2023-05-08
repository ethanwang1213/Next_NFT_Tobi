import CloseModalButton from "./CloseModalButton";

type Props = {
  className: string;
  text: string;
};

const CustomerSupportButton: React.FC<Props> = ({ className, text }) => {
  const callback = () => {
    // TODO: サポートページに遷移
  };

  return (
    <CloseModalButton className={className} callback={callback}>
      {text}
    </CloseModalButton>
  );
};

export default CustomerSupportButton;
