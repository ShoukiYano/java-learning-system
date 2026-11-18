import type { MetadataRoute } from "next";

// 検索エンジンのクローラーに対して /admin と /company と /api を完全に非公開化
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/student/login", "/student/signup"],
      disallow: ["/admin/", "/company/", "/student/", "/api/"],
    },
  };
}
