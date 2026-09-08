import type { Metadata } from "next";
import { site } from "@/content/site";
import { PageHero } from "@/components/PageHero";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales et politique de protection des données personnelles du Saint Rambert Tennis Club.",
  alternates: { canonical: "/mentions-legales" },
  robots: { index: true, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <>
      <PageHero eyebrow="Informations" title="Mentions légales" />

      <section className="mx-auto max-w-3xl px-5 py-14">
        <div className="prose-srtc">
          <h2>Éditeur du site</h2>
          <p>
            Ce site est édité par l&apos;association {site.name} (SRTC).
            {" "}
            {/* TODO(real-data): nom légal de l'association, président, adresse déclarée (open question 4). */}
            <em>Nom légal de l&apos;association, nom du président et adresse du siège à compléter.</em>
          </p>
          <p>
            Adresse : {site.address.lines.join(", ")}
            <br />
            E-mail : <a href={`mailto:${site.email}`}>{site.email}</a>
            <br />
            Téléphone : {site.phoneDisplay}
          </p>

          <h2>Hébergement</h2>
          <p>
            Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis
            — <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>.
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            Les textes, images et éléments graphiques de ce site sont la propriété du club, sauf mention
            contraire, et ne peuvent être réutilisés sans autorisation.
          </p>

          <h2>Données personnelles</h2>
          <p>
            <strong>Responsable de traitement :</strong> l&apos;association {site.name}.
            {" "}
            {/* TODO(real-data): personne à contacter pour les demandes RGPD (open question 4). */}
            Pour toute question relative à vos données, écrivez à{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
          <p>
            <strong>Finalité :</strong> les données saisies dans le formulaire de contact servent
            uniquement à traiter et répondre à votre demande.
          </p>
          <p>
            <strong>Base légale :</strong> votre consentement et l&apos;intérêt légitime du club à
            répondre aux sollicitations qui lui sont adressées.
          </p>
          <p>
            <strong>Données collectées :</strong> nom, adresse e-mail et contenu du message. Ces champs
            sont obligatoires pour permettre le traitement de la demande.
          </p>
          <p>
            <strong>Destinataires et sous-traitant :</strong> les membres du bureau du club, et notre
            prestataire d&apos;envoi d&apos;e-mails Resend (Resend, Inc.), lié au club par un accord de
            sous-traitance (DPA). Resend conserve les données d&apos;e-mail environ 30 jours.
          </p>
          <p>
            <strong>Transfert hors Union européenne :</strong> les messages transitent par Resend, dont
            l&apos;infrastructure et les journaux sont situés aux États-Unis. Ce transfert est encadré par
            les garanties contractuelles prévues par le prestataire (clauses contractuelles types / DPA).
          </p>
          <p>
            <strong>Durée de conservation :</strong> environ 30 jours chez Resend, puis dans la boîte mail
            du club le temps nécessaire au traitement de votre demande.
          </p>
          <p>
            <strong>Vos droits :</strong> vous disposez d&apos;un droit d&apos;accès, de rectification,
            d&apos;effacement et d&apos;opposition sur vos données. Pour les exercer, écrivez à{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
          <p>
            <strong>Réclamation :</strong> vous pouvez introduire une réclamation auprès de la CNIL —{" "}
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>.
          </p>

          <h2>Cookies</h2>
          <p>
            Ce site ne dépose aucun cookie et n&apos;utilise pas d&apos;outil de mesure d&apos;audience en
            version 0.
          </p>
        </div>
      </section>
    </>
  );
}
