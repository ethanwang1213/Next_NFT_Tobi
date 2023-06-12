import Image from "next/image";
import { AiFillTwitterCircle } from "react-icons/ai";

type Props = {
  data: {
    icon: string;
    name: string;
    roll: string[];
    twitter: string;
  };
};

const Member: React.FC<Props> = ({ data }) => (
  <div>
    <div className="about-member-image-container">
      <Image
        src={`${data.icon}`}
        layout="responsive"
        width={240}
        height={240}
        alt={`${data.name}'s icon`}
        style={{
          objectFit: "fill",
          borderRadius: "100%",
          border: "none",
        }}
      />
    </div>
    <p className="about-member-name">{data.name}</p>
    <div className="about-member-roll-container">
      {data.roll.map((x, i) => (
        <p key={i} className="about-member-roll">
          {x}
        </p>
      ))}
    </div>
    <div className="about-member-tw-container">
      <button>
        <a href={`${data.twitter}`} target="_blank" rel="noreferrer">
          <AiFillTwitterCircle size={40} color="white" />
        </a>
      </button>
    </div>
  </div>
);

export default Member;
