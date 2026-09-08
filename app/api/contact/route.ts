import { Resend } from "resend";
import {
  ContactSchema,
  HONEYPOT_FIELD,
  MAX_BODY_BYTES,
  sanitizeSubjectPart,
} from "@/lib/contact";

export const runtime = "nodejs";

/**
 * Contact form endpoint. The only server code in v0; deleted in phase 2 when the
 * Metadot ticket widget takes its place.
 *
 *   POST /api/contact
 *        │ body-size cap ──────────────► 400 (abuse / malformed)
 *        │ JSON parse ─────────────────► 400 (malformed body)
 *        │ honeypot filled ────────────► 200, send nothing (bot learns nothing)
 *        │ zod validate ───────────────► 400 { errors: {field: message} }
 *        │ send via Resend (plain text) ► 500 on failure
 *        ▼
 *      200 { ok: true }
 */
export async function POST(req: Request): Promise<Response> {
  // 1. Reject oversized bodies before reading/parsing.
  const declared = Number(req.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) {
    return Response.json({ ok: false, error: "Requête trop volumineuse." }, { status: 400 });
  }

  const raw = await req.text();
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
    return Response.json({ ok: false, error: "Requête trop volumineuse." }, { status: 400 });
  }

  // 2. Parse JSON.
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }
  const payload = (data ?? {}) as Record<string, unknown>;

  // 3. Honeypot first. If filled, pretend success and send nothing.
  if (typeof payload[HONEYPOT_FIELD] === "string" && payload[HONEYPOT_FIELD].trim() !== "") {
    return Response.json({ ok: true }, { status: 200 });
  }

  // 4. Validate the real fields.
  const parsed = ContactSchema.safeParse(payload);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (key && !errors[key]) errors[key] = issue.message;
    }
    return Response.json({ ok: false, errors }, { status: 400 });
  }
  const { nom, email, message } = parsed.data;

  // 5. Config check.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;
  if (!apiKey || !to || !from) {
    console.error("Contact endpoint misconfigured: missing RESEND_API_KEY / CONTACT_TO / CONTACT_FROM");
    return Response.json({ ok: false, error: "Service indisponible." }, { status: 500 });
  }

  // 6. Send plain text only. Member input cannot render markup in the club inbox.
  const subject = `[SRTC contact] ${sanitizeSubjectPart(nom)}`;
  const text = [
    `Nom : ${nom}`,
    `E-mail : ${email}`,
    "",
    "Message :",
    message,
  ].join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject,
      text,
    });
    if (error) {
      console.error("Resend send error:", error);
      return Response.json({ ok: false, error: "Envoi impossible." }, { status: 500 });
    }
  } catch (err) {
    console.error("Resend threw:", err);
    return Response.json({ ok: false, error: "Envoi impossible." }, { status: 500 });
  }

  return Response.json({ ok: true }, { status: 200 });
}
