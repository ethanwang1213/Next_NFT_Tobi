import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "contexts/journal-AuthProvider";
import { useStampRallyForm } from "contexts/journal-StampRallyFormProvider";
import { StampRallyEvents, StampRallyRewardFormType } from "types/stampRallyTypes";
import { useForm } from "react-hook-form";

type Props = {
  onSubmit: (data: StampRallyRewardFormType) => void;
  event: StampRallyEvents;
};

/**
 * TOBIRA POLIS祭の出し物 G0のスタンプラリーの記念品受け取り用フォーム
 * @returns {ReactElement} The `StampRallyRewardForm` component
 */
export const Tpf2023RewardForm: React.FC<Props> = ({ onSubmit, event }) => {
  const { register, handleSubmit, reset } = useForm<StampRallyRewardFormType>({
    defaultValues: {
      keyword: "",
    },
  });

  const { isSubmitting } = useStampRallyForm();
  const stampRally = useAuth().user?.mintStatus?.[event];

  if (
    !!stampRally &&
    "Complete" in stampRally &&
    (stampRally?.Complete === "IN_PROGRESS" || stampRally?.Complete === "DONE")
  ) {
    return <p className="h-8 sm:h-12 font-bold sm:text-xl">Completed!!</p>;
  }

  return (
    <form
      onSubmit={handleSubmit((data: StampRallyRewardFormType) => {
        reset();
        data.event = "TOBIRAPOLISFESTIVAL2023";
        onSubmit(data);
      })}
      className="h-8 sm:h-12 w-full flex"
    >
      <div className="grow">
        <input
          type="text"
          placeholder="合言葉を入力"
          className="
            h-full w-full 
            input input-bordered border-1 sm:border-2 border-primary rounded-2xl
            bg-transparent 
            text-primary placeholder-primary/50 
            text-sm sm:text-lg font-bold 
            shadow-lg drop-shadow-[0_4px_2px_rgba(117,58,0,0.3)]"
          {...register("keyword", {
            required: {
              value: true,
              message: "error",
            },
          })}
        />
      </div>
      <div className="relative h-full ml-4 py-1 sm:py-2">
        <button
          type="submit"
          className="h-full min-h-0 w-16 sm:w-20 
            btn btn-outline btn-primary btn-circle bg-transparent border-none
            text-sm sm:text-lg shadow-lg drop-shadow-[0_4px_2px_rgba(117,58,0,0.4)]"
          disabled={isSubmitting.current}
        >
          <div
            className="w-full h-full rounded-full outline outline-1 sm:outline-2 -outline-offset-1 sm:-outline-offset-2 
              outline-primary hover:outline-[#9A4F04] 
              transition-[outline-color, color] duration-200
              text-primary hover:text-white
              grid content-center"
          >
            <p>{isSubmitting.current ? <FontAwesomeIcon icon={faSpinner} spin /> : "送信"}</p>
          </div>
        </button>
      </div>
    </form>
  );
};
