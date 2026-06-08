import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://globlearnedu.com";
  const now = new Date();

  const staticPages = [
    { url: baseUrl, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/about`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/contact`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/faq`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/universities`, priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/programs`, priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/scholarships`, priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/blog`, priority: 0.8, changeFrequency: "daily" as const },
    { url: `${baseUrl}/compare`, priority: 0.7, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/track`, priority: 0.6, changeFrequency: "monthly" as const },
  ];

  const programs = [
    "mbbs-medicine", "bachelors-degree", "masters-degree",
    "phd-program", "chinese-language", "diploma-vocational",
    "foundation-pre-university", "short-course-exchange",
  ].map(slug => ({
    url: `${baseUrl}/programs/${slug}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  const universities = [
    "peking-university", "tsinghua-university", "fudan-university",
    "zhejiang-university", "wuhan-university", "huazhong-university-science-technology",
    "sichuan-university", "sun-yat-sen-university", "jilin-university",
    "nanjing-university", "harbin-institute-technology", "guangzhou-medical-university",
  ].map(slug => ({
    url: `${baseUrl}/universities/${slug}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  const blogSlugs = [
    "mbbs-in-china-2026-complete-guide",
    "csc-scholarship-2027-complete-guide",
    "china-student-visa-x1-guide-2026",
    "study-in-wuhan-guide",
    "university-scholarship-china-guide",
    "from-nigeria-to-wuhan-university-success-story",
    "cost-of-living-china-international-students-2026",
    "provincial-scholarship-china-guide",
    "ai-programs-china-universities-2026",
  ].map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  const countries = [
    "bangladesh", "nigeria", "pakistan", "india", "ghana",
    "kenya", "egypt", "ethiopia", "cameroon", "zimbabwe",
    "saudi-arabia", "iran", "indonesia", "malaysia", "morocco",
  ].map(country => ({
    url: `${baseUrl}/study-in-china-from-${country}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  return [
    ...staticPages,
    ...programs,
    ...universities,
    ...blogSlugs,
    ...countries,
  ].map(page => ({
    ...page,
    lastModified: now,
  }));
}
