import Logout from "@/../public/saidan/saidan-ui/logout.svg";
import LogoutConfirm from "../logout/LogoutConfirm";

const LogoutButton = () => (
    <div className="saidan-logout-btn-container">
      <label
        // type="button"
        htmlFor="logout-confirm"
        className="saidan-logout-btn"
      >
        <Logout className="w-full h-full" />
      </label>
      <input type="checkbox" id="logout-confirm" className="modal-toggle" />
      <LogoutConfirm />
    </div>
  );

export default LogoutButton;
