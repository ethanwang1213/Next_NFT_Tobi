type Props = {
  texts: string[];
};

const AboutTitle: React.FC<Props> = ({ texts }) => (
  <div className="about-title-container">
    <h1 className="about-title">
      {texts.map((v, i) => (
        <>
          {v}
          {i < texts.length - 1 && <br />}
        </>
      ))}
    </h1>
  </div>
);

export default AboutTitle;
