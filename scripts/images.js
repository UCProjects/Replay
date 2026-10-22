import fs from 'node:fs/promises';
import https from 'node:https';
import { SocksProxyAgent } from 'socks-proxy-agent';

const ACRONYMS = new Set(['kr']);
const POWERS = [
  'Armor',
  'BaseStatChange',
  'BonusAtk',
  'BonusCost',
  'BonusHp',
  'Box',
  'Bullseye',
  'Burn',
  'Candy',
  'Charge',
  'Created',
  'Darkspawn',
  'Determination',
  'Disarmed',
  'Dodge',
  'FloweryPower',
  'Haste',
  'Invulnerable',
  'KR',
  'Loop',
  'MalusAtk',
  'MalusCost',
  'MalusHp',
  'MoldSpore',
  'Paralyzed',
  'Program',
  'Shock',
  'Silenced',
  'Support',
  'Taunt',
  'Transparency',
  'Underevent2024',
  'Wanted',
];

const ORIGIN = process.env.UC_ORIGIN || 'https://undercards.net';
const USER = process.env.UC_USER;
const PASSWORD = process.env.UC_PASSWORD;
const PROXY = process.env.ALL_PROXY;
const OUT = new URL('../public/', import.meta.url);
const MANIFEST = new URL('./images.etags.json', import.meta.url);
const CONCURRENCY = 8;
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

const force = process.argv.includes('--force');
const agent = PROXY ? new SocksProxyAgent(PROXY) : undefined;

function request(path, {
  method = 'GET',
  cookie,
  body,
  headers = {},
} = {}) {
  const { hostname } = new URL(ORIGIN);
  const options = {
    hostname,
    port: 443,
    path,
    method,
    agent,
    headers: {
      Accept: '*/*',
      Host: hostname,
      Referer: `${ORIGIN}/`,
      'User-Agent': USER_AGENT,
      ...(cookie ? { Cookie: cookie } : {}),
      ...(body ? { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Content-Length': Buffer.byteLength(body) } : {}),
      ...headers,
    },
  };
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
    });
    req.on('error', reject);
    req.setTimeout(30000, () => req.destroy(new Error(`Timed out: ${path}`)));
    if (body) req.write(body);
    req.end();
  });
}

async function signIn() {
  if (!USER || !PASSWORD) throw new Error('Missing UC_USER and UC_PASSWORD in web/.env');
  const body = new URLSearchParams({ login: USER, password: PASSWORD, stayConnected: 'false' }).toString();
  const res = await request('/SignIn', { method: 'POST', body });
  if (res.status !== 302 && res.status !== 200) {
    throw new Error(`Login failed: ${res.status}${PROXY ? '' : ' (no ALL_PROXY set, the site may be blocking this address)'}`);
  }
  const cookies = res.headers['set-cookie'];
  if (!cookies?.length) throw new Error(`Login failed: no session cookie (${res.status})`);
  return cookies.map((cookie) => cookie.split(';')[0]).join('; ');
}

async function getJson(path, cookie) {
  const res = await request(path, { cookie });
  if (res.status !== 200) throw new Error(`${path} ${res.status}`);
  return JSON.parse(res.body.toString());
}

function deepParse(value) {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' ? deepParse(parsed) : value;
    } catch {
      return value;
    }
  }
  if (Array.isArray(value)) return value.map(deepParse);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, deepParse(entry)]));
  }
  return value;
}

function familySuffix(extension) {
  if (extension === 'BASE') return '';
  if (extension === 'DELTARUNE') return '_DR';
  return `_${extension}`;
}

function pascal(key, prefix) {
  return key
    .slice(prefix.length)
    .split('-')
    .map((part) => (ACRONYMS.has(part)
      ? part.toUpperCase()
      : `${part.charAt(0).toUpperCase()}${part.slice(1)}`))
    .join('');
}

function cardImages(cards) {
  const found = new Set();
  cards.forEach((card) => {
    if (card.image) found.add(`images/cards/${card.image}.${card.imageExtension || 'png'}`);
    (card.tribes || []).forEach((tribe) => found.add(`images/tribes/${tribe}.png`));
  });
  return [...found];
}

function rarityImages(cards) {
  const found = new Map();
  cards.forEach((card) => {
    if (card.extension && card.rarity) {
      found.set(
        `images/rarity/${card.rarity}${familySuffix(card.extension)}.png`,
        `images/rarity/${card.extension}_${card.rarity}.png`,
      );
    }
  });
  return [...found].map(([path, source]) => ({ path, source }));
}

function insertedImages(lang) {
  return Object.values(lang)
    .filter((text) => typeof text === 'string')
    .flatMap((text) => [...text.matchAll(/{{image:([^|}]+)/gi)])
    .map(([, name]) => `images/inserted/${name.trim()}.png`);
}

function enchantImages(lang) {
  return Object.keys(lang)
    .filter((key) => key.startsWith('enchant-') && !key.endsWith('-desc'))
    .flatMap((key) => {
      const name = pascal(key, 'enchant-');
      return [`images/enchants/backgrounds/${name}.png`, `images/enchants/overlays/${name}.png`];
    });
}

function statusImages(lang) {
  const named = Object.keys(lang)
    .filter((key) => key.startsWith('status-') && !key.endsWith('-desc'))
    .map((key) => pascal(key, 'status-'));
  return [...new Set([...named, ...POWERS])].map((name) => `images/powers/${name}.png`);
}

function artifactImages(artifacts) {
  return artifacts
    .filter((artifact) => artifact.image)
    .map((artifact) => `images/artifacts/${artifact.image}.png`);
}

async function exists(path) {
  try {
    await fs.access(new URL(path, OUT));
    return true;
  } catch {
    return false;
  }
}

async function readManifest() {
  try {
    return JSON.parse(await fs.readFile(MANIFEST, 'utf8'));
  } catch {
    return {};
  }
}

async function main() {
  const etags = await readManifest();
  const before = JSON.stringify(etags);
  const cookie = await signIn();
  const latest = await getJson('/card-data/latest.json');
  const [data, lang, decks] = await Promise.all([
    getJson(latest.url),
    getJson('/translation/en.json'),
    getJson('/DecksConfig', cookie),
  ]);
  const cards = deepParse(data).cards || [];
  const artifacts = deepParse(decks.allArtifacts) || [];

  const required = [
    ...cardImages(cards),
    ...artifactImages(artifacts),
    ...insertedImages(lang),
    'images/powers/Enchant.png',
    'images/vfx/AttackBuff.png',
    'images/vfx/AttackDebuff.png',
    'images/vfx/Heal.png',
    'images/vfx/Heal_Player.png',
    'images/vfx/HpBuff.png',
    'images/vfx/HpDebuff.png',
  ];
  const queue = [
    ...new Set(required).values().map((path) => ({ path, optional: false })),
    ...rarityImages(cards).map((image) => ({ ...image, optional: true })),
    ...new Set([...enchantImages(lang), ...statusImages(lang)]).values()
      .map((path) => ({ path, optional: true })),
  ];

  const failures = [];
  let downloaded = 0;
  let current = 0;

  async function worker() {
    for (let item = queue.shift(); item; item = queue.shift()) {
      try {
        const known = !force && etags[item.path] && await exists(item.path);
        const res = await request(`/${item.source ?? item.path}`, {
          cookie,
          headers: known ? { 'If-None-Match': etags[item.path] } : {},
        });
        if (res.status === 304) {
          current += 1;
        } else if (res.status === 200) {
          const file = new URL(item.path, OUT);
          await fs.mkdir(new URL('.', file), { recursive: true });
          await fs.writeFile(file, res.body);
          if (res.headers.etag) etags[item.path] = res.headers.etag;
          else delete etags[item.path];
          downloaded += 1;
        } else if (!item.optional) {
          failures.push(`${item.path} ${res.status}`);
        }
      } catch (error) {
        failures.push(`${item.path} ${error.message}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  const sorted = Object.fromEntries(Object.entries(etags).sort(([x], [y]) => x.localeCompare(y)));
  if (JSON.stringify(sorted) !== before) {
    await fs.writeFile(MANIFEST, `${JSON.stringify(sorted, null, 2)}\n`);
  }
  console.log(`Downloaded ${downloaded}, unchanged ${current}`);
  if (failures.length) {
    console.error(`${failures.length} failed:\n${failures.join('\n')}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
