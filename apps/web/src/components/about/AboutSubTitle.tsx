type Props = {
  texts: string[];
};

const AboutSubTitle: React.FC<Props> = ({ texts }) => (
  <div className="about-subtitle-container">
    {texts.map((v, i) => (
      <div key={i}>{v}</div>
    ))}
  </div>
);

export default AboutSubTitle;
