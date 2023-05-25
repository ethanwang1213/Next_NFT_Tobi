import { useAuth } from "@/contexts/AuthProvider";
import { useEffect } from "react";

type Props = {
  isModalOpen: boolean;
  newName: string;
  setNewName: (newName: string) => void;
};

const NameInput: React.FC<Props> = ({ isModalOpen, newName, setNewName }) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    if (!isModalOpen) return;

    setNewName(user.name);
  }, [user, isModalOpen]);

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(ev.currentTarget.value);
  };

  return (
    <input
      type="text"
      className="input input-accent"
      value={newName}
      onChange={handleChange}
    />
  );
};

export default NameInput;
