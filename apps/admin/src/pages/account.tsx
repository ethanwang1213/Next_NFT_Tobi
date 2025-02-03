import { getMessages } from "admin/messages/messages";
import {
  hasAppleAccount,
  hasGoogleAccount,
  hasPasswordAccount,
  useAuth,
} from "contexts/AdminAuthProvider";
import { auth } from "fetchers/firebase/client";
import { ImageType, uploadImage } from "fetchers/UploadActions";
import { unlink } from "firebase/auth";
import useRestfulAPI from "hooks/useRestfulAPI";
import { GetStaticPropsContext, Metadata } from "next";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { User } from "types/adminTypes";
import AppleIcon from "ui/atoms/AppleIcon";
import GoogleIcon from "ui/atoms/GoogleIcon";
import PasswordPromptDialog from "ui/molecules/PasswordPromptDialog";
import BirthdayEditDialog from "ui/organisms/admin/BirthdayEditDialog";
import GenderEditDialog from "ui/organisms/admin/GenderEditDialog";
import ImageCropDialog from "ui/organisms/admin/ImageCropDialog";

export const metadata: Metadata = {
  title: "Account Setting",
};

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}

const valueClass =
  "text-[20px] font-normal flex-1 overflow-hidden text-ellipsis whitespace-nowrap";
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
      className={`flex border-b-[0.5px] border-secondary py-4 mr-7
    ${alignTop ? "items-start" : "items-center"} `}
    >
      <span className="w-[155px] shrink-0 text-[16px] text-base-200-content font-normal break-words">
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
  const [siteUrl, setSiteUrls] = useState("");
  const t = useTranslations("Account");

  const layoutClass = "flex items-center gap-4 mb-4";

  useEffect(() => {
    const twitterRegex = /^https?:\/\/(www\.)?x\.com\//i;
    const instagramRegex = /^https?:\/\/(www\.)?instagram\.com\//i;
    const facebookRegex = /^https?:\/\/(www\.)?facebook\.com\//i;
    const youtubeRegex = /^https?:\/\/(www\.)?youtube\.com\//i;

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
        if (link !== "") setSiteUrls(link);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateUrl = (type: string, url: string) => {
    let isValid = true;
    let errorMessage = "";

    if (type === "facebook") {
      const facebookRegex = /^https?:\/\/(www\.)?facebook\.com\//i;
      if (!facebookRegex.test(url)) {
        isValid = false;
        errorMessage = t("Errors.FacebookUrl");
      }
    } else if (type === "youtube") {
      const youtubeRegex = /^https?:\/\/(www\.)?youtube\.com\//i;
      if (!youtubeRegex.test(url)) {
        isValid = false;
        errorMessage = t("Errors.YouTubeUrl");
      }
    } else if (type === "siteLink") {
      const siteLinkRegex = /^https?:\/\//i;
      if (!siteLinkRegex.test(url)) {
        isValid = false;
        errorMessage = t("Errors.SiteLink");
      }
    }

    return { isValid, errorMessage };
  };

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

  const socialLinksValidation = (type, url) => {
    let validation = { isValid: true, errorMessage: "" };
    if (type === 2) validation = validateUrl("facebook", url);
    if (type === 3) validation = validateUrl("youtube", url);
    if (type >= 4) validation = validateUrl("siteLink", url);

    if (!validation.isValid) {
      toast.dismiss();
      toast.error(validation.errorMessage);
    }
  };

  const urlChangeHandler = (type, url) => {
    const newUrls = [
      twitterUrl,
      instagramUrl,
      facebookUrl,
      youtubeUrl,
      siteUrl,
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
        setSiteUrls(url);
        newUrls[4] = url;
        break;
    }
    changeHandler(newUrls.filter((value) => value !== null && value !== ""));
  };

  return (
    <div className="flex flex-col gap-2 px-2 w-full">
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
          onBlur={() => {
            socialLinksValidation(2, facebookUrl);
          }}
          placeholder="https://example.com"
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
          onBlur={() => {
            socialLinksValidation(3, youtubeUrl);
          }}
          placeholder="https://example.com"
        />
      </div>
      <div className="flex gap-4">
        <Image
          width={23}
          height={23}
          src="/admin/images/icon/globe-icon.svg"
          alt="social icon"
          className="cursor-pointer"
          onClick={() => {
            handleRedirect("social", siteUrl);
          }}
        />
        <span className="text-[22px] font-semibold text-placeholder-color">
          Site Link
        </span>
      </div>
      <input
        type="text"
        className={`${valueClass} flex-1 outline-none ml-10`}
        value={siteUrl}
        onChange={(e) => urlChangeHandler(4, e.target.value)}
        placeholder="https://example.com"
        onBlur={() => {
          socialLinksValidation(4, siteUrl);
        }}
      />
    </div>
  );
};

export default function Index() {
  const apiUrl = "native/my/profile";
  const [modified, setModified] = useState(false);
  const router = useRouter();
  const { data, dataRef, error, loading, setData, setLoading, postData } =
    useRestfulAPI(apiUrl);
  const { setUser } = useAuth();

  const birthEditDialogRef = useRef(null);
  const genderEditDialogRef = useRef(null);
  const imageFileRef = useRef(null);
  const profileIconCropDlgRef = useRef(null);
  const t = useTranslations("Account");
  const [tempImageUrlProfile, setTempImageUrlProfile] = useState(null);
  const [openPasswordPrompt, setOpenPasswordPrompt] = useState(false);

  useEffect(() => {
    if (true) return;
    unlink(auth.currentUser, "password").then(() => {
      console.log("Unlinked");
    });
  }, []);
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
    if (!data?.username || data.username.trim() === "") {
      toast(t("EnterName"));
      return;
    }

    if (data.userId.length < 5) {
      toast(t("UserIdTooShort"));
      return;
    }

    if (data && data.icon != dataRef?.current.icon) {
      setLoading(true);
      const iconUrl = await uploadImage(data.icon, ImageType.AccountAvatar);
      submitData.icon = iconUrl;
    }

    if (await postData(apiUrl, { account: submitData }, ["account"])) {
      setModified(false);
      const updatedUser: User = {
        uuid: data?.userId,
        name: data?.username,
        email: data?.email,
        icon: data?.icon,
        emailVerified: true,
        hasTobiratoryAccount: true,
        hasFlowAccount: true,
        hasBusinessAccount: "exist",
      };

      setUser(updatedUser);
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
    if (field === "userId") {
      const sanitizedValue = value.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 20);
      setData({ ...data, [field]: sanitizedValue });
    } else {
      setData({ ...data, [field]: value });
    }
    setModified(true);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempImageUrlProfile(reader.result);
        profileIconCropDlgRef.current?.showModal();
      };
      reader.readAsDataURL(file);
    }

    e.target.value = "";
  };

  const handleClickEmailEditButton = () => {
    router.push("/auth/email_update");
  };

  const handleClickPasswordEditButton = () => {
    router.push("/auth/password_update");
  };

  return (
    <div className="pt-9 pr-5 pl-12 pb-5 flex flex-col gap-5 min-w-[600px]">
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
              className="text-[14px] bg-primary text-white font-normal rounded-lg px-3 py-[6px] w-[90px]"
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
                value={data?.userId ? `@${data.userId}` : ""}
                placeholder={t("UserIdNoSpaces")}
                onChange={(e) => fieldChangeHandler("userId", e.target.value)}
              />
            </AccountFieldComponent>
            <AccountFieldComponent label={t("AboutMe")} alignTop={true}>
              <textarea
                className={`${valueClass} h-[118px] outline-none resize-none`}
                value={data?.aboutMe || ""}
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
                  !data?.gender ? "text-placeholder-color" : "text-secondary"
                }`}
              >
                {data?.gender === "Male" ||
                data?.gender === "Female" ||
                data?.gender === "NoAnswer"
                  ? t(data.gender)
                  : data?.gender
                    ? data.gender
                    : t("NotSet")}
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
                onClick={handleClickPasswordEditButton}
              >
                {t("Edit")}
              </button>
            </AccountFieldComponent>
            <AccountFieldComponent label={t("SocialLogin")}>
              <div className="flex justify-between w-full">
                <div className="flex gap-[17px]">
                  <GoogleIcon
                    width={48}
                    height={48}
                    disabled={!hasGoogleAccount()}
                  />
                  <AppleIcon size="3x" disabled={!hasAppleAccount()} />
                </div>
                <button
                  className={editBtnClass}
                  onClick={() => router.push("/auth/sns_account")}
                >
                  {t("Edit")}
                </button>
              </div>
            </AccountFieldComponent>
          </div>
          <GenderEditDialog
            initialValue={data?.gender || ""}
            dialogRef={genderEditDialogRef}
            changeHandler={(value) => fieldChangeHandler("gender", value)}
          />
          <BirthdayEditDialog
            initialValue={data?.birth}
            dialogRef={birthEditDialogRef}
            changeHandler={(value) => fieldChangeHandler("birth", value)}
          />
          <PasswordPromptDialog
            isOpen={openPasswordPrompt}
            onClickCancel={() => setOpenPasswordPrompt(false)}
            onClickNext={handleClickPasswordEditButton}
          />
        </div>
      )}
      <input
        ref={imageFileRef}
        type="file"
        accept=".png, .jpg, .jpeg, .gif"
        onChange={(e) => handleFileInputChange(e)}
        className="hidden"
      />
      <ImageCropDialog
        initialValue={tempImageUrlProfile}
        dialogRef={profileIconCropDlgRef}
        aspectRatio={1}
        cropHandler={(image) => {
          fieldChangeHandler("icon", image);
          setTempImageUrlProfile(null);
        }}
        circle={true}
        classname="w-[520px]"
      />
    </div>
  );
}
