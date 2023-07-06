import React, { ChangeEvent, useRef, useState } from "react";
import { NextPage } from "next";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useWindowSize } from "ui";
import SubmitModal from "@/components/contact/SubmitModal";
import RecaptchaVisibleStyle from "@/components/styled-components/RecaptchaVisibleStyle";
import BgPattern from "@/components/contact/BgPattern";
import ContactHeader from "@/components/contact/ContactHeader";
import dayjs from "dayjs";

const schema = z.object({
  name: z.string().min(1, { message: "必須項目です" }),
  email: z
    .string()
    .min(1, { message: "必須項目です" })
    .email({ message: "正しいメールアドレスの形式で入力してください" }),
  topic: z.string().min(1, { message: "必須項目です" }),
  message: z.string().min(1, { message: "必須項目です" }),
});
type Schema = z.infer<typeof schema>;

const Contact: NextPage = () => {
  const { isWide } = useWindowSize();
  const { executeRecaptcha } = useGoogleReCaptcha();
  // const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const modalInputRef = useRef<HTMLInputElement>(null);

  // 入力初期化
  const handleModalInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (ev.currentTarget.checked) return;

    if (isSuccess) {
      reset();
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Schema>({
    defaultValues: {
      name: "",
      email: "",
      topic: "",
      message: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    const token = await executeRecaptcha!("Contact");
    const res = await fetch(`/api/form?token=${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timestamp: dayjs().format("YYYY/MM/DD HH:mm"),
        name: data.name,
        email: data.email,
        title: data.topic,
        content: data.message,
      }),
    });

    setIsSuccess(res.status === 200);
    if (modalInputRef.current) {
      modalInputRef.current.click();
    }
  });

  return (
    <>
      <RecaptchaVisibleStyle />
      <div
        className="contact-container-outer"
        style={{
          backgroundImage: isWide
            ? "url(/contact/pc/bg.svg)"
            : "url(/contact/sp/bg.svg)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <BgPattern />
        <div className="contact-container-inner">
          <ContactHeader title="CONTACT" />
          <form className="contact-form-container-outer" onSubmit={onSubmit}>
            <div className="contact-form-container-inner">
              <div className="text-center mb-4">
                <p className="text-white text-sm leading-6 tab:text-xl tab:leading-10">
                  こちらのフォームは
                  <br className="tab:hidden" />
                  企業様用お問い合わせフォームです。
                  <br />
                  サービスに関するお問い合わせは
                  <a
                    target="_blank"
                    href="https://tbrnk.tobiratory.com/pages/contact/"
                    className="link link-info"
                  >
                    こちら
                  </a>
                  。
                </p>
              </div>
              <div>
                <div className="contact-input-container">
                  <input
                    {...register("name")}
                    id="name"
                    type="text"
                    className="contact-input"
                    placeholder="Your name*"
                  />
                </div>
                {errors.name && (
                  <p className="contact-errors-text">{errors.name.message}</p>
                )}
              </div>
              <div>
                <div className="contact-input-container">
                  <input
                    {...register("email")}
                    id="email"
                    type="email"
                    className="contact-input"
                    placeholder="E-Mail address*"
                  />
                </div>
                {errors.email && (
                  <p className="contact-errors-text">{errors.email.message}</p>
                )}
              </div>
              <div>
                <div className="contact-input-container">
                  <input
                    {...register("topic")}
                    id="topic"
                    type="text"
                    className="contact-input"
                    placeholder="Topic*"
                  />
                </div>
                {errors.topic && (
                  <p className="contact-errors-text">{errors.topic.message}</p>
                )}
              </div>

              <div>
                <div className="contact-area-container">
                  <textarea
                    {...register("message")}
                    id="message"
                    className="contact-area"
                    placeholder="Message*"
                  />
                </div>
                {errors.message && (
                  <p className="contact-errors-text">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button className="contact-submit" type="submit">
                SUBMIT NOW
              </button>
            </div>
          </form>
        </div>
        <input
          type="checkbox"
          id="contact-submit-modal"
          className="modal-toggle"
          ref={modalInputRef}
          onChange={handleModalInputChange}
        />
        <SubmitModal isSuccess={isSuccess} />
      </div>
    </>
  );
};

export default Contact;
