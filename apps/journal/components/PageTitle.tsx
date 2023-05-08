type Props = {
  isShown: boolean;
  title: string;
};

const PageTitle: React.FC<Props> = ({ isShown, title }) => {
  return (
    <div className="h-[100px] mb-0 sm:mb-8">
      {isShown && (
        <h1 className="w-full text-center text-[50px] sm:text-[60px] font-bold">
          {title}
        </h1>
      )}
    </div>
  );
};

export default PageTitle;
