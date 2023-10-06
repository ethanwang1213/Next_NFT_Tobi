import { NextPage } from "next";
import { useMenuAnimation } from "ui";
import isWideMode from "@/methods/isWideMode";
import AboutSection from "@/components/about/AboutSection";
import { useEffect } from "react";
import about from "@/data/about.json";
import { gsap } from "gsap";
import ContactHeader from "@/components/contact/ContactHeader";
import AboutTitle from "@/components/about/AboutTitle";
import AboutSubTitle from "@/components/about/AboutSubTitle";
import Member from "@/components/about/Member";
import { useWindowSize } from "hooks";

const AboutUs: NextPage = () => {
  const { innerWidth, innerHeight } = useWindowSize();

  // メニュー鍵穴から来た時の、ページが開いたら画像をフェードアウトさせる処理
  const { imageRef, requireFadeOut, setRequireFadeOut } = useMenuAnimation();
  useEffect(() => {
    if (!imageRef.current) return;
    if (requireFadeOut !== "ABOUT US") return;

    gsap
      .timeline()
      .to(imageRef.current, { opacity: 0, duration: 0.5 }, "+=1")
      .set(imageRef.current, { display: "none", pointerEvents: "none" })
      .add(() => {
        setRequireFadeOut("");
      });
  }, [imageRef.current, requireFadeOut]);

  return (
    <div
      className="contact-container-outer about-container-outer"
      style={{
        backgroundImage: isWideMode(innerWidth)
          ? "url(/contact/pc/bg.svg)"
          : "url(/contact/sp/bg.svg)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* <BgPattern /> */}
      <div className="contact-container-inner about-container-inner">
        <ContactHeader title="ABOUT US" />
        <div className="about-text-container-outer">
          <div className="about-text-container-inner">
            <div>
              <AboutTitle texts={about.title} />
              <AboutSubTitle texts={about["sub-title"]} />
            </div>
            <div className="about-section-container">
              {about.sections.map((v, i) => (
                <AboutSection key={i} title={v.title} texts={v.text} />
              ))}
            </div>

            <div className="about-team-container">
              <h2 className="about-team-title">Our Team</h2>
              <div className="about-member-container">
                {about["our-team"].map((v, i) => (
                  <Member key={i} data={v} />
                ))}
              </div>
            </div>
            <h3 className="about-end-text">
              AND NOW WE ARE STILL BUILDING THE TOBIRA
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
