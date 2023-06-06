import { animated, useSpring } from "@react-spring/web";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { doc, updateDoc } from "@firebase/firestore";
import useSaidanStore from "@/stores/saidanStore";
import { db } from "@/../firebase/client";
import { useAuth } from "@/context/auth";
import { ShowBurgerContext } from "@/context/showBurger";
import ClosePolicyButton from "./ClosePolicyButton";

const PolicyWindow = () => {
  const auth = useAuth();

  const isPolicyAccepted = useSaidanStore((state) => state.isPolicyAccepted);
  const acceptPolicy = useSaidanStore((state) => state.acceptPolicy);
  const isPolicyOpen = useSaidanStore((state) => state.isPolicyOpen);
  const closePolicy = useSaidanStore((state) => state.closePolicy);
  const hidePolicy = useSaidanStore((state) => state.hidePolicy);
  const imageInputRef = useSaidanStore((state) => state.imageInputRef);

  const { y, opacity } = useSpring({
    from: { y: "100vh", opacity: 0 },
    to: { y: isPolicyOpen ? "0" : "100vh", opacity: isPolicyOpen ? 1 : 0 },
    config: { tension: 500, friction: 50 },
    onResolve: () => {
      if (isPolicyOpen) return;
      hidePolicy();
      if (isPolicyAccepted) {
        imageInputRef?.current?.click();
      }
    },
  });

  const handleClose = () => {
    closePolicy();
  };

  const [disabled, setDisabled] = useState(true);
  const handleCheckChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setDisabled(!ev.currentTarget.checked);
  };
  const handleSubmit = () => {
    acceptPolicy();
    if (auth) {
      const ref = doc(db, `users/${auth.id}`);
      updateDoc(ref, { policyAccepted: true });
    }
    closePolicy();
  };
  useEffect(() => {
    if (auth?.policyAccepted) {
      acceptPolicy();
      closePolicy();
    }
  }, [auth]);

  const burgerContext = useContext(ShowBurgerContext);
  useEffect(() => {
    burgerContext.setShowBurger(false);
    return () => {
      burgerContext.setShowBurger(true);
    };
  }, []);

  return (
    <animated.div className="policy-outer-container" style={{ opacity }}>
      <animated.div
        className="policy-inner-container"
        style={{
          y,
        }}
      >
        <div className="policy-close-btn">
          <ClosePolicyButton onClick={handleClose} />
        </div>
        <div className="policy-document-container">
          <p className="policy-message">
            サービスのご利用には利用規約への同意が必要です。
          </p>
          <iframe
            id="policy-iframe"
            src="/saidan/policy/policy.html"
            className="policy-document"
          />
        </div>
        <div className="policy-accept-container">
          <div className="policy-accept-inner-container">
            <div className="policy-accept-check-container">
              <div className="grid content-center">
                <input
                  id="accept"
                  type="checkbox"
                  name="accept"
                  onChange={(ev) => handleCheckChange(ev)}
                />
              </div>
              <label htmlFor="accept" className="policy-accept-check-text">
                利用規約に同意する
              </label>
            </div>
            <button
              type="button"
              disabled={disabled}
              className="policy-accept-btn"
              onClick={handleSubmit}
            >
              送信
            </button>
          </div>
        </div>
      </animated.div>
    </animated.div>
  );
};

export default PolicyWindow;
