type Props = {
  texts: string[];
};

const AboutSubTitle: React.FC<Props> = ({ texts }) => (
  <div className="about-subtitle-container">
    {texts.map((v, i) => (
      <p key={i}>{v}</p>
    ))}
  </div>
);

export default AboutSubTitle;
