type Props = {
  className?: string;
};
const Loading = ({ className }: Props) => {
  return (
    <>
      <span className={`loading ${className ?? ""}`}></span>
    </>
  );
};

export default Loading;
