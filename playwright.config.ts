import { defineConfig, devices } from "@playwright/test";

/**
 * Testes de navegador:
 *  • "dev"  → servidor de desenvolvimento (fluxos de checkout com aviso de integração pendente)
 *  • "prod" → dist/ servido estaticamente na raiz (4173) e em subpasta (4174/promo/)
 * Rode `npm run build` antes de `npm run test:e2e`.
 */
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  reporter: "list",
  use: { trace: "retain-on-failure" },
  projects: [
    { name: "dev", testMatch: /dev\.spec\.ts/, use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:5173" } },
    { name: "prod", testMatch: /prod\.spec\.ts/, use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:4173" } },
  ],
  webServer: [
    { command: "npx vite --port 5173 --strictPort", url: "http://localhost:5173", reuseExistingServer: true },
    { command: "node scripts/static-server.mjs 4173", url: "http://localhost:4173", reuseExistingServer: true },
    { command: "node scripts/static-server.mjs 4174 /promo/", url: "http://localhost:4174/promo/", reuseExistingServer: true },
  ],
});
