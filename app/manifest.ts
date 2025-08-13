import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dandori Scheduler",
    short_name: "Scheduler",
    description: "工事現場の職人スケジュール管理システム",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#111827",
    orientation: "portrait",
    scope: "/",
    icons: [
      { 
        src: "/icon-192.png", 
        sizes: "192x192", 
        type: "image/png",
        purpose: "any"
      },
      { 
        src: "/icon-512.png", 
        sizes: "512x512", 
        type: "image/png",
        purpose: "any"
      },
      { 
        src: "/apple-touch-icon.png", 
        sizes: "180x180", 
        type: "image/png", 
        purpose: "maskable any"
      }
    ],
    categories: ["business", "productivity"],
    lang: "ja",
    dir: "ltr",
    prefer_related_applications: false,
    related_applications: []
  };
}