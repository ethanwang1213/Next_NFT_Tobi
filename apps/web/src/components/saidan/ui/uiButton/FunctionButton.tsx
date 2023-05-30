import { ReactNode } from "react";

type FunctionButtonProps = {
  onClick: () => void;
  children: ReactNode;
};

const FunctionButton = ({ onClick, children }: FunctionButtonProps) => (
    <button
      type="button"
      className="ui-btn-func"
      onClick={onClick}
    >
      {children}
    </button>
  );

export default FunctionButton;
