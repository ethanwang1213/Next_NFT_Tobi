import { ImageType, uploadImage } from "fetchers/UploadActions";
import useRestfulAPI from "hooks/useRestfulAPI";
import { Metadata } from "next";
import Image from "next/image";
import { ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import BirthdayEditDialog from "ui/organisms/admin/BirthdayEditDialog";
import GenderEditDialog from "ui/organisms/admin/GenderEditDialog";

export const metadata: Metadata = {
  title: "Account Setting",
};

const valueClass = "text-[26px] text-secondary font-normal flex-1";
const editBtnClass = "text-[26px] text-primary font-normal";

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
      className={`flex border-b-[0.5px] border-secondary py-6 
    ${alignTop ? "items-start" : "items-center"} `}
    >
      <span className="w-[172px] text-[26px] text-base-200-content font-normal break-words">
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
          width={34}
          height={30}
          src="/admin/images/icon/twitter-icon.svg"
          alt="twitter icon"
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
          width={34}
          height={34}
          src="/admin/images/icon/instagram-icon.svg"
          alt="instagram icon"
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
          width={34}
          height={34}
          src="/admin/images/icon/facebook-icon.svg"
          alt="facebook icon"
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
          width={34}
          height={28}
          src="/admin/images/icon/youtube-icon.svg"
          alt="youtube icon"
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
              width={34}
              height={34}
              src="/admin/images/icon/globe-icon.svg"
              alt="social icon"
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
          width={34}
          height={28}
          src="/admin/images/icon/add-social-icon.svg"
          alt="add social icon"
        />
        <span className={`${valueClass} flex-1 outline-none`}>
          外部リンクを追加
        </span>
      </div>
    </div>
  );
};

export default function Index() {
  const apiUrl = "native/my/profile";
  const [modified, setModified] = useState(false);
  const { data, dataRef, error, loading, setData, setLoading, postData } =
    useRestfulAPI(apiUrl);

  const birthEditDialogRef = useRef(null);
  const genderEditDialogRef = useRef(null);
  const imageFileRef = useRef(null);

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
    if (data && data.icon != dataRef?.current.icon) {
      // upload image
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

  const fieldChangeHandler = (field, value) => {
    setData({ ...data, [field]: value });
    setModified(true);
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    // Check if a file is selected
    if (file) {
      fieldChangeHandler("icon", URL.createObjectURL(file));
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
            className={`text-xl h-14 text-white rounded-[30px] px-10
              ${modified ? "bg-primary" : "bg-inactive"}
            `}
            disabled={!modified}
            onClick={submitHandler}
          >
            SAVE
          </button>
        )}
      </div>
      {data && (
        <div className="flex gap-10">
          <div className="w-40 flex flex-col items-center gap-6">
            <Image
              width={144}
              height={144}
              src={
                data?.icon ? data.icon : "/admin/images/png/account-place.png"
              }
              alt="avatar image"
              className="rounded-full"
            />
            <button
              className="text-[22px] text-primary font-normal"
              onClick={() => {
                if (imageFileRef.current) {
                  imageFileRef.current.click();
                }
              }}
            >
              Edit Picture
            </button>
          </div>
          <div className="flex-1 flex flex-col mr-24">
            <AccountFieldComponent label={"User name"}>
              <input
                type="text"
                className={`${valueClass} outline-none`}
                value={data?.username}
                onChange={(e) => fieldChangeHandler("username", e.target.value)}
              />
            </AccountFieldComponent>
            <AccountFieldComponent label={"User ID"}>
              <input
                type="text"
                className={`${valueClass} outline-none`}
                value={data?.userId ?? ""}
                onChange={(e) => fieldChangeHandler("userId", e.target.value)}
              />
            </AccountFieldComponent>
            <AccountFieldComponent label={"About me"} alignTop={true}>
              <textarea
                className={`${valueClass} h-[200px] outline-none resize-none`}
                value={data?.aboutMe}
                onChange={(e) => fieldChangeHandler("aboutMe", e.target.value)}
              />
            </AccountFieldComponent>
            <AccountFieldComponent label={"Social media"} alignTop={true}>
              <SocialLinksComponent
                socialLinks={data?.socialLinks}
                changeHandler={(v) => fieldChangeHandler("socialLinks", v)}
              />
            </AccountFieldComponent>
            <AccountFieldComponent label={"Gender"}>
              <span className={`${valueClass}`}>
                {data?.gender || "Not Set"}
              </span>
              <button
                className={editBtnClass}
                onClick={() => {
                  if (genderEditDialogRef.current) {
                    genderEditDialogRef.current.showModal();
                  }
                }}
              >
                Edit
              </button>
            </AccountFieldComponent>
            <AccountFieldComponent label={"Birthday"}>
              <span className={`${valueClass}`}>
                {data?.birth || "Not Set"}
              </span>
              <button
                className={editBtnClass}
                onClick={() => {
                  if (birthEditDialogRef.current) {
                    birthEditDialogRef.current.showModal();
                  }
                }}
              >
                Edit
              </button>
            </AccountFieldComponent>
            <AccountFieldComponent label={"Email"}>
              <span className={`${valueClass}`}>
                {data?.email || "Not Set"}
              </span>
              <button className={editBtnClass}>Edit</button>
            </AccountFieldComponent>
            <AccountFieldComponent label={"Password"}>
              <span className={`${valueClass}`}>****</span>
              <button className={editBtnClass}>Edit</button>
            </AccountFieldComponent>
            <AccountFieldComponent label={"Social Account"}>
              <span className={`${valueClass}`}></span>
              <button className={editBtnClass}>Edit</button>
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
