/**
 * Single source of truth for club-wide facts. Every page, the footer, the
 * mentions légales, and the JSON-LD read from here — nothing is hardcoded twice.
 *
 * PLACEHOLDER VALUES: address, hours, phone, email, socials, and the legal block
 * are stand-ins until the real club data lands (open questions 2, 4). Search for
 * "TODO(real-data)" and replace.
 */

export type SiteHours = { label: string; value: string };
export type SiteSocial = { label: string; url: string };

export const site = {
  name: "Saint Rambert Tennis Club",
  shortName: "SRTC",
  // Production origin, hardcoded so preview deployments never emit preview
  // hostnames in metadataBase, sitemap, or OG image URLs.
  // TODO(real-data): set to the real domain once bought (open question 1).
  url: "https://www.saint-rambert-tc.fr",
  tagline: "Le tennis au pied des coteaux de Saint-Rambert, Lyon 9e.",
  description:
    "Club de tennis à Saint-Rambert (Lyon 9e) : quatre courts éclairés, école de tennis, tournois et vie de club. Rejoignez-nous.",

  // TODO(real-data): real postal address (open question 2).
  address: {
    lines: ["Chemin des Courts", "69009 Lyon — Saint-Rambert"],
    // Opens the location in the user's default map app; never an embedded iframe (no cookies).
    mapUrl: "https://www.openstreetmap.org/search?query=Saint-Rambert%20Lyon%209",
  },

  // TODO(real-data): real club mailbox and phone (open questions 2, 7).
  email: "contact@saint-rambert-tc.fr",
  phone: "+33 4 00 00 00 00",
  phoneDisplay: "04 00 00 00 00",

  // TODO(real-data): confirm FFT affiliation (open question 5).
  fftAffiliated: true,

  // TODO(real-data): real social links (or remove entries that don't exist).
  socials: [
    { label: "Facebook", url: "https://www.facebook.com/" },
    { label: "Instagram", url: "https://www.instagram.com/" },
  ] satisfies SiteSocial[],

  // Free-text French lines, so summer/winter schedules are just different rows.
  hours: [
    { label: "Lundi – Vendredi", value: "8h – 22h" },
    { label: "Samedi", value: "8h – 20h" },
    { label: "Dimanche", value: "8h – 18h" },
  ] satisfies SiteHours[],

  courts: {
    count: 4,
    lit: true,
  },
} as const;

export type Site = typeof site;
