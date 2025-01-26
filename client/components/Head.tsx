import NextHead from "next/head";

type Props = {
  title?: string;
};

const getTitle = (title?: string) => {
  if (title) {
    return `${title} - DownToMinutes | The #1 Goal Tracking website`;
  }

  return "DownToMinutes | The #1 Goal Tracking website";
};

export const Head: React.FC<Props> = ({ title }) => (
  <NextHead>
    <title>{getTitle(title)}</title>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1,user-scalable=0"
    />
    <meta property="og:title" content={process.env.NEXT_PUBLIC_APP_NAME} />
    <meta
      property="og:description"
      content="Convert visitors into buyers with a powerful AI-powered assistant tailored to your business that works 24/7 to provide instant support, qualify leads, and close sales on autopilot. No coding required, ready to use in just 2 minutes."
    />
    <meta property="og:site_name" content={process.env.NEXT_PUBLIC_APP_NAME} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@noahflk" />
    <meta property="og:url" content={process.env.NEXT_PUBLIC_APP_URL} />
    <meta property="og:type" content="website" />
    <meta
      property="og:image"
      content={`${process.env.NEXT_PUBLIC_APP_URL}/images/social.jpg`}
    />
    <meta
      property="og:image:alt"
      content={`${process.env.NEXT_PUBLIC_APP_NAME} social image`}
    />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="en_US" />
  </NextHead>
);
