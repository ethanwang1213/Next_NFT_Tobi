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
  return (
    <button className={`btn ${buttonClassName ?? ""}`} type="submit">
      {label}
    </button>
  );
};

export default SubmitButton;
