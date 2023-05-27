import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Discordコミュニティ参加のための認証ボタン
 * @returns
 */
const AuthDiscordButton: React.FC = () => {
  return (
    <button className="mt-4 sm:mt-10 btn btn-accent bg-transparent hover:bg-accent/60 border-none btn-circle sm:btn-lg w-[64%] sm:w-[50%] relative overflow-hidden ">
      <div className="bg-accent/90 rounded-full blur-[2px] w-full h-full absolute"></div>
      <div className="text-white absolute pointer-events-none flex">
        <FontAwesomeIcon icon={faDiscord} size="2x" className="mr-2 h-[40px]" />
        <p className="grid content-center">TOBIRA POLISへ</p>
      </div>
    </button>
  );
};

export default AuthDiscordButton;
