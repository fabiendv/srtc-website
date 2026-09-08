/**
 * Single, page-scoped mount point for third-party scripts (phase 2: Metadot
 * ticket widget on /contact, KB on /aide). Rendered ONLY on the pages that need
 * it — never in the root layout — so nothing third-party loads site-wide, and the
 * home page stays cookie-free and fast. Adding the Metadot snippet is a one-file
 * change here (uncomment and set the script src via next/script).
 *
 * No Metadot code in v0. A Content Security Policy is deferred to phase 2 once the
 * widget's origins are known (see TODOS.md — TODO-3).
 */
export function ThirdPartyWidgets() {
  // Phase 2 example:
  // return (
  //   <Script src="https://widgets.metadot.example/embed.js" strategy="lazyOnload" />
  // );
  return null;
}
