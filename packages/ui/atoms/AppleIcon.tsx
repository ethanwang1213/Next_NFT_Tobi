import { faApple } from "@fortawesome/free-brands-svg-icons";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";

type Props = Omit<FontAwesomeIconProps, "icon"> & { disabled?: boolean };

const AppleIcon = ({ disabled, ...props }: Props) => {
  return (
    <FontAwesomeIcon
      icon={faApple}
      color={disabled ? "#BAB8B8" : props.color}
      {...props}
    ></FontAwesomeIcon>
  );
};

export default AppleIcon;
