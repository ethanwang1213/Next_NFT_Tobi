import { useRouter } from "next/router";
import Button from "ui/atoms/Button";

type Props = {
  label: string;
  url: string;
  className?: string;
};

const TransitionButton = ({ label, url, className }: Props) => {
  const router = useRouter();
  return (
    <Button
      label={label}
      type="button"
      className={className}
      onClick={() => router.replace(url)}
    />
  );
};

export default TransitionButton;
