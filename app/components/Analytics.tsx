import Script from 'next/script';

/* GoatCounter: cookieless page-view counts, plus click events for elements
   with a data-goatcounter-click attribute (e.g. the resume PDF links).
   The site code comes from the GOATCOUNTER_CODE repository variable at
   deploy time; without it, nothing is loaded. */
const code = process.env.NEXT_PUBLIC_GOATCOUNTER_CODE;

export function Analytics() {
  if (!code) {
    return null;
  }

  return (
    <Script
      src="https://gc.zgo.at/count.js"
      data-goatcounter={`https://${code}.goatcounter.com/count`}
      strategy="afterInteractive"
    />
  );
}
