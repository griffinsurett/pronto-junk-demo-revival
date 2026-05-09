// src/siteData.ts - Compatible with both Astro and React
import { SITE_DOMAIN, SITE_URL } from "./siteDomain.js";

export const siteData = {
  title: "Pronto Junk Removal",
  legalName: "Pronto Junk Removal LLC",
  tagline: "Serving Middlesex County, NJ And More",
  description: "Fast, reliable junk removal based in Woodbridge, NJ. We handle rummage, cleanouts, demolition debris, and more — so you don't have to.",
  domain: SITE_DOMAIN,
  url: SITE_URL,
  location: "Woodbridge, NJ",
  address: "Woodbridge Township, NJ 07095",
  phone: "732-710-5405",
  phoneHref: "tel:+17327105405",
};

export const ctaData = {
  text: "Get a Free Quote",
  link: "#contact",
}
