/**
 * Sitemap Generator
 *
 * Run after build: tsx scripts/generate-sitemap.ts
 *
 * Generates sitemap.xml in dist/ with:
 * - Static routes (/, /courses, /about)
 * - Dynamic course routes from Supabase
 * - Dynamic resource routes from Supabase (when the table exists)
 */

import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "fs";
import { resolve } from "path";

const SITE_URL = process.env.VITE_SITE_URL || "https://michaelzick.com";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "⚠️  Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Generating sitemap with static routes only."
  );
}

interface SitemapEntry {
  loc: string;
  changefreq: string;
  priority: string;
  lastmod?: string;
}

async function fetchCourseSlugs(): Promise<string[]> {
  if (!supabaseUrl || !supabaseKey) return [];

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from("courses")
    .select("slug")
    .eq("published", true);

  if (error) {
    console.warn("⚠️  Error fetching courses:", error.message);
    return [];
  }

  return (data || []).map((c) => c.slug);
}

async function fetchResourceSlugs(): Promise<string[]> {
  if (!supabaseUrl || !supabaseKey) return [];

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from("resources")
    .select("slug")
    .eq("published", true);

  if (error) {
    // Table may not exist yet — that's fine
    return [];
  }

  return (data || []).map((r) => r.slug);
}

function buildSitemapXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (e) => `  <url>
    <loc>${e.loc}</loc>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ""}
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

async function main() {
  const today = new Date().toISOString().split("T")[0];

  // Static routes
  const entries: SitemapEntry[] = [
    { loc: `${SITE_URL}/`, changefreq: "weekly", priority: "1.0", lastmod: today },
    { loc: `${SITE_URL}/courses`, changefreq: "weekly", priority: "0.9", lastmod: today },
    { loc: `${SITE_URL}/about`, changefreq: "monthly", priority: "0.8", lastmod: today },
  ];

  // Dynamic course routes
  const courseSlugs = await fetchCourseSlugs();
  for (const slug of courseSlugs) {
    entries.push({
      loc: `${SITE_URL}/course/${slug}`,
      changefreq: "weekly",
      priority: "0.8",
      lastmod: today,
    });
  }

  // Dynamic resource routes
  const resourceSlugs = await fetchResourceSlugs();
  for (const slug of resourceSlugs) {
    entries.push({
      loc: `${SITE_URL}/resources/${slug}`,
      changefreq: "monthly",
      priority: "0.7",
      lastmod: today,
    });
  }

  if (resourceSlugs.length > 0) {
    entries.splice(3, 0, {
      loc: `${SITE_URL}/resources`,
      changefreq: "weekly",
      priority: "0.8",
      lastmod: today,
    });
  }

  const xml = buildSitemapXml(entries);
  const outPath = resolve(process.cwd(), "dist", "sitemap.xml");

  writeFileSync(outPath, xml, "utf-8");
  console.log(`✅ Sitemap generated with ${entries.length} URLs → ${outPath}`);
}

main().catch((err) => {
  console.error("❌ Sitemap generation failed:", err);
  process.exit(1);
});
