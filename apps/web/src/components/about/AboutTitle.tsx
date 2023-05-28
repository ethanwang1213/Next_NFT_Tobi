type Props = {
  texts: string[];
}

const AboutTitle: React.FC<Props> = ({ texts }) => <div className="about-title-container">
      {texts.map((v, i) => (
        <div className="about-title">
          {v}
        </div>
      ))}
    </div>

export default AboutTitle;