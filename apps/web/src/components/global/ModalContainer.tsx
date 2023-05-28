import { a, useSpring } from "@react-spring/web";
import { ReactNode, useState } from "react";

type Props = {
  children: ReactNode;
  closeMethod: () => void;
};

/**
 * 通知用モーダルのコンテナ
 * @param param0
 * @returns
 */
const ModalContainer: React.FC<Props> = ({ children, closeMethod }) => {
  const [active, setActive] = useState(true);
  const { opacity } = useSpring({
    from: {
      opacity: 0,
    },
    to: {
      opacity: active ? 1 : 0,
    },
    onResolve: () => {
      if (!active) {
        closeMethod();
      }
    },
  });

  return (
    <a.div className="modal-outer" style={{ opacity }}>
      <a.div className="modal-inner">{children}</a.div>
    </a.div>
  );
};

export default ModalContainer;
