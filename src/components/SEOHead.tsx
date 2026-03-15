import { Helmet } from "react-helmet-async";

const SITE_NAME = "Nice Guy University";
const DEFAULT_OG_IMAGE = "/og-image.jpg";
const TWITTER_HANDLE = "@michaelzick"; // Update with actual handle

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
}

export default function SEOHead({
  title,
  description,
  canonicalPath,
  ogImage,
  ogType = "website",
  noIndex = false,
}: SEOHeadProps) {
  const siteUrl = import.meta.env.VITE_SITE_URL || "";
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonicalUrl = canonicalPath ? `${siteUrl}${canonicalPath}` : undefined;
  const ogImageUrl = ogImage
    ? ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`
    : `${siteUrl}${DEFAULT_OG_IMAGE}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImageUrl} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
    </Helmet>
  );
}
