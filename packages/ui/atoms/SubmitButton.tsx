import Button from "ui/atoms/Button";
import Loading from "ui/atoms/Loading";

type Props = {
  label: string;
  loading: boolean;
  buttonClassName?: string;
  loadingClassName?: string;
};

const SubmitButton = ({
  label,
  loading,
  buttonClassName,
  loadingClassName,
}: Props) => {
  if (loading) {
    return <Loading className={loadingClassName} />;
  }
  return <Button label={label} className={buttonClassName} type="submit" />;
};

export default SubmitButton;
