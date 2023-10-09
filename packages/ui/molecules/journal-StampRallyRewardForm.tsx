import { useForm } from "react-hook-form";
import { StampRallyRewardFormType } from "types/journal-types";
import { useStampRally } from "fetchers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useStampRallyForm } from "contexts/journal-StampRallyFormProvider";

/**
 * TOBIRA POLIS祭の出し物 G0のスタンプラリーの記念品受け取り用フォーム
 * @returns {ReactElement} The `StampRallyRewardForm` component
 */
export const StampRallyRewardForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    // formState: { errors },
  } = useForm<StampRallyRewardFormType>({
    defaultValues: {
      keyword: "",
    },
  });

  const { requestReward } = useStampRally();
  const { isSubmitting } = useStampRallyForm();

  return (
    <form
      onSubmit={handleSubmit((data: StampRallyRewardFormType) => {
        reset();
        requestReward(data);
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
            <p>
              {isSubmitting.current ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                "送信"
              )}
            </p>
          </div>
        </button>
      </div>
    </form>
  );
};
