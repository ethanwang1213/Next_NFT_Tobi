import { Dispatch, SetStateAction, useEffect, useRef } from "react";

type Props = {
  setIsOkNotif: Dispatch<SetStateAction<boolean>>;
};

const AccountEmailNotif: React.FC<Props> = ({ setIsOkNotif }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.checked = true;
  }, []);

  const onClick = () => {
    inputRef.current.checked = false;
    setIsOkNotif(true);
  };

  return (
    <div>
      <label htmlFor="my-modal" className="btn hidden">
        open modal
      </label>

      <input
        ref={inputRef}
        type="checkbox"
        id="my-modal"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box w-[80%] sm:w-[60%] sm:max-w-[420px] text-center">
          <h3 className="font-bold text-2xl">購入前の注意だ 🐾</h3>
          <p className="py-4 text-lg">
            {`TOBIRA NEKO受け取りには下記に登録のアドレスが同一である必要があります。`}
          </p>
          {/* <br className="mb-10" /> */}
          <p>{` 🐾 購入時に入力のメールアドレス`}</p>
          <p> {` 🐾 Journal にご登録のメールアドレス`}</p>
          <div className="modal-action flex justify-center">
            <button className="btn" onClick={onClick}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountEmailNotif;
