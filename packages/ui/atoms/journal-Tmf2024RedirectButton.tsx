import { useBookContext } from "../../../apps/journal/contexts/journal-BookProvider";
import useSound from "use-sound";
import { useSoundConfig } from "contexts/journal-SoundConfigProvider";

type Props = {
  onClick: () => void;
};

export const Tmf2024RedirectButton: React.FC<Props> = ({ onClick }) => {
  const { pageNo, bookIndex } = useBookContext();
  const { set: setPageNo } = pageNo;
  const { nftPage } = bookIndex;

  const [play] = useSound("/journal/sounds/paging_Journal.mp3", {
    volume: 0.1,
  });
  const { current: isMute } = useSoundConfig().isMute;

  return (
    <div className="flex justify-center">
      <button
        className="w-[176px] max-h-10 min-h-10
          btn btn-primary rounded-full text-[16px] text-white
          shadow-lg drop-shadow-[0_4px_2px_rgba(117,58,0,0.4)]"
        onClick={() => {
          setPageNo(nftPage.start);
          if (!isMute) {
            play();
          }
          onClick();
        }}
      >
        Check this out!
      </button>
    </div>
  );
};
