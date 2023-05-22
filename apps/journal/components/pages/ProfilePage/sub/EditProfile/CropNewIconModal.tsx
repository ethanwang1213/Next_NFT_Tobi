import { useEditProfile } from "@/contexts/EditProfileProvider";

type Props = {};

const CropNewIconModal: React.FC<Props> = ({}) => {
  const { isCropWindowOpen } = useEditProfile();

  return (
    <>
      {/* Put this part before </body> tag */}
      <input
        type="checkbox"
        id="sample-modal"
        className="modal-toggle"
        checked={isCropWindowOpen.current}
        onChange={() => {}}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Congratulations random Internet user!
          </h3>
          <p className="py-4">
            You've been selected for a chance to get one year of subscription to
            use Wikipedia for free!
          </p>
          <div className="modal-action">
            <button onClick={() => isCropWindowOpen.set(false)} className="btn">
              Yay!
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CropNewIconModal;
