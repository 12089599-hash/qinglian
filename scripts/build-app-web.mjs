import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "www");

const files = ["index.html", "styles.css", "cloudClient.js", "browserGame.js"];
const folders = ["assets"];

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

for (const file of files) {
  await cp(path.join(root, file), path.join(outDir, file));
}

for (const folder of folders) {
  await cp(path.join(root, folder), path.join(outDir, folder), { recursive: true });
}

console.log(`Built app web assets in ${outDir}`);
