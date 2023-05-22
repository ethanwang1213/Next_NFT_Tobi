import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Discordコミュニティ参加のための認証ボタン
 * @returns
 */
const DiscordOAuthButton: React.FC = () => {
  return (
    <a
      href={process.env.DISCORD_OAUTH_URL}
      className="btn btn-accent bg-transparent hover:bg-accent/60 border-none btn-circle sm:btn-lg w-[64%] sm:w-[70%] relative overflow-hidden shadow-lg drop-shadow-[0_10px_6px_rgba(117,58,0,0.6)]"
    >
      <div className="bg-accent/90 rounded-full blur-[2px] w-full h-full absolute"></div>
      <div className="text-white absolute pointer-events-none flex">
        <FontAwesomeIcon icon={faDiscord} size="2x" className="mr-2 h-[40px]" />
        <p className="grid content-center">TOBIRA POLISへ</p>
      </div>
    </a>
  );
};

export default DiscordOAuthButton;
