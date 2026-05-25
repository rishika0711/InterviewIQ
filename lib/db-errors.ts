/** Heuristic for Mongo/Atlas TCP–TLS routing failures surfaced by Prisma. */
export function isMongoConnectivityFailure(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message;
  return (
    msg.includes("Server selection timeout") ||
    msg.includes("received fatal alert: InternalError") ||
    msg.includes("Can't reach database server") ||
    msg.includes("Error in connector") ||
    msg.includes("P1017") ||
    msg.includes("P2034")
  );
}

export const DATABASE_UNAVAILABLE_MESSAGE =
  "Could not reach MongoDB Atlas. Resume the cluster, add your IP under Atlas → Network Access, use the Drivers URI verbatim in DATABASE_URL (URL-encode any special characters in the password), and try without VPN/proxy blocking *.mongodb.net. Run `npm run atlas:check` on your machine, then restart the dev server.";
