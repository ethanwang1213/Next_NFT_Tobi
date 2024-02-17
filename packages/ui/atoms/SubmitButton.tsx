import Button from "ui/atoms/Button";
import Loading from "ui/atoms/Loading";

type Props = {
  label: string;
  loading: boolean;
  buttonClassName?: string;
  loadingClassName?: string;
};

// TODO: The fix using FloatingButton conflicts with feature/admin-login, so it should be implemented on the feature/admin-login side.
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
