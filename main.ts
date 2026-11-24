// Entri bounty "Promote make.fun's post on X" (Node 22, pustaka standar saja).
//
// Tugas program ini cuma satu: menyalin POST.json dari akar repo ke
// /output/POST.json, tempat gate membacanya. Entrinya sendiri adalah
// postingan X-nya: POST.json cuma menunjuk alamat postingan itu.
// Gate membaca postingan langsung dari X — tidak ada yang dihitung
// dari apa pun yang ditulis program ini.
//
// Di luar wadah grader, MAKEFUN_BOT_DIR dan MAKEFUN_OUTPUT_DIR menggantikan
// /bot dan /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(botDir, 'POST.json');
const target = join(outputDir, 'POST.json');

const raw = readFileSync(source, 'utf8');
const parsed: unknown = JSON.parse(raw);
if (typeof parsed !== 'object' || parsed === null || typeof (parsed as { url?: unknown }).url !== 'string') {
  console.error('POST.json tidak membawa url string.');
  process.exit(1);
}
const url = (parsed as { url: string }).url;
if (!/^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/[^/]+\/status\/\d+/.test(url)) {
  console.error(`url di POST.json bukan alamat postingan X: ${url}`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(target, raw);
console.log(`POST.json disalin ke ${target}`);
