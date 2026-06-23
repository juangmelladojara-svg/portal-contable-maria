// Captura pantallazos reales del portal para el carrusel del landing.
// Crea datos DEMO aislados (cliente ficticio) + usuarios temporales, navega con Chrome
// headless y limpia TODO al final. No expone datos de clientes reales.
import { createClient } from "@supabase/supabase-js";
import puppeteer from "puppeteer-core";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const env = {};
for (const line of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}

const BASE = "http://localhost:3000";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PASSWORD = "Shots-Temp-2026!";
const CLIENTE_EMAIL = `demo-cli-${Date.now()}@contabilidadconmaria.cl`;
const ADMIN_EMAIL = `demo-adm-${Date.now()}@contabilidadconmaria.cl`;
const OUT = join(root, "public", "portal");

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let clienteId = null, clienteUserId = null, adminUserId = null;

async function main() {
  // 1) Cliente demo aislado + datos ficticios
  const { data: cli } = await admin
    .from("clientes")
    .insert({ razon_social: "Demo Visual SpA", rut: "77.000.000-0" })
    .select("id").single();
  clienteId = cli.id;

  await admin.from("metricas_mensuales").insert({
    cliente_id: clienteId, periodo: "2026-05",
    ingresos: 18500000, gastos: 7200000, iva: 1387000, remuneraciones: 4500000,
  });
  await admin.from("documentos").insert([
    { cliente_id: clienteId, nombre: "Balance General 2026.pdf", categoria: "Balances", anio: "2026", mes: "Mayo", storage_path: "demo/a.pdf", size_bytes: 1250000 },
    { cliente_id: clienteId, nombre: "F29 Mayo 2026.pdf", categoria: "Impuestos", anio: "2026", mes: "Mayo", storage_path: "demo/b.pdf", size_bytes: 840000 },
    { cliente_id: clienteId, nombre: "Liquidaciones Mayo 2026.zip", categoria: "Remuneraciones", anio: "2026", mes: "Mayo", storage_path: "demo/c.zip", size_bytes: 3500000 },
  ]);

  // 2) Usuarios temporales
  const { data: cu } = await admin.auth.admin.createUser({
    email: CLIENTE_EMAIL, password: PASSWORD, email_confirm: true,
    user_metadata: { rol: "cliente", nombre: "Demo Visual SpA", cliente_id: clienteId },
  });
  clienteUserId = cu.user.id;
  const { data: au } = await admin.auth.admin.createUser({
    email: ADMIN_EMAIL, password: PASSWORD, email_confirm: true,
    user_metadata: { rol: "admin", nombre: "Equipo Contable" },
  });
  adminUserId = au.user.id;
  console.log("Datos demo + usuarios temporales creados");
  await sleep(900);

  // 3) Navegador
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
  });

  const prep = (page) => page.addStyleTag({
    content: `nextjs-portal,[data-nextjs-toast]{display:none!important} ::-webkit-scrollbar{display:none}`,
  }).catch(() => {});
  const shot = async (page, name) => { await prep(page); await sleep(1100); await page.screenshot({ path: join(OUT, `${name}.png`) }); console.log("📸", name); };
  const clickFirstFolder = async (page) => { await page.evaluate(() => { const b = document.querySelector("main button.card-lift"); if (b) b.click(); }); await sleep(700); };
  const login = async (page, email) => {
    await page.goto(`${BASE}/portal`, { waitUntil: "networkidle2" });
    await page.type("#email", email);
    await page.type("#password", PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForFunction(() => /\/portal\/(dashboard|admin)/.test(location.pathname), { timeout: 15000 });
  };
  const newPage = async () => (await browser.createBrowserContext()).newPage();

  // 4) Login (sin sesión)
  const p0 = await newPage();
  await p0.goto(`${BASE}/portal`, { waitUntil: "networkidle2" });
  await shot(p0, "01-login");

  // 5) Vista CLIENTE (solo ve su data demo)
  const pc = await newPage();
  await login(pc, CLIENTE_EMAIL);
  await pc.goto(`${BASE}/portal/dashboard`, { waitUntil: "networkidle2" });
  await sleep(900);
  await clickFirstFolder(pc); // 2026
  await clickFirstFolder(pc); // Mayo → archivos
  await shot(pc, "02-dashboard");
  await pc.goto(`${BASE}/portal/dashboard/metricas`, { waitUntil: "networkidle2" });
  await shot(pc, "03-metricas");

  // 6) Vista ADMIN
  const pa = await newPage();
  await login(pa, ADMIN_EMAIL);
  for (const [path, name] of [
    ["/portal/admin", "04-admin-subir"],
    ["/portal/admin/clientes", "05-admin-clientes"],
    ["/portal/admin/metricas", "06-admin-metricas"],
  ]) {
    await pa.goto(`${BASE}${path}`, { waitUntil: "networkidle2" });
    await shot(pa, name);
  }

  await browser.close();
}

main()
  .catch((e) => { console.error("ERROR:", e.message); process.exitCode = 1; })
  .finally(async () => {
    if (clienteUserId) await admin.auth.admin.deleteUser(clienteUserId).catch(() => {});
    if (adminUserId) await admin.auth.admin.deleteUser(adminUserId).catch(() => {});
    if (clienteId) await admin.from("clientes").delete().eq("id", clienteId).catch(() => {});
    console.log("🧹 Datos y usuarios temporales eliminados");
  });
