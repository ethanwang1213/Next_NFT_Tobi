import { getMessages } from "admin/messages/messages";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale),
    },
  };
}
const ErrorPage_401 = () => {
  const e = useTranslations("error_401");
  return (
    <div className="flex min-h-screen justify-center items-center font-mplus px-4">
      <div className="w-screen md:w-[1000px] h-[600px] py-10 sm:p-0 flex md:flex-row justify-between">
        <div className="flex flex-col w-full md:w-1/2 relative">
          <img 
            src="/admin/images/error/401_text.svg" 
            alt="401 error" 
            className="w-[40%] md:w-[480px] ml-[25px] transition-all duration-300"
          />
          <div className="flex flex-col items-center mt-4">
            <div className="text-[5vw] md:text-[32px] font-bold">{e("title")}</div>
            <div className="text-[3vw] md:text-[16px] mt-4 text-center">{e("content")}</div>
          </div>
          <div className="absolute bottom-[34px] left-0 w-full px-4">
            <hr className="border-t-2 border-gray-400 my-4"/>
            <div>
              <div className="text-[4vw] md:text-[18px] font-bold">{e("bottomTitle")}</div>
              <ul className="ml-5 mt-2 text-[3vw] md:text-[14px] list-disc">
                <li>{e("list")}</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center w-full md:w-1/2">
          <img 
            src="/admin/images/error/401.svg" 
            alt="401 error" 
            className="w-[70%] md:w-auto mx-auto transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default ErrorPage_401;
