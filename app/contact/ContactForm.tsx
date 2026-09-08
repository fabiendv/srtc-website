"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertTriangle } from "lucide-react";
import { HONEYPOT_FIELD } from "@/lib/contact";
import { site } from "@/content/site";

type FieldErrors = Partial<Record<"nom" | "email" | "message", string>>;
type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return; // guard against double-submit
    setStatus("submitting");
    setErrors({});

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      nom: String(fd.get("nom") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
      [HONEYPOT_FIELD]: String(fd.get(HONEYPOT_FIELD) ?? ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
        return;
      }

      if (res.status === 400) {
        const data = await res.json().catch(() => ({}));
        if (data?.errors) {
          setErrors(data.errors as FieldErrors);
          setStatus("idle");
          return;
        }
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-forest/30 bg-forest/5 p-6" role="status">
        <CheckCircle2 className="text-forest" size={28} />
        <h2 className="mt-3 font-serif text-2xl text-forest">Message envoyé, merci !</h2>
        <p className="mt-2 text-muted">
          On vous répond au plus vite. À bientôt sur les courts.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-clay underline"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {status === "error" && (
        <div className="flex gap-3 rounded-xl border border-clay/40 bg-clay/5 p-4 text-sm" role="alert">
          <AlertTriangle className="mt-0.5 shrink-0 text-clay" size={18} />
          <p>
            Le formulaire n&apos;a pas fonctionné. Écrivez-nous directement à{" "}
            <a href={`mailto:${site.email}`} className="font-medium text-clay underline">
              {site.email}
            </a>
            .
          </p>
        </div>
      )}

      <div>
        <label htmlFor="nom" className="block text-sm font-medium">
          Nom
        </label>
        <input
          id="nom"
          name="nom"
          type="text"
          required
          maxLength={100}
          autoComplete="name"
          aria-invalid={errors.nom ? true : undefined}
          className="mt-1 w-full rounded-lg border border-line bg-white/60 px-4 py-2.5 focus:border-clay focus:outline-none"
        />
        {errors.nom && <p className="mt-1 text-sm text-clay">{errors.nom}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          className="mt-1 w-full rounded-lg border border-line bg-white/60 px-4 py-2.5 focus:border-clay focus:outline-none"
        />
        {errors.email && <p className="mt-1 text-sm text-clay">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          aria-invalid={errors.message ? true : undefined}
          className="mt-1 w-full rounded-lg border border-line bg-white/60 px-4 py-2.5 focus:border-clay focus:outline-none"
        />
        {errors.message && <p className="mt-1 text-sm text-clay">{errors.message}</p>}
      </div>

      {/* Honeypot: hidden from humans and assistive tech; bots that fill it are dropped. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={HONEYPOT_FIELD}>Ne pas remplir</label>
        <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center gap-2 rounded-full bg-clay px-7 py-3 text-sm font-medium text-cream transition-colors hover:bg-clay-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send size={16} />
        {status === "submitting" ? "Envoi…" : "Envoyer"}
      </button>

      <p className="text-xs leading-relaxed text-muted">
        Vos données (nom, e-mail, message) servent uniquement à traiter votre demande. Elles transitent
        par notre prestataire d&apos;envoi Resend (conservation ~30 jours, données hébergées hors UE) puis
        restent dans la boîte mail du club.{" "}
        <a href="/mentions-legales" className="underline">
          Détails et vos droits
        </a>
        .
      </p>
    </form>
  );
}
