const CustomToast = ({ message }) => {
  return (
    <div className="w-full flex justify-center">
      <span className="bg-[#717171] text-white p-2 rounded-[4px] text-sm animate-fade-in-out">
        {message}
      </span>
    </div>
  );
};

export default CustomToast;
