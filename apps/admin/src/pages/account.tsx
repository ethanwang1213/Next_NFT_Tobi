import {
  hasAppleAccount,
  hasGoogleAccount,
  hasPasswordAccount,
} from "contexts/AdminAuthProvider";
import { auth } from "fetchers/firebase/client";
import { ImageType, uploadImage } from "fetchers/UploadActions";
import useRestfulAPI from "hooks/useRestfulAPI";
import { GetStaticPropsContext, Metadata } from "next";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import AppleIcon from "ui/atoms/AppleIcon";
import GoogleIcon from "ui/atoms/GoogleIcon";
import BirthdayEditDialog from "ui/organisms/admin/BirthdayEditDialog";
import EmailEditDialog from "ui/organisms/admin/EmailEditDialog";
import GenderEditDialog from "ui/organisms/admin/GenderEditDialog";

export const metadata: Metadata = {
  title: "Account Setting",
};

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  };
}

const valueClass = "text-[20px] font-normal flex-1";
const editBtnClass = "text-[20px] text-primary font-normal";

const AccountFieldComponent = ({
  label,
  alignTop,
  children,
}: {
  label: string;
  alignTop?: boolean;
  children?: ReactNode;
}) => {
  return (
    <div
      className={`flex border-b-[0.5px] border-secondary py-4 
    ${alignTop ? "items-start" : "items-center"} `}
    >
      <span className="w-[122px] shrink-0 text-[16px] text-base-200-content font-normal break-words">
        {label}
      </span>
      {children}
    </div>
  );
};

const SocialLinksComponent = ({ socialLinks, changeHandler }) => {
  const [twitterUrl, setTwitterUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [urls, setUrls] = useState([]);
  const t = useTranslations("Account");

  const layoutClass = "flex items-center gap-4 mb-4";

  useEffect(() => {
    const twitterRegex = /^https?:\/\/(www\.)?x\.com\//i;
    const instagramRegex = /^https?:\/\/(www\.)?instagram\.com\//i;
    const facebookRegex = /^https?:\/\/(www\.)?facebook\.com\//i;
    const youtubeRegex = /^https?:\/\/(www\.)?youtube\.com\//i;

    const newUrls = [];
    socialLinks.forEach((link) => {
      if (twitterRegex.test(link)) {
        setTwitterUrl(link);
      } else if (instagramRegex.test(link)) {
        setInstagramUrl(link);
      } else if (facebookRegex.test(link)) {
        setFacebookUrl(link);
      } else if (youtubeRegex.test(link)) {
        setYoutubeUrl(link);
      } else {
        if (link != "") newUrls.push(link);
      }
    });
    setUrls(newUrls);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const platforms = {
    X: "https://x.com/",
    Instagram: "https://instagram.com/",
  };

  const handleRedirect = (platform, userInput) => {
    let redirectUrl = userInput;
    if (platform === "X" || platform === "Instagram") {
      const baseUrl = platforms[platform];
      const userName = userInput.startsWith("@")
        ? userInput.slice(1)
        : userInput;
      redirectUrl = `${baseUrl}${userName}`;
    }
    window.open(redirectUrl, "_blank", "noreferrer");
  };

  const urlChangeHandler = (type, url) => {
    const newUrls = [
      twitterUrl,
      instagramUrl,
      facebookUrl,
      youtubeUrl,
      ...urls,
    ];
    switch (type) {
      case 0:
        setTwitterUrl(url);
        newUrls[0] = url;
        break;
      case 1:
        setInstagramUrl(url);
        newUrls[1] = url;
        break;
      case 2:
        setFacebookUrl(url);
        newUrls[2] = url;
        break;
      case 3:
        setYoutubeUrl(url);
        newUrls[3] = url;
        break;

      default:
        urls[type - 4] = url;
        setUrls(urls);
        newUrls[type] = url;
        break;
    }
    changeHandler(newUrls.filter((value) => value !== null && value !== ""));
  };

  return (
    <div className="flex flex-col gap-2 px-2">
      <div className={`${layoutClass}`}>
        <Image
          width={23}
          height={20}
          src="/admin/images/icon/twitter-icon.svg"
          alt="twitter icon"
          className="cursor-pointer"
          onClick={() => {
            handleRedirect("X", twitterUrl);
          }}
        />
        <input
          type="text"
          className={`${valueClass} flex-1 outline-none`}
          value={twitterUrl}
          onChange={(e) => urlChangeHandler(0, e.target.value)}
          placeholder="@userID"
        />
      </div>
      <div className={`${layoutClass}`}>
        <Image
          width={23}
          height={23}
          src="/admin/images/icon/instagram-icon.svg"
          alt="instagram icon"
          className="cursor-pointer"
          onClick={() => {
            handleRedirect("Instagram", instagramUrl);
          }}
        />
        <input
          type="text"
          className={`${valueClass} flex-1 outline-none`}
          value={instagramUrl}
          onChange={(e) => urlChangeHandler(1, e.target.value)}
          placeholder="@userID"
        />
      </div>
      <div className={`${layoutClass}`}>
        <Image
          width={23}
          height={23}
          src="/admin/images/icon/facebook-icon.svg"
          alt="facebook icon"
          className="cursor-pointer"
          onClick={() => {
            handleRedirect("facebook", facebookUrl);
          }}
        />
        <input
          type="text"
          className={`${valueClass} flex-1 outline-none`}
          value={facebookUrl}
          onChange={(e) => urlChangeHandler(2, e.target.value)}
          placeholder="http://example.com"
        />
      </div>
      <div className={`${layoutClass}`}>
        <Image
          width={23}
          height={20}
          src="/admin/images/icon/youtube-icon.svg"
          alt="youtube icon"
          className="cursor-pointer"
          onClick={() => {
            handleRedirect("youtube", youtubeUrl);
          }}
        />
        <input
          type="text"
          className={`${valueClass} flex-1 outline-none`}
          value={youtubeUrl}
          onChange={(e) => urlChangeHandler(3, e.target.value)}
          placeholder="http://example.com"
        />
      </div>
      {urls &&
        urls.map((url, index) => (
          <div key={`social-${index}`} className={`${layoutClass}`}>
            <Image
              width={23}
              height={23}
              src="/admin/images/icon/globe-icon.svg"
              alt="social icon"
              className="cursor-pointer"
              onClick={() => {
                handleRedirect("social", url);
              }}
            />
            <input
              type="text"
              className={`${valueClass} flex-1 outline-none`}
              value={url}
              onChange={(e) => urlChangeHandler(index + 4, e.target.value)}
              placeholder="http://example.com"
            />
          </div>
        ))}
      <div
        className={`${layoutClass} cursor-pointer`}
        onClick={() => {
          const newUrl = [...urls];
          newUrl.push("");
          setUrls(newUrl);
        }}
      >
        <Image
          width={23}
          height={20}
          src="/admin/images/icon/add-social-icon.svg"
          alt="add social icon"
        />
        <span className={`${valueClass} flex-1 outline-none`}>
          {t("AddLink")}
        </span>
      </div>
    </div>
  );
};

export default function Index() {
  const apiUrl = "native/my/profile";
  const [modified, setModified] = useState(false);
  const router = useRouter();
  const { data, dataRef, error, loading, setData, setLoading, postData } =
    useRestfulAPI(apiUrl);

  const birthEditDialogRef = useRef(null);
  const genderEditDialogRef = useRef(null);
  const imageFileRef = useRef(null);
  const emailEditDialogRef = useRef(null);
  const t = useTranslations("Account");
  const userIdRegex = /^[A-Za-z0-9_-]{5,20}$/;

  const submitHandler = async () => {
    const submitData = {
      userId: data?.userId,
      username: data?.username,
      email: data?.email,
      aboutMe: data?.aboutMe,
      socialLinks: data?.socialLinks,
      gender: data?.gender,
      birth: data?.birth,
      icon: data?.icon,
    };

    if (!userIdRegex.test(data.userId)) {
      toast("User ID cannot contain spaces.");
      return;
    }

    if (data && data.icon != dataRef?.current.icon) {
      setLoading(true);
      const iconUrl = await uploadImage(data.icon, ImageType.AccountAvatar);
      submitData.icon = iconUrl;
    }

    if (await postData(apiUrl, { account: submitData }, ["account"])) {
      setModified(false);
    } else {
      if (error) {
        if (error instanceof String) {
          toast(error);
        } else {
          toast(error.toString());
        }
      }
    }
  };

  const fieldChangeHandler = (field: string, value: string) => {
    setData({ ...data, [field]: value });
    setModified(true);
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      fieldChangeHandler("icon", URL.createObjectURL(file));
    }
  };

  const isEmailVerified = () => {
    return (
      auth.currentUser.emailVerified && data?.email === auth.currentUser.email
    );
  };

  const handleClickEmailEditButton = async () => {
    if (hasPasswordAccount()) {
      emailEditDialogRef.current?.showModal();
    } else {
      router.push("/auth/password_update");
    }
  };

  return (
    <div className="pt-9 pr-5 pl-12 pb-5 flex flex-col gap-5">
      <div className="h-14 flex justify-between items-start">
        <span className="text-3xl text-secondary-600 font-semibold">
          ACCOUNT
        </span>
        {loading ? (
          <span className="loading loading-spinner loading-md mr-14 mt-4 text-secondary-600"></span>
        ) : (
          <button
            className={`text-[20px] text-white rounded-[30px] px-6 py-2
              ${modified ? "bg-primary" : "bg-inactive"}
            `}
            disabled={!modified}
            onClick={submitHandler}
          >
            {t("Save")}
          </button>
        )}
      </div>
      {data && (
        <div className="flex gap-10">
          <div className="w-40 flex flex-col items-center gap-6">
            <Image
              width={96}
              height={96}
              src={
                data?.icon ? data.icon : "/admin/images/png/account-place.png"
              }
              alt="avatar image"
              className="rounded-full"
            />
            <button
              className="text-[14px] bg-primary text-white font-normal rounded-lg px-3 py-[6px]"
              onClick={() => {
                if (imageFileRef.current) {
                  imageFileRef.current.click();
                }
              }}
            >
              Edit Image
            </button>
          </div>
          <div className="flex-1 flex flex-col mr-24">
            <AccountFieldComponent label={t("UserName")}>
              <input
                type="text"
                className={`${valueClass} outline-none`}
                value={data?.username}
                onChange={(e) => fieldChangeHandler("username", e.target.value)}
              />
            </AccountFieldComponent>
            <AccountFieldComponent label={t("UserID")}>
              <input
                type="text"
                className={`${valueClass} outline-none`}
                value={data?.userId ?? ""}
                onChange={(e) => fieldChangeHandler("userId", e.target.value)}
              />
            </AccountFieldComponent>
            <AccountFieldComponent label={t("AboutMe")} alignTop={true}>
              <textarea
                className={`${valueClass} h-[118px] outline-none resize-none`}
                value={data?.aboutMe}
                placeholder={t("NotSet")}
                onChange={(e) => fieldChangeHandler("aboutMe", e.target.value)}
              />
            </AccountFieldComponent>
            <AccountFieldComponent label={t("SocialMedia")} alignTop={true}>
              <SocialLinksComponent
                socialLinks={data?.socialLinks}
                changeHandler={(v) => fieldChangeHandler("socialLinks", v)}
              />
            </AccountFieldComponent>
            <AccountFieldComponent label={t("Gender")}>
              <span
                className={`${valueClass} ${
                  !data.gender ? "text-placeholder-color" : "text-sencondary"
                }`}
              >
                {data?.gender || t("NotSet")}
              </span>
              <button
                className={editBtnClass}
                onClick={() => {
                  if (genderEditDialogRef.current) {
                    genderEditDialogRef.current.showModal();
                  }
                }}
              >
                {t("Edit")}
              </button>
            </AccountFieldComponent>
            <AccountFieldComponent label={t("Birthday")}>
              <span
                className={`${valueClass} ${
                  !data.birth ? "text-placeholder-color" : "text-sencondary"
                }`}
              >
                {data?.birth || t("NotSet")}
              </span>
              <button
                className={editBtnClass}
                onClick={() => {
                  if (birthEditDialogRef.current) {
                    birthEditDialogRef.current.showModal();
                  }
                }}
              >
                {t("Edit")}
              </button>
            </AccountFieldComponent>
            <AccountFieldComponent label={t("Email")}>
              <span className={`${valueClass} text-secondary`}>
                {auth.currentUser.email}
              </span>
              {!isEmailVerified() && (
                <div className="flex w-[148px] h-[48px] py-[8px] px-[16px] mr-[10px] justify-center items-center gap-[8px] rounded-[64px] bg-secondary">
                  <span className="text-base-white text-[20px] font-bold leading-[120%]">
                    {t("Unverified")}
                  </span>
                </div>
              )}
              <button
                className={editBtnClass}
                onClick={handleClickEmailEditButton}
              >
                {t("Edit")}
              </button>
            </AccountFieldComponent>
            <AccountFieldComponent label={t("Password")}>
              <span className={`${valueClass}`}>
                {hasPasswordAccount() ? "****" : t("NotSet")}
              </span>
              <button
                className={editBtnClass}
                onClick={() => router.push("/auth/password_update")}
              >
                {t("Edit")}
              </button>
            </AccountFieldComponent>
            <AccountFieldComponent label={"Social Account"}>
              <div className="flex w-full gap-[17px]">
                <GoogleIcon
                  width={48}
                  height={48}
                  disabled={!hasGoogleAccount()}
                />
                <AppleIcon size="3x" disabled={!hasAppleAccount()} />
              </div>
              <button
                className={`${editBtnClass} ${
                  router.locale === "jp" ? "w-12" : ""
                }`}
                onClick={() => router.push("/auth/sns_account")}
              >
                {t("Edit")}
              </button>
            </AccountFieldComponent>
          </div>
          <GenderEditDialog
            initialValue={data?.gender}
            dialogRef={genderEditDialogRef}
            changeHandler={(value) => fieldChangeHandler("gender", value)}
          />
          <BirthdayEditDialog
            initialValue={data?.birth}
            dialogRef={birthEditDialogRef}
            changeHandler={(value) => fieldChangeHandler("birth", value)}
          />
          <EmailEditDialog dialogRef={emailEditDialogRef} />
        </div>
      )}
      <input
        ref={imageFileRef}
        type="file"
        accept=".png, .jpg, .jpeg, .gif"
        onChange={(e) => handleFileInputChange(e)}
        className="hidden"
      />
    </div>
  );
}
