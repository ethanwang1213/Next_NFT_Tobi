type Props = {
  texts: string[];
};

const AboutTitle: React.FC<Props> = ({ texts }) => (
  <div className="about-title-container">
    {texts.map((v, i) => (
      <h1 key={i} className="about-title">
        {v}
      </h1>
    ))}
  </div>
);

export default AboutTitle;
