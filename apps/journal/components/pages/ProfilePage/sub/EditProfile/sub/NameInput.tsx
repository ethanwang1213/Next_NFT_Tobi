import { useEffect } from "react";

type Props = {
  newName: string;
  setNewName: (newName: string) => void;
};

const NameInput: React.FC<Props> = ({ newName, setNewName }) => {
  useEffect(() => {
    // TODO: 現在の名前が設定されている場合、その名前をセットする
  }, []);

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(ev.currentTarget.value);
  };

  return (
    <input
      type="text"
      className="input input-primary"
      value={newName}
      onChange={handleChange}
    />
  );
};

export default NameInput;
