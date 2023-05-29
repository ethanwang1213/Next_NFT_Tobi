import useSaidanStore from "@/stores/saidanStore";
import Poster from "@/../public/saidan/saidan-ui/poster.svg";
import ItemTypeButton from "./ItemTypeButton";

type Props = {
  imageId: string;
};

/**
 * ポスター生成ボタン
 * @param param0
 * @returns
 */
const PosterButton: React.FC<Props> = ({ imageId }) => {
  const openCropWindow = useSaidanStore((state) => state.openCropWindow);

  const handleClick = () => {
    openCropWindow({ itemType: "POSTER", imageId });
  };
  return (
    <ItemTypeButton imageId={imageId} itemType="POSTER" onClick={handleClick}>
      <div className="type-select-container font-tsukub-700">
        <div className="type-select-icon">
          <Poster />
        </div>
        <div className="type-select-text">ポスター</div>
      </div>
    </ItemTypeButton>
  );
};

export default PosterButton;
