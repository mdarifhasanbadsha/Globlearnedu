import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/admin", "/partner", "/api/"],
      },
    ],
    sitemap: "https://globlearnedu.com/sitemap.xml",
  };
}
