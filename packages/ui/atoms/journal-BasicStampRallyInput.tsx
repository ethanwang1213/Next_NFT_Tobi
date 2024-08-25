import { useForm } from "react-hook-form";
import { StampRallyEvents, StampRallyRewardFormType } from "types/stampRallyTypes";

type Props = {
  event: StampRallyEvents;
  onSubmit: (data: StampRallyRewardFormType) => void;
};

export const BasicStampRallyInput: React.FC<Props> = ({ event, onSubmit }) => {
  const { register, handleSubmit, reset } = useForm<StampRallyRewardFormType>({
    defaultValues: {
      keyword: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data: StampRallyRewardFormType) => {
        reset();
        data.event = event;
        onSubmit(data);
      })}
      className="flex justify-center gap-4 sm:pr-8 text-sm sm:text-[16px] font-bold"
    >
      <p className="text-dark-brown font-bold place-content-center">Keyword</p>
      <div className="w-[280px]">
        <input
          type="text"
          className="h-full w-full 
          input input-bordered border-2 border-dark-brown rounded-full
          bg-transparent text-dark-brown"
          {...register("keyword", {
            required: {
              value: true,
              message: "error",
            },
          })}
        />
      </div>
      <div className="flex items-center">
        <button className="w-18 sm:w-[105px] max-h-8 min-h-8 btn btn-accent rounded-full">send</button>
      </div>
    </form>
  );
};
