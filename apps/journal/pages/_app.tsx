import type { AppProps } from "next/app";
import "../styles/global.scss";
import Script from "next/script";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { AuthProvider } from "@/contexts/AuthProvider";
import RedeemStatusContextProvider from "@/contexts/RedeemContextProvider";
import BookContextProvider from "@/contexts/BookContextProvider";
import { EditProfileProvider } from "@/contexts/EditProfileProvider";
import { HoldNFTsProvider } from "@/contexts/HoldNFTsProvider";
import { ActivityRecordProvider } from "@/contexts/ActivityRecordProvider";

config.autoAddCss = false;

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <Script id="font">
        {`(function(d) {
          var config = {
            kitId: 'ysy1ycw',
            scriptTimeout: 3000,
            async: true
          },
          h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
        })(document);`}
      </Script>
      <BookContextProvider>
        <ActivityRecordProvider>
          <HoldNFTsProvider>
            <RedeemStatusContextProvider>
              <EditProfileProvider>
                <Component {...pageProps} />
              </EditProfileProvider>
            </RedeemStatusContextProvider>
          </HoldNFTsProvider>
        </ActivityRecordProvider>
      </BookContextProvider>
    </AuthProvider>
  );
};

export default App;
