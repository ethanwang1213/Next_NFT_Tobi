import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {

}

/**
 * メニューのSNSやcopyrightを表示するコンポーネント
 * @param param0 
 * @returns 
 */
const MenuFooter: React.FC<Props> = ({ }) => <div className="menu-footer-container">
  <div className="menu-footer-icon-container">
    <FontAwesomeIcon
      icon={faTwitter}
      onClick={() => window.open('https://twitter.com/tobiratory', '_ blank')}
    />
  </div>
  <small className="menu-footer-copyright">©Tobiratory</small>
</div>

export default MenuFooter;