import * as Sentry from "@sentry/react";

const FALLBACK_DSN =
  "https://cae0412ab631c99c3e289a620ca777aa@o4512080357556224.ingest.us.sentry.io/4512080384491520";

const dsn = import.meta.env.VITE_SENTRY_DSN || FALLBACK_DSN;

Sentry.init({
  dsn,
  tracesSampleRate: 1.0,
  sendDefaultPii: false,
});
