export const Tmf2024Input: React.FC = () => {
  return (
    <div className="flex justify-center gap-4 pr-8 text-[16px] font-bold">
      <p className="text-dark-brown font-bold place-content-center">Keyword</p>
      <div className="w-[280px]">
        <input
          type="text"
          className="h-full w-full 
            input input-bordered border-2 border-dark-brown rounded-full
            bg-transparent text-dark-brown"
          // {...register("keyword", {
          //   required: {
          //     value: true,
          //     message: "error",
          //   },
          // })}
        />
      </div>
      <div>
        <button className="w-[105px] max-h-8 min-h-8 btn btn-accent rounded-full">
          send
        </button>
      </div>
    </div>
  );
};
