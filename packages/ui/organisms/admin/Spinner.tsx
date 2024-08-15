const Spinner = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-[400px] h-[379px] z-10 flex justify-center items-center">
        <span className="dots-circle-spinner loading2 text-[80px] text-[#FF811C]"></span>
      </div>
    </div>
  );
};

export default Spinner;
