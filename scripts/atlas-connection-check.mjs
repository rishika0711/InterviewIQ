/**
 * Validates MongoDB Atlas connectivity from THIS machine without printing secrets.
 * Run: npm run atlas:check
 *
 * Helps debug Prisma errors like:
 * Server selection timeout ... received fatal alert: InternalError
 */
import dns from "node:dns/promises";
import tls from "node:tls";
import { config } from "dotenv";

config({ path: ".env.local" });

const DATABASE_URL = process.env.DATABASE_URL?.trim();

function fail(message) {
  console.error("\n❌", message);
  process.exitCode = 1;
}

function ok(message) {
  console.log("✓", message);
}

function handshake(host, port) {
  return new Promise((resolve, reject) => {
    const sock = tls.connect(
      port,
      host,
      {
        servername: host,
        rejectUnauthorized: true,
      },
      () => {
        sock.destroy();
        resolve();
      },
    );
    sock.setTimeout(15_000, () => {
      sock.destroy(new Error("TLS handshake timed out after 15s"));
    });
    sock.on("error", reject);
  });
}

async function fetchPublicIp() {
  try {
    const res = await fetch("https://api.ipify.org?format=text", {
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) return (await res.text()).trim();
  } catch {
    /* ignore */
  }
  return null;
}

async function main() {
  if (!DATABASE_URL) {
    fail("DATABASE_URL is missing — set it in .env.local.");
    process.exit(1);
  }

  const publicIp = await fetchPublicIp();
  if (publicIp) {
    console.log(
      `\n📍 Your public IP (add in Atlas → Security → Network Access): ${publicIp}\n` +
        `   Or temporarily use "Allow access from anywhere" (0.0.0.0/0) for local dev.\n`,
    );
  }

  if (!DATABASE_URL.startsWith("mongodb+srv://")) {
    ok("DATABASE_URL is not mongodb+srv (skipping SRV heuristic checks).");
    console.log("\nTrying generic TLS probe is not wired for mongodb:// multi-host URIs.");
    process.exitCode = 0;
    return;
  }

  // After mongodb+srv://, credentials must contain at most one unescaped `@`
  // (separator between userinfo and host). Literal `@` inside the password MUST be %40.
  const withoutScheme = DATABASE_URL.slice("mongodb+srv://".length);
  const atSegments = withoutScheme.split("@");

  if (atSegments.length > 2) {
    fail(
      `DATABASE_URL has more than one "@" between the scheme and MongoDB hostname.\n\n` +
        `That usually means your database password contains "@" but is not URL-encoded.\n\n` +
        `Fix:\n  • Paste the URI from Atlas (Database → Connect → Drivers); or\n  ` +
        `• Encode special characters — "@" becomes %40, ":" becomes %3A in the PASSWORD slice only.`,
    );
    process.exit(1);
  }

  ok('Only one "@" delimiter before host (good for typical USER:PASSWORD@HOST format).');

  const [userinfoRest, hostPart] = atSegments;
  if (!userinfoRest?.includes(":")) {
    fail(
      "DATABASE_URI userinfo looks wrong (expected mongodb+srv://USER:PASSWORD@HOST).",
    );
    process.exit(1);
  }

  const host = hostPart?.split("/")[0]?.trim();
  if (!host?.endsWith(".mongodb.net")) {
    ok(`Host "${host ?? ""}" doesn't look like Atlas SRV hostname — sanity checks skipped.`);
  } else {
    ok(`Hostname looks OK: …@${host}`);
  }

  console.log("\n🔍 Resolving SRV _mongodb._tcp." + host + " …");

  let records;
  try {
    records = await dns.resolveSrv("_mongodb._tcp." + host);
  } catch (e) {
    fail(`SRV DNS lookup failed: ${e.message}\n(check network / DNS resolver / VPN)`);
    process.exit(1);
  }

  if (!records?.length) {
    fail("SRV lookup returned no records.");
    process.exit(1);
  }

  records.sort((a, b) => (a.priority !== b.priority ? a.priority - b.priority : a.name.localeCompare(b.name)));

  const probe = records[0];
  console.log(
    `\n🔐 TLS handshake to ${probe.name}:${probe.port} (same ports Atlas uses — no password sent) …`,
  );

  try {
    await handshake(probe.name, probe.port);
    ok(`TLS completed with verify OK (host ${probe.name}).`);
  } catch (e) {
    const msg =
      e instanceof Error ? e.message : String(e);

    console.error("\n❌ TLS to Atlas failed:", msg);

    if (/internal\s*error|ECONNRESET|certificate/i.test(msg)) {
      console.error(
        `\nThis error usually means Atlas is rejecting your connection BEFORE auth.\n` +
          `Fix (in order):\n` +
          `  1. Atlas → Security → Network Access → Add IP Address` +
          (publicIp ? ` → paste ${publicIp}` : ` → "Add Current IP Address"`) +
          `\n     (or "Allow access from anywhere" 0.0.0.0/0 for local dev only)\n` +
          `  2. Atlas → Database → Deployments → Resume cluster if Paused\n` +
          `  3. Wait 1–2 minutes, then: npx dotenv -e .env.local -- npx prisma db push --skip-generate\n` +
          `  4. If still failing: disconnect VPN / try phone hotspot\n`,
      );
    }

    process.exit(1);
  }

  console.log(
    "\nIf this passes but Prisma still errors, regenerate the Atlas connection string,\nrestart the dev server, and run:\n  npx dotenv -e .env.local -- npx prisma db push --skip-generate\n",
  );
}

await main();
