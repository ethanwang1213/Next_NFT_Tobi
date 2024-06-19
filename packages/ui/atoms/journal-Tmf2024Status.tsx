import Caution from "../../../apps/journal/public/images/icon/caution_journal.svg";
import Fether from "../../../apps/journal/public/images/icon/feather_journal.svg";
import FetherCheck from "../../../apps/journal/public/images/icon/feathercheck_journal.svg";

export const Nothing: React.FC = () => {
  return (
    <div>
      <IconContainer />
      <TextContainer>&nbsp;</TextContainer>
    </div>
  );
};

export const Checking: React.FC = () => {
  return (
    <div className="text-dark-brown">
      <IconContainer>
        <Fether />
      </IconContainer>
      <TextContainer>checking keyword...</TextContainer>
    </div>
  );
};

export const Minting: React.FC = () => {
  return (
    <div className="text-dark-brown">
      <IconContainer>
        <Fether />
      </IconContainer>
      <TextContainer>minting...</TextContainer>
    </div>
  );
};

export const Incorrect: React.FC = () => {
  return (
    <div className="text-error">
      <IconContainer>
        <Caution />
      </IconContainer>
      <TextContainer>
        Oh dear! It appears the keyword is incorrect. Please enter it precisely.
      </TextContainer>
    </div>
  );
};

export const Success: React.FC = () => {
  return (
    <div className="text-dark-brown">
      <IconContainer>
        <FetherCheck />
      </IconContainer>
      <TextContainer>
        Success! A new stamp has been added to the library!
      </TextContainer>
    </div>
  );
};

const IconContainer: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="h-[160px] flex justify-center">
      <div className="w-[160px]">{children}</div>
    </div>
  );
};

const TextContainer: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return <p className="m-5 text-[15px] font-bold">{children}</p>;
};
