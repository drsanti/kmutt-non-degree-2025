#!/usr/bin/env node
/**
 * Export ND01/ND02/ND03 presentations + results to A4 landscape PDFs.
 *
 * Usage:
 *   node export-pdf.mjs
 *   node export-pdf.mjs --only ND01,results
 *   node export-pdf.mjs --out ../exports --wait 900
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { PDFDocument } from "pdf-lib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const A4_LANDSCAPE = { width: 841.89, height: 595.28 }; // points
const VIEWPORT = { width: 1920, height: 1080 };
const MARGIN = 18; // points

const TARGETS = {
  ND01: {
    kind: "deck",
    urlPath: "/ND01-68/presentation/",
    outName: "ND01-68.pdf",
  },
  ND02: {
    kind: "deck",
    urlPath: "/ND02-68/presentation/",
    outName: "ND02-68.pdf",
  },
  ND03: {
    kind: "deck",
    urlPath: "/ND03-68/presentation/",
    outName: "ND03-68.pdf",
  },
  results: {
    kind: "page",
    urlPath: "/results/",
    outName: "results.pdf",
  },
};

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".ico": "image/x-icon",
};

function parseArgs(argv) {
  const opts = {
    only: Object.keys(TARGETS),
    out: path.join(ROOT, "exports"),
    wait: 900,
    port: 0,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--only" && argv[i + 1]) {
      opts.only = argv[++i].split(",").map((s) => s.trim()).filter(Boolean);
    } else if (a === "--out" && argv[i + 1]) {
      opts.out = path.resolve(argv[++i]);
    } else if (a === "--wait" && argv[i + 1]) {
      opts.wait = Number(argv[++i]);
    } else if (a === "--port" && argv[i + 1]) {
      opts.port = Number(argv[++i]);
    } else if (a === "--help" || a === "-h") {
      opts.help = true;
    }
  }
  return opts;
}

function startStaticServer(rootDir, port) {
  const server = http.createServer((req, res) => {
    try {
      const url = new URL(req.url || "/", "http://127.0.0.1");
      let rel = decodeURIComponent(url.pathname);
      if (rel.endsWith("/")) rel += "index.html";
      const filePath = path.normalize(path.join(rootDir, rel));
      if (!filePath.startsWith(rootDir)) {
        res.writeHead(403).end("Forbidden");
        return;
      }
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404).end("Not found");
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
      fs.createReadStream(filePath).pipe(res);
    } catch (err) {
      res.writeHead(500).end(String(err));
    }
  });

  return new Promise((resolve) => {
    server.listen(port, "127.0.0.1", () => {
      const addr = server.address();
      resolve({ server, port: addr.port });
    });
  });
}

async function waitReady(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  // Give CDN fonts/icons a moment if network is slow
  await page.waitForTimeout(300);
}

async function exportDeck(page, baseUrl, target, waitMs, outPath) {
  await page.setViewportSize(VIEWPORT);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${baseUrl}${target.urlPath}`, { waitUntil: "networkidle" });
  await waitReady(page);

  await page.addStyleTag({
    content: `
      .controls, #prev, #next, #fs, #counter, .progress, .progress-bar { display: none !important; }
      body {
        margin: 0 !important;
        background: #0b1220 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        min-height: 100vh !important;
        overflow: hidden !important;
      }
      .deck {
        width: 100vw !important;
        height: 100vh !important;
        max-width: none !important;
        max-height: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
      }
    `,
  });

  const count = await page.evaluate(() => {
    if (!window.__deck) throw new Error("window.__deck is missing — update presentation app.js");
    return window.__deck.getCount();
  });

  const pdf = await PDFDocument.create();
  const usableW = A4_LANDSCAPE.width - MARGIN * 2;
  const usableH = A4_LANDSCAPE.height - MARGIN * 2;

  for (let i = 0; i < count; i++) {
    await page.evaluate((idx) => {
      window.__deck.goTo(idx);
      window.__deck.settle();
    }, i);
    await page.waitForTimeout(waitMs);

    const deck = page.locator("#deck");
    const png = await deck.screenshot({ type: "png" });
    const image = await pdf.embedPng(png);
    const pageDoc = pdf.addPage([A4_LANDSCAPE.width, A4_LANDSCAPE.height]);

    const scale = Math.min(usableW / image.width, usableH / image.height);
    const drawW = image.width * scale;
    const drawH = image.height * scale;
    const x = (A4_LANDSCAPE.width - drawW) / 2;
    const y = (A4_LANDSCAPE.height - drawH) / 2;
    pageDoc.drawImage(image, { x, y, width: drawW, height: drawH });
    process.stdout.write(`  slide ${i + 1}/${count}\r`);
  }
  process.stdout.write("\n");

  const bytes = await pdf.save();
  fs.writeFileSync(outPath, bytes);
  return { pages: count, bytes: bytes.length };
}

async function exportResults(page, baseUrl, target, outPath) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${baseUrl}${target.urlPath}`, { waitUntil: "networkidle" });
  await waitReady(page);

  // Hide sticky chrome that is noisy in print; keep content.
  await page.addStyleTag({
    content: `
      @media print {
        .site-header { position: static !important; box-shadow: none !important; }
      }
    `,
  });

  const bytes = await page.pdf({
    path: outPath,
    format: "A4",
    landscape: true,
    printBackground: true,
    margin: { top: "12mm", right: "12mm", bottom: "12mm", left: "12mm" },
    preferCSSPageSize: false,
  });
  return { pages: null, bytes: bytes.length };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    console.log(`Export Non-Degree HTML decks/pages to A4 landscape PDF

Usage:
  node export-pdf.mjs [--only ND01,ND02,ND03,results] [--out DIR] [--wait MS]

Defaults:
  --only  all targets
  --out   ../exports
  --wait  900
`);
    return;
  }

  const unknown = opts.only.filter((k) => !TARGETS[k]);
  if (unknown.length) {
    console.error(`Unknown target(s): ${unknown.join(", ")}`);
    console.error(`Valid: ${Object.keys(TARGETS).join(", ")}`);
    process.exit(1);
  }

  fs.mkdirSync(opts.out, { recursive: true });

  const { server, port } = await startStaticServer(ROOT, opts.port);
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Serving ${ROOT} at ${baseUrl}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    for (const key of opts.only) {
      const target = TARGETS[key];
      const outPath = path.join(opts.out, target.outName);
      console.log(`\n→ ${key} (${target.kind}) → ${outPath}`);
      const started = Date.now();
      const result =
        target.kind === "deck"
          ? await exportDeck(page, baseUrl, target, opts.wait, outPath)
          : await exportResults(page, baseUrl, target, outPath);
      const kb = (result.bytes / 1024).toFixed(1);
      const pages = result.pages != null ? `, ${result.pages} pages` : "";
      console.log(`  done ${kb} KB${pages} in ${((Date.now() - started) / 1000).toFixed(1)}s`);
    }
    console.log("\nAll exports finished.");
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
