import { z } from "zod";

/**
 * Shared contact-form contract, used by both the client form and the Route Handler.
 * Kept free of server-only imports so it is safe in the client bundle.
 */

// Hidden field a human never fills. Bots that fill every input get silently dropped.
export const HONEYPOT_FIELD = "site_web";

// Reject oversized bodies before parsing. The zod limits below imply a small
// payload; anything much larger is abuse or a malformed body.
export const MAX_BODY_BYTES = 12 * 1024;

export const ContactSchema = z.object({
  nom: z.string().trim().min(1, "Indiquez votre nom.").max(100, "Nom trop long (100 caracteres max)."),
  email: z.string().trim().email("Adresse e-mail invalide.").max(254, "Adresse e-mail trop longue."),
  message: z
    .string()
    .trim()
    .min(10, "Votre message est trop court (10 caracteres min).")
    .max(5000, "Votre message est trop long (5000 caracteres max)."),
});

export type ContactInput = z.infer<typeof ContactSchema>;

/** Strip newlines and control characters: header-injection and inbox-filter safety. */
export function sanitizeSubjectPart(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\x00-\x1F\x7F]+/g, " ").replace(/\s+/g, " ").trim();
}
