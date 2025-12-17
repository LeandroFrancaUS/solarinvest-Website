import type { MetadataRoute } from "next";

const siteUrl = "https://solarinvest.info";
const logoUrl = `${siteUrl}/assets/logo-solarinvest.png`;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [
        {
          url: logoUrl,
          title: "SolarInvest Solutions",
        },
      ],
    },
  ];
}
