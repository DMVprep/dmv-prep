import { MetadataRoute } from "next"
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/practice", "/progress", "/register", "/login"] },
    sitemap: "https://dmv-prep.com/sitemap.xml",
  }
}
