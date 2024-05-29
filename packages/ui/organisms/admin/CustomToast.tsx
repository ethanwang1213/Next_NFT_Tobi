const CustomToast = ({ show, message }) => {
  return (
    <div className="w-full flex justify-center">
      <span
        className={`bg-[#717171] text-white p-2 rounded-[4px] text-sm ${
          show ? "animate-fade-in-out" : "hidden"
        }`}
      >
        {message}
      </span>
    </div>
  );
};

export default CustomToast;
