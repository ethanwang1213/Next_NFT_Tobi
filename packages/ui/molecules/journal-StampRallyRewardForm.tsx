import { useForm } from "react-hook-form";
import { StampRallyRewardFormType } from "types/journal-types";
import { useStampRally } from "fetchers";
import { useAuth } from "contexts/journal-AuthProvider";

/**
 * TOBIRA POLIS祭の出し物 G0のスタンプラリーの記念品受け取り用フォーム
 */
export const StampRallyRewardForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StampRallyRewardFormType>({
    defaultValues: {
      keyword: "",
    },
  });

  const { requestReward } = useStampRally();
  const { user } = useAuth();

  return (
    <form onSubmit={handleSubmit(requestReward)} className="h-12 w-full flex">
      <div className="grow">
        <input
          type="text"
          placeholder="合言葉を入力"
          className="
            h-full w-full 
            input input-bordered border-2 border-primary rounded-2xl
            bg-transparent 
            text-primary placeholder-primary/50 
            text-lg font-bold 
            shadow-lg drop-shadow-[0_4px_2px_rgba(117,58,0,0.3)]"
          {...register("keyword", {
            required: {
              value: true,
              message: "error",
            },
          })}
        />
      </div>
      <div className="relative h-full ml-4 py-2">
        <button
          type="submit"
          className="h-full min-h-0 w-20 
            btn btn-outline btn-primary btn-circle bg-transparent border-none
            text-lg shadow-lg drop-shadow-[0_4px_2px_rgba(117,58,0,0.4)]"
        >
          <div
            className="w-full h-full rounded-full outline outline-2 -outline-offset-2 
              outline-primary hover:outline-[#9A4F04] 
              transition-[outline-color, color] duration-200
              text-primary hover:text-white
              grid content-center"
          >
            <p>送信</p>
          </div>
        </button>
      </div>
    </form>
  );
};
