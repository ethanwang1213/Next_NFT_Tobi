import { useForm } from "react-hook-form"
import { StampRallyRewardFormType } from "../types";
import { useStampRally } from "../fetchers/useStampRally";

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
    }
  });

  const { requestReward } = useStampRally();

  return <form onSubmit={handleSubmit(requestReward)} className="flex">
    <div>
      <input
        type="text"
        placeholder="合言葉"
        {...register("keyword", {
          required: {
            value: true,
            message: "error"
          }
        })} />
      <p>{errors.keyword && errors.keyword.message}</p>
    </div>
    <button type="submit">送信</button>
  </form>
}
