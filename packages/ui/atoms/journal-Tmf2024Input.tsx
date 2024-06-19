import { useForm } from "react-hook-form";
import { StampRallyRewardFormType } from "types/stampRallyTypes";

type Props = {
  onSubmit: (data: StampRallyRewardFormType) => void;
};

export const Tmf2024Input: React.FC<Props> = ({ onSubmit }) => {
  const { register, handleSubmit, reset } = useForm<StampRallyRewardFormType>({
    defaultValues: {
      keyword: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data: StampRallyRewardFormType) => {
        reset();
        onSubmit(data);
      })}
      className="flex justify-center gap-4 pr-8 text-[16px] font-bold"
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
        <button className="w-[105px] max-h-8 min-h-8 btn btn-accent rounded-full">
          send
        </button>
      </div>
    </form>
  );
};
