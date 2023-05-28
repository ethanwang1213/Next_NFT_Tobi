import Canbadge from "@/../public/saidan/saidan-ui/canbadge.svg";
import useSaidanStore from "@/stores/saidanStore";
import ItemTypeButton from "./ItemTypeButton";

type Props = {
  imageId: string;
};

/**
 * 缶バッジ生成ボタン
 * @param param0
 * @returns
 */
const BadgeButton: React.FC<Props> = ({ imageId }) => {
  const openCropWindow = useSaidanStore((state) => state.openCropWindow);

  const handleClick = () => {
    openCropWindow({ itemType: "TIN_BADGE", imageId });
  };

  return (
    <ItemTypeButton
      imageId={imageId}
      itemType="TIN_BADGE"
      onClick={handleClick}
    >
      <div className="type-select-container font-tsukub-700">
        <div className="type-select-icon">
          <Canbadge />
        </div>
        <div className="type-select-text">缶バッジ</div>
      </div>
    </ItemTypeButton>
  );
};

export default BadgeButton;
