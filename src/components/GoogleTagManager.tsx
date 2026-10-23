import Script from "next/script";
import { CONSENT_KEY } from "@/lib/consent";
import { GTM_ID, LIVE_HOSTNAMES, trackingEnabled } from "@/lib/tracking";

/**
 * Google Tag Manager, using the container already running on the live site. Rendered in the public chrome only
 * (never on /admin) and it switches on only when the page is served from the live domain (LIVE_HOSTNAMES). Page code pushes conversions to `window.dataLayer`
 * through `trackEvent` (src/lib/analytics.ts); the container decides what to send to GA4 or ads.
 *
 * Google Consent Mode v2: all four signals default to "denied" before gtm.js loads, and a stored choice from the
 * cookie banner (src/lib/consent.ts) is replayed straight away so returning visitors are not asked again.
 */
export default function GoogleTagManager() {
  if (!trackingEnabled()) return null;

  const init = `(function(w,d,s,l,i,hosts,k){
if(hosts.indexOf(w.location.hostname)<0)return;
w[l]=w[l]||[];
function gtag(){w[l].push(arguments);}
gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});
try{var c=JSON.parse(w.localStorage.getItem(k)||'null');if(c&&c.v===1){var a=c.analytics?'granted':'denied',m=c.marketing?'granted':'denied';gtag('consent','update',{analytics_storage:a,ad_storage:m,ad_user_data:m,ad_personalization:m});}}catch(e){}
w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer',${JSON.stringify(GTM_ID)},${JSON.stringify(LIVE_HOSTNAMES)},${JSON.stringify(CONSENT_KEY)});`;

  return (
    <>
      <Script id="gtm-init" strategy="afterInteractive">
        {init}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
