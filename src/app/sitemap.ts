import { MetadataRoute } from "next"
import { CITIES } from "@/data/cities"

const BASE = "https://dmv-prep.com"
const STATES = ["california","florida","texas","new-york","pennsylvania","illinois","ohio","georgia","north-carolina","michigan"]
const LANGS = ["spanish","chinese","vietnamese","portuguese","haitian-creole"]
const CLUSTER = ["dmv-practice-test","road-sign-practice-test","permit-test-questions","dmv-handbook-summary","dmv-test-tips","dmv-cheat-sheet"]
const GUIDES = ["what-does-stop-sign-mean","yield-sign-meaning","right-of-way-rules","lane-markings-explained","speed-limit-sign-rules","railroad-crossing-rules","school-zone-speed-limit","no-passing-zone-meaning","how-to-pass-dmv-test"]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const e: MetadataRoute.Sitemap = []

  // Static pages
  const statics = [
    { url: "/", priority: 1.0 },
    { url: "/states", priority: 0.9 },
    { url: "/pricing", priority: 0.8 },
    { url: "/about", priority: 0.5 },
    { url: "/lessons", priority: 0.8 },
    { url: "/road-signs-practice-test", priority: 0.9 },
    { url: "/dmv-exam-simulator", priority: 0.9 },
    { url: "/permit-test-practice", priority: 0.9 },
    { url: "/dmv-cheat-sheet", priority: 0.9 },
    { url: "/florida-dmv-test-english-only", priority: 0.95 },
    { url: "/florida-dmv-test-english-only-spanish", priority: 0.9 },
    { url: "/florida-dmv-test-english-only-haitian-creole", priority: 0.9 },
    { url: "/florida-dmv-test-english-only-portuguese", priority: 0.9 },
    { url: "/how-to-pass-florida-dmv-test-in-english", priority: 0.9 },
    { url: "/dmv-test-english-only-states", priority: 0.85 },
    { url: "/how-many-questions-on-dmv-test", priority: 0.7 },
    { url: "/dmv-test-passing-score-by-state", priority: 0.7 },
    { url: "/how-to-get-a-learners-permit", priority: 0.7 },
    { url: "/dmv-faq", priority: 0.7 },
    { url: "/dmv-practice-test", priority: 0.8 },
    { url: "/dmv-written-test", priority: 0.7 },
    { url: "/permit-test-questions", priority: 0.8 },
    { url: "/regulatory-signs-test", priority: 0.7 },
    { url: "/warning-signs-test", priority: 0.7 },
    { url: "/dmv-test-for-immigrants", priority: 0.85 },
    { url: "/dmv-test-for-seniors", priority: 0.85 },
    { url: "/dmv-test-for-first-time-drivers", priority: 0.85 },
    { url: "/dmv-test-for-non-english-speakers", priority: 0.85 },
  ]
  statics.forEach(p => e.push({ url: BASE+p.url, lastModified: now, changeFrequency: "weekly", priority: p.priority }))

  // State cluster pages
  STATES.forEach(slug => {
    CLUSTER.forEach(page => e.push({
      url: BASE+"/state/"+slug+"/"+page,
      lastModified: now,
      changeFrequency: "weekly",
      priority: page === "dmv-practice-test" ? 0.9 : page === "dmv-cheat-sheet" ? 0.85 : 0.8
    }))

    // Numbered practice tests
    for (let n = 1; n <= 10; n++) {
      e.push({ url: BASE+"/state/"+slug+"/dmv-practice-test-"+n, lastModified: now, changeFrequency: "monthly", priority: 0.7 })
    }

    // Language pages
    LANGS.forEach(lang => {
      e.push({ url: BASE+"/"+slug+"-dmv-practice-test-"+lang, lastModified: now, changeFrequency: "monthly", priority: 0.6 })
    })
  })

  // City pages
  CITIES.forEach(city => {
    e.push({ url: BASE+"/city/"+city.slug, lastModified: now, changeFrequency: "monthly", priority: 0.75 })
  })

  // DMV guide articles
  GUIDES.forEach(g => e.push({ url: BASE+"/dmv-guide/"+g, lastModified: now, changeFrequency: "monthly", priority: 0.6 }))

  return e
}
