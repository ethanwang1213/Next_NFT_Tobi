type Props = {
  texts: string[]
}

const AboutSubTitle: React.FC<Props> = ({ texts }) => <div className="about-subtitle-container">
      {texts.map((v) => (
        <div>{v}</div>
      ))}
    </div>

export default AboutSubTitle;