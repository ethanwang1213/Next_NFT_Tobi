import useWindowSize from "@/hooks/useWindowSize";

type Props = {
  title: string;
  texts: string[];
};

const AboutSection = ({ title, texts }: Props) => {
  const { isWide } = useWindowSize();
  // const t = JSON.parse(title);
  // console.log(t);
  return (
    <div className="w-full">
      <div className="py-4">
        <div>
          <h2
            className="text-white font-bold"
            style={{
              fontSize: isWide ? "40px" : "24px",
              // textDecoration: 'underline'
            }}
          >
            {title}
          </h2>
        </div>
      </div>
      <hr />
      <div
        className="text-white w-full mt-4 pl-4"
        style={{
          fontSize: isWide ? "20px" : "16px",
        }}
      >
        {texts.map((v, i) => (
          <p key={i}>{v === "" ? <br /> : v}</p>
        ))}
      </div>
    </div>
  );
};
export default AboutSection;
