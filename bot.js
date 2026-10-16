/* 𝕹𝖊𝖝 𝕿𝖊𝖈𝖍 𝖚𝖘 𝖇𝖆𝖈𝖐 𝖇𝖊𝖙𝖙𝖊𝖗 𝖙𝖍𝖆𝖙 𝖊𝖛𝖊𝖗 𝖙𝖎𝖒𝖊 𝖙𝖔 𝖗𝖔𝖈𝖐 𝖘𝖔𝖒𝖊 𝖙𝖊𝖈𝖍 𝖒𝖔𝖉𝖊 

- 𝖓𝖊𝖝 𝖍𝖔𝖘𝖙𝖎𝖓𝖌 𝖗𝖔𝖇𝖔𝖙 {𝖆𝖈𝖙𝖎𝖛𝖆𝖙𝖊𝖉}

:::::: 𝖍𝖔𝖘𝖙 𝖞𝖔𝖚𝖗 𝖙𝖊𝖑𝖊𝖌𝖗𝖆𝖒 𝖇𝖙𝖘 𝖋𝖔𝖗 𝖋𝖗𝖊𝖊 ::::::
𝖋𝖊𝖆𝖙𝖚𝖗𝖊𝖘 ;
-𝖍𝖔𝖘𝖙𝖎𝖓𝖌 𝖏𝖘 𝖇𝖔𝖙𝖘 
-𝖆𝖑𝖗𝖊𝖆𝖉𝖞 𝖒𝖆𝖉𝖊 𝖙𝖊𝖒𝖕𝖑𝖆𝖙𝖊𝖘 
-𝖘𝖙𝖞𝖑𝖊 𝖜𝖎𝖑𝖑 𝖇𝖊 𝖙𝖔𝖕 𝖓𝖔𝖙𝖈𝖍 
-𝖘𝖚𝖕𝖊𝖗 𝖈𝖚𝖑
-::::::: 𝖆𝖓𝖉 𝖒𝖆𝖓𝖞 𝖒𝖔𝖗𝖊.... 
••••• 𝖑𝖊𝖙𝖘 𝖌𝖊𝖙 𝖌𝖊 𝖕𝖆𝖗𝖙𝖞 𝖘𝖙𝖆𝖗𝖙𝖊𝖉 ••••••
*/
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const os = require('os');
const crypto = require('crypto');
const https = require('https');
const AdmZip = require('adm-zip');
const moment = require('moment');

const TOKEN = process.env.TOKEN || '8478359719:AAFsmpCjMk0oi80nGKhlitYWGrgoarFDuWQ';
const ADMIN_ID = 7158115683;
const CHANNEL_ID = '@NEX_TECH_CHANNEL';
const DATA_DIR = process.env.DATA_DIR || __dirname;

const FORCE_JOIN_CHANNELS = [
    { name: "Nᴇx 𝕿ᴇᴄʜ", link: "https://t.me/NEX_TECH_CHANNEL" },
    { name: "Nᴇx 𝕳ᴏsᴛɪɴɢ 𝖀ᴘᴅᴀᴛᴇs", link: "https://t.me/NEX_TECH_BOT_UPDATES" }, 
    { name: "Nᴇx 𝕺ᴛᴘ 𝕲ʀᴏᴜᴘ", link: "https://t.me/NEX_TECH_OTP" }
    ];

const BASE_DIR = DATA_DIR;
const DEPLOY_DIR = path.join(BASE_DIR, 'deployed_bots');
const LOGS_DIR = path.join(BASE_DIR, 'bot_logs');
const BACKUP_DIR = path.join(BASE_DIR, 'backups');

const DB = {
    users: path.join(BASE_DIR, 'users_data.json'),
    settings: path.join(BASE_DIR, 'bot_settings.json'),
    codes: path.join(BASE_DIR, 'coupons.json'),
    quests: path.join(BASE_DIR, 'quests.json'),
    tags: path.join(BASE_DIR, 'tags.json'),
    auctions: path.join(BASE_DIR, 'auctions.json'),
    health: path.join(BASE_DIR, 'health.json'),
    market: path.join(BASE_DIR, 'marketplace.json'),
    economy: path.join(BASE_DIR, 'economy.json'),
    logs: path.join(BASE_DIR, 'admin_logs.json')
};

[DEPLOY_DIR, LOGS_DIR, BACKUP_DIR].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

const bot = new TelegramBot(TOKEN, { polling: true });

const DEFAULT_SETTINGS = {
    points_per_referral: 2,
    hosting_cost: 4,
    maintenance: false,
    welcome_video: null,
    bot_username: null,
    new_user_notify: true,
    force_join: true,
    force_join_strict: false,
    max_bots_free: 3,
    max_bots_premium: 10,
    max_bots_vip: 100,
    rate_limit_deploys: 3,
    rate_limit_window_min: 10,
    spam_threshold: 5,
    spam_window_min: 10,
    deploy_approval: false,
    auto_restart: true,
    max_restarts: 5,
    restart_window_sec: 60,
    anti_sleep: true,
    crash_alert: true,
    economy: {
        spin_cost: 0,
        spin_cooldown_hours: 24,
        scratch_cost: 5,
        scratch_rewards: [0, 1, 2, 3, 5, 10, 20, 50],
        streak_bonus: [1, 2, 3, 5, 8, 12, 20],
        daily_reward: 5
    },
    tiers: {
        free: { name: 'Free', multiplier: 1, cost: 0 },
        premium: { name: 'Premium', multiplier: 2, cost: 10 },
        vip: { name: 'VIP', multiplier: 5, cost: 30 }
    },
    store_items: {
        extra_slot: { name: 'Extra Bot Slot', cost: 8, desc: '+1 permanent bot slot' },
        priority: { name: 'Priority CPU', cost: 12, desc: 'Higher CPU priority for 7 days' },
        custom_prefix: { name: 'Custom Prefix', cost: 6, desc: 'Custom bot menu prefix' },
        auto_restart_plus: { name: 'Auto-Restart+', cost: 14, desc: 'Unlimited restarts for 30 days' }
    }
};

function loadJSON(f, fb = {}) {
    try { if (fs.existsSync(f)) { const r = fs.readFileSync(f, 'utf8'); if (r.trim()) return JSON.parse(r); } } catch (e) { console.error('loadJSON', f, e.message); }
    return fb;
}
function saveJSON(f, d) { try { fs.writeFileSync(f, JSON.stringify(d, null, 2)); return true; } catch (e) { console.error('saveJSON', f, e.message); return false; } }

let usersDB = loadJSON(DB.users, {});
let settings = { ...DEFAULT_SETTINGS, ...loadJSON(DB.settings, {}) };
let couponsDB = loadJSON(DB.codes, {});
let questsDB = loadJSON(DB.quests, { quests: [
    { id: 'first_deploy', name: 'First Deploy', desc: 'Deploy your first bot', reward: 10, target: 1, type: 'deploys' },
    { id: 'deploy_5', name: 'Getting Serious', desc: 'Deploy 5 bots', reward: 25, target: 5, type: 'deploys' },
    { id: 'refer_3', name: 'Recruiter', desc: 'Refer 3 friends', reward: 15, target: 3, type: 'referrals' },
    { id: 'daily_7', name: 'Loyal User', desc: 'Login 7 days in a row', reward: 30, target: 7, type: 'streak' }
]});
let tagsDB = loadJSON(DB.tags, {});
let auctionsDB = loadJSON(DB.auctions, { active: null, history: [] });
let healthDB = loadJSON(DB.health, {});
let marketDB = loadJSON(DB.market, { listings: [] });
let econDB = loadJSON(DB.economy, { spins: {}, scratch: {}, streaks: {}, quests: {}, referrals: {} });
let adminLogs = loadJSON(DB.logs, []);

function saveDB() { saveJSON(DB.users, usersDB); }
function saveSettings() { saveJSON(DB.settings, settings); }
function saveCoupons() { saveJSON(DB.codes, couponsDB); }
function saveQuests() { saveJSON(DB.quests, questsDB); }
function saveTags() { saveJSON(DB.tags, tagsDB); }
function saveAuctions() { saveJSON(DB.auctions, auctionsDB); }
function saveHealth() { saveJSON(DB.health, healthDB); }
function saveMarket() { saveJSON(DB.market, marketDB); }
function saveEcon() { saveJSON(DB.economy, econDB); }
function saveAdminLogs() { if (adminLogs.length > 1000) adminLogs = adminLogs.slice(-1000); saveJSON(DB.logs, adminLogs); }

let runningProcesses = {};
let userStates = {};
let pendingApprovals = {};

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
let LOG_LEVEL = LEVELS.info;
function log(level, ...a) { if (LEVELS[level] < LOG_LEVEL) return; console.log(`[${moment().format('HH:mm:ss')}] [${level.toUpperCase()}]`, ...a); }
function adminLog(action, adminId, details = {}) { adminLogs.push({ action, adminId: String(adminId), details, timestamp: moment().format() }); saveAdminLogs(); }

function hashBuffer(buf) { return crypto.createHash('sha256').update(buf).digest('hex'); }
function hashFile(f) { try { return hashBuffer(fs.readFileSync(f)); } catch { return null; } }
function maskToken(t) {
    if (!t) return t;
    return String(t)
        .replace(/(\d{8,12}:[A-Za-z0-9_-]{30,40})/g, m => m.slice(0, 10) + '***MASKED***')
        .replace(/(sk-[A-Za-z0-9]{20,})/g, 'sk-***')
        .replace(/(ghp_[A-Za-z0-9]{20,})/g, 'ghp_***')
        .replace(/(AIza[A-Za-z0-9_-]{30,})/g, 'AIza***')
        .replace(/(xox[baprs]-[A-Za-z0-9-]{10,})/g, 'xox-***');
}
function validateZip(zip, extractDir) {
    const base = path.resolve(extractDir);
    for (const e of zip.getEntries()) {
        const t = path.resolve(base, e.entryName);
        if (!t.startsWith(base + path.sep) && t !== base) return { ok: false, reason: e.entryName };
    }
    return { ok: true };
}
const rateMap = {};
function rateLimit(userId, action, max, windowMin) {
    const k = `${userId}_${action}`, now = Date.now(), w = windowMin * 60000;
    if (!rateMap[k]) rateMap[k] = [];
    rateMap[k] = rateMap[k].filter(t => now - t < w);
    if (rateMap[k].length >= max) {
        const wait = Math.ceil((w - (now - rateMap[k][0])) / 60000);
        return { allowed: false, waitMin: wait };
    }
    rateMap[k].push(now);
    return { allowed: true };
}

function premiumText(title, content, icon = '✦', footer = null) {
    const d = '▰▰▰▰▰▰▰▰▰▰▰▰▰▰';
    let h = `\n<b>╔════════════════════╗</b>\n<b>║  ${icon} ${title}</b>\n<b>╚════════════════════╝</b>\n\n<blockquote>${content}</blockquote>`;
    if (footer) h += `\n<blockquote>${footer}</blockquote>`;
    h += `\n<blockquote>━ ${d} ━</blockquote>`;
    return h;
}
const successText = (t, c) => premiumText(`✅ ${t}`, c, '✨', 'Tʜᴀɴᴋ Yᴏᴜ Fᴏʀ Cʜᴏᴏsɪɴɢ 𝕹ex 𝕮ʟᴏᴜᴅ 𝕳ᴏsᴛɪɴɢ');
const errorText = (t, c) => premiumText(`❌ ${t}`, c, '⚠️', 'Pʟᴇᴀsᴇ Tʀʏ Aɢᴀɪɴ Oʀ Cᴏɴᴛᴀᴄᴛ Sᴜᴘᴘᴏʀᴛ');
const infoText = (t, c) => premiumText(`ℹ️ ${t}`, c, '📌', 'Nᴇᴇᴅ Hᴇʟᴘ? Cᴏɴᴛᴀᴄᴛ Sᴜᴘᴘᴏʀᴛ');
const warnText = (t, c) => premiumText(`⚠️ ${t}`, c, '🔔', null);
const esc = s => String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* 𝖋𝖚𝖓𝖈𝖙𝖎𝖔𝖓 𝖙𝖎𝖒𝖊
𝖉𝖔𝖜𝖓 𝖍𝖊𝖗𝖊 𝖜𝖊 𝖜𝖎𝖑𝖑 𝖈𝖆𝖑𝖑 𝖆𝖑𝖑 𝖔𝖚𝖗 𝖋𝖚𝖓𝖈𝖙𝖎𝖔𝖓𝖘 𝖓𝖊𝖊𝖉𝖊𝖉 𝖙𝖔 𝖒𝖆𝖐𝖊 𝖙𝖍𝖎𝖘 𝖇𝖔𝖙 𝖜𝖔𝖗𝖐 
*/
function getHealthScore(uid, fName) {
    const key = `${uid}_${fName}`;
    const h = healthDB[key] || { crashes: 0, restarts: 0, totalUptime: 0, starts: 0 };
    const uptimeMin = h.totalUptime / 60000;
    const crashPenalty = h.crashes * 10;
    const uptimeBonus = Math.min(uptimeMin / 10, 50);
    return Math.round(Math.max(0, Math.min(100, 50 + uptimeBonus - crashPenalty)));
}

function updateHealth(uid, fName, field, delta = 1) {
    const key = `${uid}_${fName}`;
    if (!healthDB[key]) healthDB[key] = { crashes: 0, restarts: 0, totalUptime: 0, starts: 0 };
    healthDB[key][field] = (healthDB[key][field] || 0) + delta;
    saveHealth();
}

function getLogFile(uid, fName) {
    return path.join(LOGS_DIR, `${uid}_${fName.replace(/\./g, '_')}.log`);
}

function appendLog(uid, fName, text) {
    try { fs.appendFileSync(getLogFile(uid, fName), maskToken(text)); } catch {}
}

function runUserFile(filePath, userId, fileName) {
    return new Promise((resolve) => {
        const absPath = path.resolve(filePath);
        if (!fs.existsSync(absPath)) return resolve({ success: false, status: 'File not found' });
        if (path.extname(fileName).toLowerCase() !== '.js') return resolve({ success: false, status: 'Not JS file' });

        const logFile = getLogFile(userId, fileName);
        fs.writeFileSync(logFile, `=== 𝕾ᴛᴀʀᴛᴇᴅ ${moment().format('YYYY-MM-DD HH:mm:ss')} ===\nUsᴇʀ: ${userId}\nFɪʟᴇ: ${fileName}\nPᴀᴛʜ: ${absPath}\n${'='.repeat(50)}\n\n`);

        const child = spawn('node', [absPath], {
            cwd: path.dirname(absPath),
            stdio: ['pipe', 'pipe', 'pipe'],
            env: { ...process.env }
        });

        const info = {
            process: child,
            userId: String(userId),
            fileName,
            startTime: Date.now(),
            logFile,
            pid: child.pid,
            restarts: 0,
            manualStop: false,
            filePath: absPath,
            recentRestarts: []
        };
        runningProcesses[absPath] = info;
        updateHealth(userId, fileName, 'starts');

        child.stdout.on('data', d => appendLog(userId, fileName, d.toString()));
        child.stderr.on('data', d => appendLog(userId, fileName, d.toString()));

        child.on('exit', (code, signal) => {
            const uptimeMs = Date.now() - info.startTime;
            updateHealth(userId, fileName, 'totalUptime', uptimeMs);

            if (info.manualStop) { delete runningProcesses[absPath]; return; }
            delete runningProcesses[absPath];
            updateHealth(userId, fileName, 'crashes');

            const now = Date.now();
            const recent = (info.recentRestarts || []).filter(t => now - t < settings.restart_window_sec * 1000);
            recent.push(now);

            if (settings.auto_restart && recent.length <= settings.max_restarts) {
                updateHealth(userId, fileName, 'restarts');
                appendLog(userId, fileName, `\n\n🔄 Aᴜᴛᴏ-Rᴇsᴛᴀʀᴛ (Aᴛᴛᴇᴍᴘᴛ ${recent.length})...\n`);
                setTimeout(async () => {
                    const r = await runUserFile(absPath, parseInt(userId), fileName);
                    if (runningProcesses[absPath]) runningProcesses[absPath].recentRestarts = recent;
                    if (r.success && settings.crash_alert) {
                        try { bot.sendMessage(userId, warnText('🔄 Aᴜᴛᴏ-Rᴇsᴛᴀʀᴛᴇᴅ', `📄 ${fileName}\nCʀᴀsʜᴇᴅ, Rᴇsᴛᴀʀᴛᴇᴅ (Aᴛᴛᴇᴍᴘᴛ ${recent.length})`), { parse_mode: 'HTML' }); } catch {}
                    }
                }, 3000);
            } else if (settings.crash_alert) {
                try { bot.sendMessage(userId, errorText('💥 Bᴏᴛ Crashed', `📄 ${fileName}\nExɪᴛ: ${code}\nMᴀx Rᴇsᴛᴀʀᴛs Rᴇᴀᴄʜᴇᴅ.`), { parse_mode: 'HTML' }); } catch {}
            }
        });

        setTimeout(() => {
            if (child.exitCode !== null) {
                const err = (fs.readFileSync(logFile, 'utf8') || '').slice(-1500);
                resolve({ success: false, status: `Crash: ${err.slice(-200)}` });
            } else {
                resolve({ success: true, status: 'Running', pid: child.pid });
            }
        }, 3000);
    });
}

function stopBot(filePath) {
    const abs = path.resolve(filePath);
    if (runningProcesses[abs]) {
        runningProcesses[abs].manualStop = true;
        try { runningProcesses[abs].process.kill('SIGTERM'); } catch {}
        setTimeout(() => { try { runningProcesses[abs]?.process.kill('SIGKILL'); } catch {} }, 2000);
        delete runningProcesses[abs];
        return true;
    }
    return false;
}

function sendToBot(filePath, input) {
    const abs = path.resolve(filePath);
    const info = runningProcesses[abs];
    if (info && info.process.stdin.writable) {
        info.process.stdin.write(input + '\n');
        return true;
    }
    return false;
}

async function installNodeDeps(dirPath) {
    return new Promise(resolve => {
        const pkgPath = path.join(dirPath, 'package.json');
        if (!fs.existsSync(pkgPath)) {
            fs.writeFileSync(pkgPath, JSON.stringify({ name: 'nex-deployed-bot', version: '1.0.0', main: 'index.js', dependencies: {} }, null, 2));
        }
        exec('npm install --production --silent --no-audit --no-fund', { cwd: dirPath, timeout: 120000 }, err => {
            resolve({ success: !err, msg: err ? 'npm install failed' : 'Deps installed' });
        });
    });
}

function walkDir(dir, exts) {
    const out = [];
    const walk = d => {
        let files; try { files = fs.readdirSync(d); } catch { return; }
        for (const f of files) {
            const full = path.join(d, f);
            let stat; try { stat = fs.statSync(full); } catch { continue; }
            if (stat.isDirectory()) walk(full);
            else if (exts.some(e => f.endsWith(e))) out.push(full);
        }
    };
    walk(dir);
    return out;
}

function pickMainJs(files) {
    const priority = ['index.js', 'main.js', 'bot.js', 'app.js', 'server.js', 'start.js'];
    for (const p of priority) {
        const found = files.find(f => path.basename(f) === p);
        if (found) return found;
    }
    return files[0];
}

async function downloadBuffer(url) {
    return new Promise((resolve, reject) => {
        const mod = url.startsWith('https') ? https : require('http');
        mod.get(url, res => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return downloadBuffer(res.headers.location).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end', () => resolve(Buffer.concat(chunks)));
            res.on('error', reject);
        }).on('error', reject);
    });
}

async function fetchTelegramFile(fileId) {
    const file = await bot.getFile(fileId);
    const url = `https://api.telegram.org/file/bot${TOKEN}/${file.file_path}`;
    return await downloadBuffer(url);
}

async function cloneGitHubRepo(repoUrl, targetDir) {
    return new Promise(resolve => {
        exec(`git clone --depth 1 "${repoUrl}" "${targetDir}"`, { timeout: 120000 }, err => {
            resolve({ success: !err, msg: err ? err.message : 'Cloned' });
        });
    });
}

async function importFromUrl(url, targetFile) {
    try {
        const buf = await downloadBuffer(url);
        fs.writeFileSync(targetFile, buf);
        return { success: true };
    } catch (e) { return { success: false, msg: e.message }; }
}

const TEMPLATES_FILE = path.join(BASE_DIR, 'templates.json');

const DEFAULT_TEMPLATES = {

    ptero_admin: {
        name: 'Pᴛᴇʀᴏᴅᴀᴄᴛʏʟ Pᴀɴɴᴇʟ', cat: 'Infrastructure', price: 160,
        desc: 'Pᴛᴇʀᴏᴅᴀᴄᴛʏʟ Pᴀɴɴᴇʟ Bᴏᴛ: Cʀᴇᴀᴛᴇ/Lɪsᴛ/Dᴇʟᴇᴛᴇ Nᴏᴅᴇs, Usᴇʀs, Sᴇʀᴠᴇʀs, Aʟʟᴏᴄᴀᴛɪᴏɴs Vɪᴀ Aᴘᴘʟɪᴄᴀᴛɪᴏɴ Aᴘɪ. Kɪʟʟ Sᴡɪᴛᴄʜ, Sᴜsᴘᴇɴsɪᴏɴ, Nᴏᴅᴇ Sᴛᴀᴛs.',
        requires_env: 'TOKEN,PTR_API_KEY,PTR_URL,ADMIN_ID',
        code: `const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const KEY = process.env.PTR_API_KEY, BASE = process.env.PTR_URL, ADMIN = process.env.ADMIN_ID;

function req(method, path, body) {
  return new Promise((res, rej) => {
    const u = new URL(BASE + '/api/application' + path);
    const data = body ? JSON.stringify(body) : null;
    const headers = { 'Authorization': 'Bearer ' + KEY, 'Accept': 'application/json', 'Content-Type': 'application/json' };
    if (data) headers['Content-Length'] = Buffer.byteLength(data);
    const r = https.request({ hostname: u.hostname, path: u.pathname + u.search, method, headers }, x => {
      let d = ''; x.on('data', c => d += c);
      x.on('end', () => { try { res({ s: x.statusCode, b: JSON.parse(d) }); } catch { res({ s: x.statusCode, b: d }); } });
    });
    r.on('error', rej); if (data) r.write(data); r.end();
  });
}

const isAdmin = m => String(m.from.id) === String(ADMIN);

bot.onText(/\\/users(?: (\\d+))?/, async (m, match) => {
  if (!isAdmin(m)) return;
  const page = match[1] || 1;
  const r = await req('GET', '/users?page=' + page + '&per_page=10');
  if (r.s >= 400) return bot.sendMessage(m.chat.id, '❌ ' + JSON.stringify(r.b).slice(0,200));
  const list = r.b.data.map(u => '• #' + u.attributes.id + ' ' + u.attributes.username + ' <' + u.attributes.email + '>').join('\\n');
  bot.sendMessage(m.chat.id, '👥 *Users (page ' + page + ', total ' + r.b.meta.pagination.total + ')*\\n' + list, { parse_mode: 'Markdown' });
});

bot.onText(/\\/mkuser (\\S+) (\\S+)/, async (m, match) => {
  if (!isAdmin(m)) return;
  const [, email, username] = match;
  const pass = Math.random().toString(36).slice(2, 12) + 'A1!';
  const r = await req('POST', '/users', { email, username, first_name: 'TG', last_name: 'User', password: pass });
  if (r.s >= 400) return bot.sendMessage(m.chat.id, '❌ ' + JSON.stringify(r.b).slice(0,250));
  bot.sendMessage(m.chat.id, '✅ Created\\nID: ' + r.b.attributes.id + '\\nEmail: ' + email + '\\nPass: \`' + pass + '\`', { parse_mode: 'Markdown' });
});

bot.onText(/\\/deluser (\\d+)/, async (m, match) => {
  if (!isAdmin(m)) return;
  const r = await req('DELETE', '/users/' + match[1]);
  bot.sendMessage(m.chat.id, r.s === 204 ? '🗑 Deleted' : '❌ ' + r.s);
});

bot.onText(/\\/nodes/, async m => {
  if (!isAdmin(m)) return;
  const r = await req('GET', '/nodes');
  if (r.s >= 400) return bot.sendMessage(m.chat.id, '❌ ' + r.s);
  const list = r.b.data.map(n => '• #' + n.attributes.id + ' ' + n.attributes.name + ' — ' + n.attributes.public ? 'online' : '?').join('\\n');
  bot.sendMessage(m.chat.id, '🖧 *Nodes*\\n' + list, { parse_mode: 'Markdown' });
});

bot.onText(/\\/srvlist (\\d+)/, async (m, match) => {
  if (!isAdmin(m)) return;
  const r = await req('GET', '/servers?page=' + match[1] + '&per_page=15');
  if (r.s >= 400) return bot.sendMessage(m.chat.id, '❌');
  const list = r.b.data.map(s => '• #' + s.attributes.id + ' ' + s.attributes.name + ' [' + s.attributes.identifier + ']').join('\\n');
  bot.sendMessage(m.chat.id, '🖥 *Servers*\\n' + list, { parse_mode: 'Markdown' });
});

bot.onText(/\\/suspendsrv (\\d+)/, async (m, match) => {
  if (!isAdmin(m)) return;
  const r = await req('POST', '/servers/' + match[1] + '/suspend');
  bot.sendMessage(m.chat.id, r.s < 400 ? '⏸ Suspended' : '❌ ' + r.s);
});

bot.onText(/\\/unsuspendsrv (\\d+)/, async (m, match) => {
  if (!isAdmin(m)) return;
  const r = await req('POST', '/servers/' + match[1] + '/unsuspend');
  bot.sendMessage(m.chat.id, r.s < 400 ? '▶️ Unsuspended' : '❌ ' + r.s);
});

bot.onText(/\\/delsrv (\\d+)/, async (m, match) => {
  if (!isAdmin(m)) return;
  const r = await req('DELETE', '/servers/' + match[1]);
  bot.sendMessage(m.chat.id, r.s === 204 ? '🗑 Server deleted' : '❌ ' + r.s);
});

bot.onText(/\\/pterohelp/, m => {
  if (!isAdmin(m)) return;
  bot.sendMessage(m.chat.id, '📖 *Ptero Admin*\\n/users [page]\\n/mkuser <email> <username>\\n/deluser <id>\\n/nodes\\n/srvlist <page>\\n/suspendsrv <id>\\n/unsuspendsrv <id>\\n/delsrv <id>', { parse_mode: 'Markdown' });
});

bot.on('polling_error', e => console.error(e.message));
console.log('✅ Ptero admin running');`
    },

    hosting_reseller: {
        name: 'Hᴏsᴛɪɴɢ Rᴇsᴇʟʟᴇʀ Bᴏᴛ', cat: 'Infrastructure', price: 170,
        desc: 'Sᴇʟʟ Cᴘᴀɴᴇʟ Hᴏsᴛɪɴɢ Vɪᴀ Wʜᴍ Aᴘɪ. Cʀᴇᴀᴛᴇ Aᴄᴄᴏᴜɴᴛs, Sᴜsᴘᴇɴᴅ, Tᴇʀᴍɪɴᴀᴛᴇ, Cʜᴀɴɢᴇ Pᴀᴄᴋᴀɢᴇs. Tʀᴀᴄᴋs Bɪʟʟɪɴɢ.',
        requires_env: 'TOKEN,WHM_HOST,WHM_USER,WHM_TOKEN,ADMIN_ID',
        code: `const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const fs = require('fs'), path = require('path');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const WHM_HOST = process.env.WHM_HOST, WHM_USER = process.env.WHM_USER, WHM_TOKEN = process.env.WHM_TOKEN, ADMIN = process.env.ADMIN_ID;

const DB = path.join(__dirname, 'whm_users.json');
let db = { users: {}, accounts: [] };
if (fs.existsSync(DB)) { try { db = JSON.parse(fs.readFileSync(DB, 'utf8')); } catch {} }
function save() { fs.writeFileSync(DB, JSON.stringify(db, null, 2)); }

const PACKAGES = {
  basic:   { name: 'Basic',   price: 3.99,  quota: 5000,  bw: 50000 },
  starter: { name: 'Starter', price: 6.99,  quota: 20000, bw: 200000 },
  business:{ name: 'Business',price: 12.99, quota: 50000, bw: 500000 },
  pro:     { name: 'Pro',     price: 24.99, quota: 999999,bw: 999999 }
};

function whm(path, params = {}) {
  return new Promise((res, rej) => {
    const q = new URLSearchParams(params).toString();
    const r = https.request({
      hostname: WHM_HOST, path: path + '?api.version=1&' + q, method: 'GET',
      headers: { 'Authorization': 'whm ' + WHM_USER + ':' + WHM_TOKEN }
    }, x => { let d = ''; x.on('data', c => d += c); x.on('end', () => { try { res(JSON.parse(d)); } catch { res(d); } }); });
    r.on('error', rej); r.end();
  });
}

function user(id) { if (!db.users[id]) db.users[id] = { balance: 0, accounts: [] }; return db.users[id]; }

bot.onText(/\\/start/, m => {
  user(m.from.id);
  bot.sendMessage(m.chat.id, '🌐 *Hᴏsᴛɪɴɢ Rᴇsᴇʟʟᴇʀ*\\n\\n/Pʟᴀɴs — Bᴜʏ Hᴏsᴛɪɴɢ\\n/Mʏᴀᴄᴄᴏᴜɴᴛs — Lɪsᴛ\\n/Bᴀʟᴀɴᴄᴇ — Ғᴜɴᴅs\\n\\<a href='https://t.me/NEX_TECH_HOSTING_ROBOT'>~Nᴇx Tᴇᴄʜ Pʀᴇᴍɪᴜᴍ Hᴏsᴛɪɴɢ Rᴏʙᴏᴛ</a>', { parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text: '🛒 ᴘʟᴀɴs', callback_data: 'whm:plans' }]] } });
});

bot.on('callback_query', async q => {
  const uid = q.from.id, u = user(uid);
  if (q.data === 'whm:plans') {
    const kb = Object.entries(PACKAGES).map(([k, p]) => [{ text: p.name + ' — $' + p.price + '/mo', callback_data: 'whm:buy:' + k }]);
    bot.sendMessage(uid, '📦 Select plan:', { reply_markup: { inline_keyboard: kb } });
    bot.answerCallbackQuery(q.id);
  }
  if (q.data.startsWith('whm:buy:')) {
    const plan = q.data.split(':')[2];
    const p = PACKAGES[plan];
    if (u.balance < p.price) return bot.answerCallbackQuery(q.id, { text: '❌ Need $' + p.price, show_alert: true });
    bot.sendMessage(uid, '📝 Send: \`/order ' + plan + ' <domain> <username> <password>\`', { parse_mode: 'Markdown' });
    bot.answerCallbackQuery(q.id);
  }
});

bot.onText(/\\/order (\\w+) (\\S+) (\\w+) (\\S+)/, async (m, match) => {
  const [, plan, domain, username, password] = match;
  const u = user(m.from.id);
  if (!PACKAGES[plan]) return bot.sendMessage(m.chat.id, '❌ Unknown plan');
  if (u.balance < PACKAGES[plan].price) return bot.sendMessage(m.chat.id, '❌ Insufficient funds');
  const status = await bot.sendMessage(m.chat.id, '⏳ Creating cPanel account...');
  try {
    const r = await whm('/json-api/createacct', { username, domain, plan: 'default', password, contactemail: 'user' + m.from.id + '@host.local' });
    if (r.metadata?.result !== 1) throw new Error(JSON.stringify(r.metadata?.reason || r).slice(0,250));
    u.balance -= PACKAGES[plan].price;
    u.accounts.push({ username, domain, plan, createdAt: Date.now() });
    save();
    bot.editMessageText('✅ *Hosting Created!*\\n\\n🌐 ' + domain + '\\n👤 ' + username + '\\n🔑 Password: \`' + password + '\`', { chat_id: m.chat.id, message_id: status.message_id, parse_mode: 'Markdown' });
  } catch (e) { bot.editMessageText('❌ ' + e.message.slice(0, 250), { chat_id: m.chat.id, message_id: status.message_id }); }
});

bot.onText(/\\/myaccounts/, m => {
  const u = user(m.from.id);
  if (!u.accounts.length) return bot.sendMessage(m.chat.id, '📭 None yet');
  bot.sendMessage(m.chat.id, '🌐 *Accounts*\\n' + u.accounts.map(a => '• ' + a.domain + ' (' + a.plan + ')').join('\\n'), { parse_mode: 'Markdown' });
});

bot.onText(/\\/suspend (\\S+)/, async (m, match) => {
  const u = user(m.from.id);
  const acc = u.accounts.find(a => a.domain === match[1]);
  if (!acc) return bot.sendMessage(m.chat.id, '❌ Not found');
  const r = await whm('/json-api/suspendacct', { user: acc.username, reason: 'User request' });
  bot.sendMessage(m.chat.id, r.metadata?.result === 1 ? '⏸ Suspended' : '❌ ' + (r.metadata?.reason || 'failed'));
});

bot.onText(/\\/credit (\\d+) ([\\d.]+)/, (m, match) => {
  if (String(m.from.id) !== String(ADMIN)) return;
  const u = user(match[1]); u.balance += parseFloat(match[2]); save();
  bot.sendMessage(m.chat.id, '✅ Credited');
  bot.sendMessage(match[1], '💰 $' + match[2] + ' added').catch(()=>{});
});

bot.on('polling_error', e => console.error(e.message));
console.log('✅ WHM reseller running');`
    },

   
    rdp_seller: {
        name: 'Rᴅᴘ Sᴇʟʟᴇʀ Bᴏᴛ', cat: 'Infrastructure', price: 155,
        desc: 'Sᴇʟʟ Wɪɴᴅᴏᴡs Rᴅᴘ Sᴇssɪᴏɴs. Pʀᴏᴠɪsɪᴏɴ Vɪᴀ Hᴇᴛᴢɴᴇʀ + Cʟᴏᴜᴅ-Iɴɪᴛ, Dᴇʟɪᴠᴇʀ Iᴘ/Usᴇʀ/Pᴀss. Lɪғᴇᴄʏᴄʟᴇ Vɪᴀ Aᴘɪ.',
        requires_env: 'TOKEN,HETZNER_KEY,ADMIN_ID',
        code: `const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const fs = require('fs'), path = require('path');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const KEY = process.env.HETZNER_KEY, ADMIN = process.env.ADMIN_ID;
const DB = path.join(__dirname, 'rdp.json');

let db = { users: {}, rdps: [] };
if (fs.existsSync(DB)) { try { db = JSON.parse(fs.readFileSync(DB, 'utf8')); } catch {} }
function save() { fs.writeFileSync(DB, JSON.stringify(db, null, 2)); }

const PLANS = {
  rdp1: { name: '🥉 RDP 2vCPU/4GB', cpu: 2, ram: 4, disk: 40, price: 8.99, htype: 'cx22' },
  rdp2: { name: '🥈 RDP 4vCPU/8GB', cpu: 4, ram: 8, disk: 80, price: 16.99, htype: 'cx32' },
  rdp3: { name: '🥇 RDP 8vCPU/16GB', cpu: 8, ram: 16, disk: 160, price: 32.99, htype: 'cx42' }
};

function api(method, endpoint, body) {
  return new Promise((res, rej) => {
    const data = body ? JSON.stringify(body) : null;
    const headers = { 'Authorization': 'Bearer ' + KEY, 'Content-Type': 'application/json' };
    if (data) headers['Content-Length'] = Buffer.byteLength(data);
    const r = https.request({ hostname: 'api.hetzner.cloud', path: '/v1' + endpoint, method, headers }, x => {
      let d = ''; x.on('data', c => d += c);
      x.on('end', () => { try { res({ s: x.statusCode, b: JSON.parse(d) }); } catch { res({ s: x.statusCode, b: d }); } });
    });
    r.on('error', rej); if (data) r.write(data); r.end();
  });
}

function user(id) { if (!db.users[id]) db.users[id] = { balance: 0, rdps: [] }; return db.users[id]; }
const genPass = () => 'Rdp' + Math.random().toString(36).slice(2, 10) + '!9';

bot.onText(/\\/start/, m => {
  user(m.from.id);
  bot.sendMessage(m.chat.id, '🖥 *ʀᴅᴘ sᴇʟʟᴇʀ*\\n\\nɪɴsᴛᴀɴᴛ ᴡɪɴᴅᴏᴡs ʀᴅᴘ\\n\\<a href='https://t.me/NEX_TECH_HOSTING_ROBOT'>~Nᴇx Tᴇᴄʜ Pʀᴇᴍɪᴜᴍ Hᴏsᴛɪɴɢ Rᴏʙᴏᴛ</a>.', { parse_mode: 'HTML', reply_markup: { inline_keyboard: [
    [{ text: '🛒 Buy RDP', callback_data: 'rdp:plans' }],
    [{ text: '🖥 My RDPs', callback_data: 'rdp:list' }]
  ]}});
});

bot.on('callback_query', async q => {
  const uid = q.from.id, u = user(uid);
  if (q.data === 'rdp:plans') {
    const kb = Object.entries(PLANS).map(([k, p]) => [{ text: p.name + ' — $' + p.price + '/mo', callback_data: 'rdp:buy:' + k }]);
    bot.sendMessage(uid, '📦 Plans:', { reply_markup: { inline_keyboard: kb } });
    bot.answerCallbackQuery(q.id);
  }
  if (q.data.startsWith('rdp:buy:')) {
    const plan = q.data.split(':')[2], p = PLANS[plan];
    if (u.balance < p.price) return bot.answerCallbackQuery(q.id, { text: '❌ Need $' + p.price, show_alert: true });
    const status = await bot.sendMessage(uid, '⏳ Deploying Windows RDP...');
    try {
      const r = await api('POST', '/servers', {
        name: 'rdp-' + uid + '-' + Date.now(),
        server_type: p.htype,
        image: 'ubuntu-22.04',
        location: 'fsn1',
        start_after_create: true,
        user_data: '#cloud-config\\nusers:\\n  - name: Administrator\\n    sudo: ALL=(ALL) NOPASSWD:ALL\\n    shell: /bin/bash\\n    lock_passwd: false\\nchpasswd:\\n  list: |\\n    Administrator:' + genPass() + '\\nssh_pwauth: true\\n'
      });
      if (r.s >= 400) throw new Error(JSON.stringify(r.b).slice(0,250));
      const srv = r.b.server;
      const pass = genPass();
      u.balance -= p.price;
      const rec = { id: srv.id, name: srv.name, ip: srv.public_net?.ipv4?.ip, pass, plan, status: 'provisioning' };
      u.rdps.push(rec); save();
      bot.editMessageText('✅ *RDP Deployed!*\\n\\n🖥 IP: ' + rec.ip + '\\n👤 Administrator\\n🔑 \`' + pass + '\`\\n\\nWait 5-10 min for Windows install.', { chat_id: uid, message_id: status.message_id, parse_mode: 'Markdown' });
    } catch (e) { bot.editMessageText('❌ ' + e.message.slice(0,250), { chat_id: uid, message_id: status.message_id }); }
    bot.answerCallbackQuery(q.id);
  }
  if (q.data === 'rdp:list') {
    if (!u.rdps.length) return bot.answerCallbackQuery(q.id, { text: 'None' });
    const kb = u.rdps.map(r => [{ text: '🖥 ' + r.ip, callback_data: 'rdp:srv:' + r.id }]);
    bot.sendMessage(uid, '🖥 Your RDPs:', { reply_markup: { inline_keyboard: kb } });
    bot.answerCallbackQuery(q.id);
  }
  if (q.data.startsWith('rdp:srv:')) {
    const id = q.data.split(':')[2], r = u.rdps.find(x => String(x.id) === id);
    if (!r) return bot.answerCallbackQuery(q.id);
    bot.sendMessage(uid, '🖥 *' + r.ip + '*\\n🔑 \`' + r.pass + '\`', { parse_mode: 'Markdown', reply_markup: { inline_keyboard: [
      [{ text: '🔄 Reboot', callback_data: 'rdp:reboot:' + id }],
      [{ text: '🔑 Reset Pass', callback_data: 'rdp:reset:' + id }]
    ]}});
    bot.answerCallbackQuery(q.id);
  }
  if (q.data.startsWith('rdp:reboot:')) {
    const id = q.data.split(':')[2];
    await api('POST', '/servers/' + id + '/actions/reboot', {});
    bot.answerCallbackQuery(q.id, { text: '🔄 Rebooting' });
  }
  if (q.data.startsWith('rdp:reset:')) {
    const id = q.data.split(':')[2], r = u.rdps.find(x => String(x.id) === id);
    r.pass = genPass(); save();
    bot.answerCallbackQuery(q.id, { text: '🔑 ' + r.pass, show_alert: true });
  }
});

bot.onText(/\\/credit (\\d+) ([\\d.]+)/, (m, match) => {
  if (String(m.from.id) !== String(ADMIN)) return;
  const u = user(match[1]); u.balance += parseFloat(match[2]); save();
  bot.sendMessage(m.chat.id, '✅ Credited');
  bot.sendMessage(match[1], '💰 $' + match[2] + ' added').catch(()=>{});
});

bot.on('polling_error', e => console.error(e.message));
console.log('✅ RDP seller running');`
    },

    domain_reseller: {
        name: 'Dᴏᴍᴀɪɴ Rᴇsᴇʟʟᴇʀ Bᴏᴛ', cat: 'Infrastructure', price: 140,
        desc: 'Sᴇᴀʀᴄʜ + Rᴇɢɪsᴛᴇʀ Dᴏᴍᴀɪɴs Vɪᴀ Nᴀᴍᴇᴄʜᴇᴀᴘ Aᴘɪ. Dɴs Mᴀɴᴀɢᴇᴍᴇɴᴛ, Wʜᴏɪs, Aᴜᴛᴏ-Rᴇɴᴇᴡ Tᴏɢɢʟᴇs.',
        requires_env: 'TOKEN,NC_API_USER,NC_API_KEY,NC_USERNAME,ADMIN_ID',
        code: `const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const NC_USER = process.env.NC_API_USER, NC_KEY = process.env.NC_API_KEY, NC_OWNER = process.env.NC_USERNAME, ADMIN = process.env.ADMIN_ID;

function nc(cmd, params) {
  return new Promise((res, rej) => {
    const all = { ApiUser: NC_USER, ApiKey: NC_KEY, UserName: NC_OWNER, ClientIp: '127.0.0.1', Command: cmd, ...params };
    const body = new URLSearchParams(all).toString();
    const r = https.request({
      hostname: 'api.namecheap.com', path: '/xml.response', method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(body) }
    }, x => { let d = ''; x.on('data', c => d += c); x.on('end', () => res(d)); });
    r.on('error', rej); r.write(body); r.end();
  });
}

const tag = (xml, t) => (xml.match(new RegExp('<' + t + '>([^<]+)')) || [])[1] || '';

bot.onText(/\\/check (\\S+)/, async (m, match) => {
  const domain = match[1];
  const status = await bot.sendMessage(m.chat.id, '🔍 Checking ' + domain + '...');
  try {
    const parts = domain.split('.');
    const xml = await nc('namecheap.domains.check', { DomainList: domain });
    const available = tag(xml, 'Available') === 'true';
    if (!available) return bot.editMessageText('❌ *' + domain + '* is taken', { chat_id: m.chat.id, message_id: status.message_id, parse_mode: 'Markdown' });
    bot.editMessageText('✅ *' + domain + '* is available!', { chat_id: m.chat.id, message_id: status.message_id, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🛒 Register', callback_data: 'dom:reg:' + domain }]] } });
  } catch (e) { bot.editMessageText('❌ ' + e.message, { chat_id: m.chat.id, message_id: status.message_id }); }
});

bot.on('callback_query', async q => {
  if (q.data.startsWith('dom:reg:')) {
    const domain = q.data.split(':')[2];
    if (String(q.from.id) !== String(ADMIN)) return bot.answerCallbackQuery(q.id, { text: 'Admin only', show_alert: true });
    const [sld, tld] = domain.split(/\.(.+)/);
    const xml = await nc('namecheap.domains.create', {
      DomainName: domain, Years: 1,
      RegistrantFirstName: 'Admin', RegistrantLastName: 'User',
      RegistrantAddress1: '123 Main St', RegistrantCity: 'New York', RegistrantStateProvince: 'NY',
      RegistrantPostalCode: '10001', RegistrantCountry: 'US', RegistrantPhone: '+1.2125551234',
      RegistrantEmailAddress: 'admin@' + domain,
      TechFirstName: 'Admin', TechLastName: 'User', TechAddress1: '123 Main St', TechCity: 'New York',
      TechStateProvince: 'NY', TechPostalCode: '10001', TechCountry: 'US',
      TechPhone: '+1.2125551234', TechEmailAddress: 'tech@' + domain,
      AdminFirstName: 'Admin', AdminLastName: 'User', AdminAddress1: '123 Main St', AdminCity: 'New York',
      AdminStateProvince: 'NY', AdminPostalCode: '10001', AdminCountry: 'US',
      AdminPhone: '+1.2125551234', AdminEmailAddress: 'admin@' + domain,
      AuxBillingFirstName: 'Admin', AuxBillingLastName: 'User', AuxBillingAddress1: '123 Main St',
      AuxBillingCity: 'New York', AuxBillingStateProvince: 'NY', AuxBillingPostalCode: '10001',
      AuxBillingCountry: 'US', AuxBillingPhone: '+1.2125551234', AuxBillingEmailAddress: 'billing@' + domain
    });
    const success = xml.includes('IsSuccess="true"');
    bot.sendMessage(q.from.id, success ? '✅ Registered *' + domain + '*' : '❌ Registration failed: ' + xml.slice(0, 250), { parse_mode: 'Markdown' });
    bot.answerCallbackQuery(q.id);
  }
});

bot.onText(/\\/mydomains/, async m => {
  const xml = await nc('namecheap.domains.getList', { PageSize: '50' });
  const domains = [...xml.matchAll(/<Domain[^>]*Name="([^"]+)"[^>]*Expires="([^"]+)"/g)].map(x => '• ' + x[1] + ' (exp ' + x[2].slice(0, 10) + ')');
  bot.sendMessage(m.chat.id, domains.length ? '🌐 *Domains*\\n' + domains.join('\\n') : '📭 None', { parse_mode: 'Markdown' });
});

bot.onText(/\\/dns (\\S+)/, async (m, match) => {
  const [sld, tld] = match[1].split(/\.(.+)/);
  const xml = await nc('namecheap.domains.dns.getHosts', { SLD: sld, TLD: tld });
  const hosts = [...xml.matchAll(/<host[^>]*Name="([^"]*)"[^>]*Type="([^"]*)"[^>]*Address="([^"]*)"/g)].map(x => '• ' + x[1] + ' ' + x[2] + ' → ' + x[3]);
  bot.sendMessage(m.chat.id, hosts.length ? '📋 *DNS for ' + match[1] + '*\\n' + hosts.join('\\n') : '📭 No records', { parse_mode: 'Markdown' });
});

bot.on('polling_error', e => console.error(e.message));
console.log('✅ Domain reseller running');`
    },

    payment_gateway: {
        name: 'Pᴀʏᴍᴇɴᴛ Gᴀᴛᴇᴡᴀʏ Bᴏᴛ', cat: 'Payments', price: 130,
        desc: 'Mᴜʟᴛɪ-Cᴜʀʀᴇɴᴄʏ Tᴏᴘ-Uᴘ: Mᴀɴᴜᴀʟ Uᴘɪ/Cʀʏᴘᴛᴏ Aᴅᴍɪɴ Aᴘᴘʀᴏᴠᴀʟ, Tᴇʟᴇɢʀᴀᴍ Sᴛᴀʀs Aᴜᴛᴏ, Bᴛᴄ/Eᴛʜ/Lᴛᴄ Aᴅᴅʀᴇss Gᴇɴᴇʀᴀᴛɪᴏɴ.',
        requires_env: 'TOKEN,ADMIN_ID',
        code: `const TelegramBot = require('node-telegram-bot-api');
const crypto = require('crypto');
const fs = require('fs'), path = require('path');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const ADMIN = process.env.ADMIN_ID;
const DB = path.join(__dirname, 'payments.json');

let db = { users: {}, pending: [], history: [] };
if (fs.existsSync(DB)) { try { db = JSON.parse(fs.readFileSync(DB, 'utf8')); } catch {} }
function save() { fs.writeFileSync(DB, JSON.stringify(db, null, 2)); }

const METHODS = {
  upi:    { name: '🇮🇳 UPI',             addr: 'yourupi@bank',     min: 1,   max: 500 },
  btc:    { name: '₿ Bitcoin',           addr: 'bc1q...yourbtc',   min: 5,   max: 1000 },
  eth:    { name: 'Ξ Ethereum',          addr: '0x...youreth',     min: 5,   max: 1000 },
  ltc:    { name: 'Ł Litecoin',          addr: 'ltc1q...yourltc',  min: 2,   max: 500 },
  usdt:   { name: '💵 USDT (TRC20)',     addr: 'T...yourusdt',     min: 5,   max: 1000 }
};

function user(id) { if (!db.users[id]) db.users[id] = { balance: 0 }; return db.users[id]; }
const txid = () => 'TXN' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();

bot.onText(/\\/start/, m => {
  user(m.from.id);
  bot.sendMessage(m.chat.id, '💳 *Top Up Balance*\\n\\nChoose payment method:\\n\\<a href='https://t.me/NEX_TECH_HOSTING_ROBOT'>~Nᴇx Tᴇᴄʜ Pʀᴇᴍɪᴜᴍ Hᴏsᴛɪɴɢ Rᴏʙᴏᴛ</a>', { parse_mode: 'HTML', reply_markup: { inline_keyboard: [
    [{ text: '💳 All methods', callback_data: 'pay:list' }],
    [{ text: '💰 Balance', callback_data: 'pay:balance' }, { text: '📜 History', callback_data: 'pay:history' }]
  ]}});
});

bot.on('callback_query', async q => {
  const uid = q.from.id;
  if (q.data === 'pay:list') {
    const kb = Object.entries(METHODS).map(([k, v]) => [{ text: v.name, callback_data: 'pay:m:' + k }]);
    bot.sendMessage(uid, '📋 Select method:', { reply_markup: { inline_keyboard: kb } });
    bot.answerCallbackQuery(q.id);
  }
  if (q.data === 'pay:balance') {
    bot.answerCallbackQuery(q.id, { text: '💰 $' + user(uid).balance.toFixed(2), show_alert: true });
  }
  if (q.data === 'pay:history') {
    const h = db.history.filter(x => x.uid === uid).slice(-10).reverse();
    bot.sendMessage(uid, h.length ? '📜 *History*\\n' + h.map(x => '• ' + x.id + ' $' + x.amount + ' [' + x.status + ']').join('\\n') : '📭 No transactions', { parse_mode: 'Markdown' });
    bot.answerCallbackQuery(q.id);
  }
  if (q.data.startsWith('pay:m:')) {
    const method = q.data.split(':')[2], m = METHODS[method];
    bot.sendMessage(uid, '💳 *' + m.name + '*\\n\\nMin: $' + m.min + '\\nMax: $' + m.max + '\\nAddress: \`' + m.addr + '\`\\n\\nSend: \`/paid ' + method + ' <amount> <txid>\`', { parse_mode: 'Markdown' });
    bot.answerCallbackQuery(q.id);
  }
});

bot.onText(/\\/paid (\\w+) ([\\d.]+) (\\S+)/, async (m, match) => {
  const [, method, amountStr, txHash] = match;
  const amount = parseFloat(amountStr);
  if (!METHODS[method]) return bot.sendMessage(m.chat.id, '❌ Unknown method');
  const mInfo = METHODS[method];
  if (amount < mInfo.min || amount > mInfo.max) return bot.sendMessage(m.chat.id, '❌ Range: $' + mInfo.min + '-' + mInfo.max);
  const id = txid();
  db.pending.push({ id, uid: m.from.id, method, amount, txHash, ts: Date.now() });
  save();
  bot.sendMessage(m.chat.id, '✅ Submitted!\\n🆔 ' + id + '\\n⏳ Awaiting admin verification', { parse_mode: 'Markdown' });
  bot.sendMessage(ADMIN, '🔔 *New top-up*\\n\\n🆔 ' + id + '\\nUser: ' + m.from.id + '\\nMethod: ' + method + '\\nAmount: $' + amount + '\\nTXID: \`' + txHash + '\`\\n\\n/approve ' + id + '\\n/reject ' + id, { parse_mode: 'Markdown' });
});

bot.onText(/\\/approve (\\S+)/, (m, match) => {
  if (String(m.from.id) !== String(ADMIN)) return;
  const i = db.pending.findIndex(x => x.id === match[1]);
  if (i < 0) return bot.sendMessage(m.chat.id, '❌ Not found');
  const p = db.pending.splice(i, 1)[0];
  user(p.uid).balance += p.amount;
  db.history.push({ ...p, status: 'APPROVED', at: Date.now() });
  save();
  bot.sendMessage(p.uid, '✅ Payment approved!\\n💰 +$' + p.amount.toFixed(2), { parse_mode: 'Markdown' }).catch(()=>{});
  bot.sendMessage(m.chat.id, '✅ Approved ' + p.id);
});

bot.onText(/\\/reject (\\S+)/, (m, match) => {
  if (String(m.from.id) !== String(ADMIN)) return;
  const i = db.pending.findIndex(x => x.id === match[1]);
  if (i < 0) return bot.sendMessage(m.chat.id, '❌ Not found');
  const p = db.pending.splice(i, 1)[0];
  db.history.push({ ...p, status: 'REJECTED', at: Date.now() });
  save();
  bot.sendMessage(p.uid, '❌ Payment rejected.').catch(()=>{});
  bot.sendMessage(m.chat.id, '❌ Rejected');
});

bot.onText(/\\/pending/, m => {
  if (String(m.from.id) !== String(ADMIN)) return;
  bot.sendMessage(m.chat.id, db.pending.length ? db.pending.map(p => '• ' + p.id + ' ' + p.uid + ' $' + p.amount).join('\\n') : '📭 None');
});

bot.on('polling_error', e => console.error(e.message));
console.log('✅ Payment gateway running');`
    },

    apk_distributor: {
        name: 'ᴀᴘᴋ / ᴍᴏᴅ ᴅɪsᴛʀɪʙᴜᴛᴏʀ', cat: 'Downloader', price: 95,
        desc: 'ᴅɪsᴛʀɪʙᴜᴛᴇ ᴀᴘᴋs ᴀɴᴅ ᴍᴏᴅs. sᴇᴀʀᴄʜ, ᴅᴏᴡɴʟᴏᴀᴅ, ᴠᴇʀsɪᴏɴ ᴛʀᴀᴄᴋɪɴɢ, sɪᴢᴇ ʟɪᴍɪᴛ, ᴀᴅᴍɪɴ ᴜᴘʟᴏᴀᴅ, ᴄᴀᴛᴇɢᴏʀʏ ʙʀᴏᴡsᴇʀ.',
        requires_env: 'TOKEN,STORAGE_CHANNEL,ADMIN_ID',
        code: `const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs'), path = require('path');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const CHAN = process.env.STORAGE_CHANNEL, ADMIN = process.env.ADMIN_ID;
const DB = path.join(__dirname, 'apks.json');

let db = { apks: {}, categories: ['Games', 'Tools', 'Social', 'MOD', 'Other'] };
if (fs.existsSync(DB)) { try { db = JSON.parse(fs.readFileSync(DB, 'utf8')); } catch {} }
function save() { fs.writeFileSync(DB, JSON.stringify(db, null, 2)); }

bot.onText(/\\/start/, m => {
  bot.sendMessage(m.chat.id, '📱 *APK Store*\\n\\nSearch: /search <name>\\nBrowse: /browse\\nCategories: /cats\\n\\<a href='https://t.me/NEX_TECH_HOSTING_ROBOT'>~Nᴇx Tᴇᴄʜ Pʀᴇᴍɪᴜᴍ Hᴏsᴛɪɴɢ Rᴏʙᴏᴛ</a>', { parse_mode: 'HTML' });
});

bot.onText(/\\/cats/, m => {
  const kb = db.categories.map(c => [{ text: '📁 ' + c, callback_data: 'apk:cat:' + c }]);
  bot.sendMessage(m.chat.id, '📂 Categories:', { reply_markup: { inline_keyboard: kb } });
});

bot.onText(/\\/search (.+)/, m => {
  const q = m[1].toLowerCase();
  const hits = Object.entries(db.apks).filter(([k, v]) => v.name.toLowerCase().includes(q) || k.includes(q)).slice(0, 10);
  if (!hits.length) return bot.sendMessage(m.chat.id, '❌ No results');
  const kb = hits.map(([id, a]) => [{ text: '📱 ' + a.name + ' v' + a.version, callback_data: 'apk:get:' + id }]);
  bot.sendMessage(m.chat.id, '🔍 Results:', { reply_markup: { inline_keyboard: kb } });
});

bot.onText(/\\/browse/, m => {
  const all = Object.entries(db.apks).slice(0, 20);
  if (!all.length) return bot.sendMessage(m.chat.id, '📭 No APKs yet');
  const kb = all.map(([id, a]) => [{ text: '📱 ' + a.name, callback_data: 'apk:get:' + id }]);
  bot.sendMessage(m.chat.id, '📋 All APKs:', { reply_markup: { inline_keyboard: kb } });
});

bot.on('callback_query', async q => {
  if (q.data.startsWith('apk:cat:')) {
    const cat = q.data.split(':')[2];
    const items = Object.entries(db.apks).filter(([k, a]) => a.category === cat).slice(0, 15);
    if (!items.length) return bot.answerCallbackQuery(q.id, { text: 'Empty category' });
    const kb = items.map(([id, a]) => [{ text: '📱 ' + a.name, callback_data: 'apk:get:' + id }]);
    bot.sendMessage(q.from.id, '📂 ' + cat + ':', { reply_markup: { inline_keyboard: kb } });
    bot.answerCallbackQuery(q.id);
  }
  if (q.data.startsWith('apk:get:')) {
    const a = db.apks[q.data.split(':')[2]];
    if (!a) return bot.answerCallbackQuery(q.id, { text: 'Not found' });
    bot.answerCallbackQuery(q.id);
    bot.sendMessage(q.from.id, '📱 *' + a.name + '*\\n📦 Version: ' + a.version + '\\n📏 Size: ' + (a.size/1048576).toFixed(1) + ' MB\\n📂 ' + a.category + '\\n📝 ' + (a.desc || '—'), {
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: [[{ text: '⬇️ Download', callback_data: 'apk:dl:' + Object.keys(db.apks).find(k => db.apks[k] === a) }]] }
    });
  }
  if (q.data.startsWith('apk:dl:')) {
    const id = q.data.split(':')[2], a = db.apks[id];
    if (!a) return bot.answerCallbackQuery(q.id, { text: 'Not found' });
    bot.answerCallbackQuery(q.id);
    bot.sendDocument(q.from.id, a.file_id, { caption: '📱 ' + a.name + ' v' + a.version }).catch(e => bot.sendMessage(q.from.id, '❌ ' + e.message));
  }
});

bot.on('document', async m => {
  if (String(m.from.id) !== String(ADMIN)) return;
  const d = m.document;
  if (!/\\.apk$/i.test(d.file_name)) return;
  const name = d.file_name.replace(/\\.apk$/i, '');
  const id = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '_' + Date.now().toString(36);
  const cap = m.caption || '';
  const [version, category, ...desc] = cap.split('|').map(s => s.trim());
  db.apks[id] = { name, version: version || '1.0', category: category || 'Other', desc: desc.join(' | ') || '', file_id: d.file_id, size: d.file_size, added: Date.now() };
  save();
  bot.sendMessage(m.chat.id, '✅ Added: ' + name + ' v' + (version || '1.0') + ' (' + category + ')\\n\\nID: \`' + id + '\`', { parse_mode: 'Markdown' });
});

bot.on('polling_error', e => console.error(e.message));
console.log('✅ APK distributor running');`
    },


    voice_transcriber: {
        name: 'Vᴏɪᴄᴇ Tʀᴀɴsᴄʀɪʙᴇʀ (Wʜɪsᴘᴇʀ)', cat: 'AI', price: 85,
        desc: 'Tʀᴀɴsᴄʀɪʙᴇ Vᴏɪᴄᴇ Mᴇssᴀɢᴇs ᴠɪᴀ ᴏᴘᴇɴᴀɪ ᴡʜɪsᴘᴇʀ. ᴍᴜʟᴛɪ-ʟᴀɴɢᴜᴀɢᴇ, ᴀᴜᴛᴏ-ᴅᴇᴛᴇᴄᴛ, ᴛɪᴍᴇsᴛᴀᴍᴘs.',
        requires_env: 'TOKEN,OPENAI_KEY',
        code: `const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const fs = require('fs'), path = require('path'), os = require('os');
const FormData = require('form-data');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const KEY = process.env.OPENAI_KEY;
const TMP = path.join(os.tmpdir(), 'voicebot');
if (!fs.existsSync(TMP)) fs.mkdirSync(TMP, { recursive: true });

function whisper(filePath) {
  return new Promise((res, rej) => {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('model', 'whisper-1');
    const r = https.request({
      hostname: 'api.openai.com', path: '/v1/audio/transcriptions', method: 'POST',
      headers: { 'Authorization': 'Bearer ' + KEY, ...form.getHeaders() }
    }, x => { let d = ''; x.on('data', c => d += c); x.on('end', () => { try { res(JSON.parse(d)); } catch { res(d); } }); });
    r.on('error', rej); form.pipe(r);
  });
}

['voice', 'audio', 'video_note'].forEach(type => {
  bot.on(type, async m => {
    const media = m[type];
    if (!media) return;
    if (media.file_size > 25 * 1024 * 1024) return bot.sendMessage(m.chat.id, '❌ File too large (max 25MB)');
    const local = path.join(TMP, m.from.id + '_' + Date.now() + '.ogg');
    const status = await bot.sendMessage(m.chat.id, '🎙 Transcribing...');
    try {
      await bot.downloadFile(media.file_id, TMP);
      const files = fs.readdirSync(TMP).filter(f => f.includes(media.file_id));
      if (!files.length) throw new Error('Download failed');
      fs.renameSync(path.join(TMP, files[0]), local);
      const r = await whisper(local);
      const text = r.text || '⚠️ No speech detected';
      bot.editMessageText('📝 *Transcript*\\n\\n' + text, { chat_id: m.chat.id, message_id: status.message_id, parse_mode: 'Markdown' });
      fs.unlinkSync(local);
    } catch (e) {
      bot.editMessageText('❌ ' + e.message.slice(0, 200), { chat_id: m.chat.id, message_id: status.message_id });
    }
  });
});

bot.on('polling_error', e => console.error(e.message));
console.log('✅ Voice transcriber running');`
    },

    image_upscaler: {
        name: 'Image Upscaler (AI)', cat: 'AI', price: 75,
        desc: 'Upscale images 2x/4x via Replicate or DeepAI. Send a photo, pick scale, get enhanced image.',
        requires_env: 'TOKEN,REPLICATE_KEY',
        code: `const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const fs = require('fs'), path = require('path'), os = require('os');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const KEY = process.env.REPLICATE_KEY;
const TMP = path.join(os.tmpdir(), 'upscaler');
if (!fs.existsSync(TMP)) fs.mkdirSync(TMP, { recursive: true });
const pending = {};

function replicate(input) {
  return new Promise((res, rej) => {
    const body = JSON.stringify(input);
    const r = https.request({
      hostname: 'api.replicate.com', path: '/v1/predictions', method: 'POST',
      headers: { 'Authorization': 'Token ' + KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, x => { let d = ''; x.on('data', c => d += c); x.on('end', () => { try { res(JSON.parse(d)); } catch (e) { rej(e); } }); });
    r.on('error', rej); r.write(body); r.end();
  });
}

function poll(url) {
  return new Promise((res, rej) => {
    const u = new URL(url);
    const iv = setInterval(() => {
      https.get({ hostname: u.hostname, path: u.pathname, headers: { 'Authorization': 'Token ' + KEY } }, x => {
        let d = ''; x.on('data', c => d += c);
        x.on('end', () => {
          try {
            const j = JSON.parse(d);
            if (j.status === 'succeeded') { clearInterval(iv); res(j.output); }
            if (j.status === 'failed') { clearInterval(iv); rej(new Error('Job failed')); }
          } catch {}
        });
      });
    }, 2000);
    setTimeout(() => { clearInterval(iv); rej(new Error('Timeout')); }, 180000);
  });
}

function uploadToImgBB(filepath) {
  // Fallback: use Replicate's hosted output URL directly
  return filepath;
}

bot.on('photo', async m => {
  const p = m.photo[m.photo.length - 1];
  pending[m.from.id] = p.file_id;
  bot.sendMessage(m.chat.id, '🖼 Choose scale:', {
    reply_markup: { inline_keyboard: [
      [{ text: '2x', callback_data: 'up:2' }, { text: '4x', callback_data: 'up:4' }]
    ]}
  });
});

bot.on('callback_query', async q => {
  if (!q.data.startsWith('up:')) return;
  const scale = parseInt(q.data.split(':')[1]);
  const fileId = pending[q.from.id];
  if (!fileId) return bot.answerCallbackQuery(q.id, { text: 'Send a photo first' });
  const status = await bot.sendMessage(q.from.id, '⏳ Upscaling ' + scale + 'x...');
  bot.answerCallbackQuery(q.id);
  try {
    // Get file path from Telegram
    const fileLink = await bot.getFileLink(fileId);
    // Use Replicate's real-esrgan model
    const pred = await replicate({
      version: 'f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa',
      input: { image: fileLink, scale, face_enhance: false }
    });
    const output = await poll(pred.urls.get);
    const outUrl = Array.isArray(output) ? output[0] : output;
    bot.editMessageText('✅ *Done!*', { chat_id: q.from.id, message_id: status.message_id, parse_mode: 'Markdown' });
    bot.sendPhoto(q.from.id, outUrl, { caption: '🔍 ' + scale + 'x upscaled' });
    delete pending[q.from.id];
  } catch (e) { bot.editMessageText('❌ ' + e.message.slice(0, 200), { chat_id: q.from.id, message_id: status.message_id }); }
});

bot.on('polling_error', e => console.error(e.message));
console.log('✅ Image upscaler running');`
    },

    tiktok_dl: {
        name: 'TikTok / Reels Downloader', cat: 'Downloader', price: 90,
        desc: 'Download TikTok, IG Reels, YT Shorts without watermark. Uses public APIs + yt-dlp fallback.',
        requires_env: 'TOKEN',
        code: `const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const { execFile } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const TMP = path.join(os.tmpdir(), 'shorts');
if (!fs.existsSync(TMP)) fs.mkdirSync(TMP, { recursive: true });

function run(cmd, args) {
  return new Promise((res, rej) => execFile(cmd, args, { maxBuffer: 1024 * 1024 * 50, timeout: 120000 }, (e, out, err) => e ? rej(new Error(err)) : res(out)));
}

async function downloadViaYtdlp(url, uid) {
  const tpl = path.join(TMP, uid + '_%(id)s.%(ext)s');
  await run('yt-dlp', ['-o', tpl, '--no-playlist', '--print', 'after_move:filepath', url]);
  const files = fs.readdirSync(TMP).filter(f => f.startsWith(uid + '_')).map(f => path.join(TMP, f));
  return files.sort((a, b) => fs.statSync(b).mtime - fs.statSync(a).mtime)[0];
}

bot.onText(/\\/(tt|tiktok|reel|reels|shorts) (https?:\\/\\/\\S+)/, async (m, match) => {
  const url = match[2];
  const uid = m.from.id;
  const status = await bot.sendMessage(m.chat.id, '⬇️ Downloading...');
  try {
    const file = await downloadViaYtdlp(url, uid);
    if (!file) throw new Error('Download failed');
    const size = fs.statSync(file).size;
    if (size > 50 * 1024 * 1024) { fs.unlinkSync(file); throw new Error('File >50MB'); }
    await bot.sendVideo(m.chat.id, file, { caption: '📹 Downloaded', supports_streaming: true });
    fs.unlinkSync(file);
    bot.editMessageText('✅ Sent!', { chat_id: m.chat.id, message_id: status.message_id });
  } catch (e) { bot.editMessageText('❌ ' + e.message.slice(0, 200), { chat_id: m.chat.id, message_id: status.message_id }); }
});

bot.on('polling_error', e => console.error(e.message));
console.log('✅ TikTok/Reels downloader running');`
    },

    temp_email: {
        name: 'Temp Email Bot', cat: 'Utility', price: 65,
        desc: 'Generate disposable emails via mail.tm. Receive inbox in real-time, auto-refresh, extension support.',
        requires_env: 'TOKEN',
        code: `const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const fs = require('fs'), path = require('path');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const DB = path.join(__dirname, 'tempmail.json');

let db = { users: {} };
if (fs.existsSync(DB)) { try { db = JSON.parse(fs.readFileSync(DB, 'utf8')); } catch {} }
function save() { fs.writeFileSync(DB, JSON.stringify(db, null, 2)); }

function api(method, endpoint, body, token) {
  return new Promise((res, rej) => {
    const data = body ? JSON.stringify(body) : null;
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = 'Bearer ' + token;
    if (data) headers['Content-Length'] = Buffer.byteLength(data);
    const r = https.request({ hostname: 'api.mail.tm', path: endpoint, method, headers }, x => {
      let d = ''; x.on('data', c => d += c);
      x.on('end', () => { try { res({ s: x.statusCode, b: JSON.parse(d) }); } catch { res({ s: x.statusCode, b: d }); } });
    });
    r.on('error', rej); if (data) r.write(data); r.end();
  });
}

bot.onText(/\\/newmail/, async m => {
  const uid = m.from.id;
  const status = await bot.sendMessage(m.chat.id, '📧 Creating temp email...');
  try {
    const doms = await api('GET', '/domains?page=1');
    const domain = doms.b['hydra:member']?.[0]?.domain;
    if (!domain) throw new Error('No domain available');
    const local = 'tg' + uid + Date.now().toString(36);
    const email = local + '@' + domain;
    const pass = Math.random().toString(36).slice(2, 14);
    const acc = await api('POST', '/accounts', { address: email, password: pass });
    if (acc.s >= 400) throw new Error('Account failed: ' + JSON.stringify(acc.b).slice(0, 150));
    const tok = await api('POST', '/token', { address: email, password: pass });
    if (tok.s >= 400) throw new Error('Token failed');
    db.users[uid] = { email, pass, token: tok.b.token, id: acc.b.id };
    save();
    bot.editMessageText('📧 *Your Temp Email*\\n\\n\`' + email + '\`\\n\\nUse /inbox to check messages.\\n\\<a href='https://t.me/NEX_TECH_HOSTING_ROBOT'>~Nᴇx Tᴇᴄʜ Pʀᴇᴍɪᴜᴍ Hᴏsᴛɪɴɢ Rᴏʙᴏᴛ</a>', { chat_id: m.chat.id, message_id: status.message_id, parse_mode: 'HTML' });
  } catch (e) { bot.editMessageText('❌ ' + e.message.slice(0, 250), { chat_id: m.chat.id, message_id: status.message_id }); }
});

bot.onText(/\\/inbox/, async m => {
  const uid = m.from.id, u = db.users[uid];
  if (!u) return bot.sendMessage(m.chat.id, '❌ Use /newmail first');
  try {
    const r = await api('GET', '/messages?page=1', null, u.token);
    const msgs = r.b['hydra:member'] || [];
    if (!msgs.length) return bot.sendMessage(m.chat.id, '📭 Inbox empty');
    const kb = msgs.slice(0, 10).map(msg => [{ text: '📩 ' + (msg.from?.address || 'unknown') + ' — ' + (msg.subject || '(no subject)').slice(0, 30), callback_data: 'mail:' + msg.id }]);
    bot.sendMessage(m.chat.id, '📬 *' + msgs.length + ' messages*', { parse_mode: 'Markdown', reply_markup: { inline_keyboard: kb } });
  } catch (e) { bot.sendMessage(m.chat.id, '❌ ' + e.message); }
});

bot.on('callback_query', async q => {
  if (!q.data.startsWith('mail:')) return;
  const u = db.users[q.from.id];
  if (!u) return;
  try {
    const r = await api('GET', '/messages/' + q.data.split(':')[1], null, u.token);
    const body = r.b.text || r.b.html?.join('') || '(empty)';
    bot.sendMessage(q.from.id, '📩 *' + (r.b.subject || '(no subject)') + '*\\n\\nFrom: ' + (r.b.from?.address || '?') + '\\n\\n' + body.slice(0, 3500), { parse_mode: 'Markdown' });
    bot.answerCallbackQuery(q.id);
  } catch { bot.answerCallbackQuery(q.id, { text: 'Failed' }); }
});

bot.onText(/\\/delmail/, m => {
  delete db.users[m.from.id]; save();
  bot.sendMessage(m.chat.id, '🗑 Temp email deleted');
});

bot.on('polling_error', e => console.error(e.message));
console.log('✅ Temp email running');`
    },

    // ═══════════════════════════════════════════════════════════
    // 12. 📲 SMS BOMBER (Educational)
    // ═══════════════════════════════════════════════════════════
    sms_bomber: {
        name: 'SMS API Gateway', cat: 'Utility', price: 70,
        desc: 'Send SMS via Twilio / Vonage API. Template support, sender ID, batch sends, delivery status. Use responsibly.',
        requires_env: 'TOKEN,TWILIO_SID,TWILIO_TOKEN,TWILIO_FROM',
        code: `const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const SID = process.env.TWILIO_SID, TOKEN = process.env.TWILIO_TOKEN, FROM = process.env.TWILIO_FROM;

function twilio(to, body) {
  return new Promise((res, rej) => {
    const auth = Buffer.from(SID + ':' + TOKEN).toString('base64');
    const data = new URLSearchParams({ To: to, From: FROM, Body: body }).toString();
    const r = https.request({
      hostname: 'api.twilio.com', path: '/2010-04-01/Accounts/' + SID + '/Messages.json', method: 'POST',
      headers: { 'Authorization': 'Basic ' + auth, 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(data) }
    }, x => { let d = ''; x.on('data', c => d += c); x.on('end', () => { try { res(JSON.parse(d)); } catch { res(d); } }); });
    r.on('error', rej); r.write(data); r.end();
  });
}

bot.onText(/\\/sms (\\+?\\d+) ([\\s\\S]+)/, async (m, match) => {
  const [, to, body] = match;
  if (body.length > 160) return bot.sendMessage(m.chat.id, '❌ Max 160 chars');
  const status = await bot.sendMessage(m.chat.id, '📤 Sending...');
  try {
    const r = await twilio(to, body);
    bot.editMessageText(r.sid ? '✅ Sent!\\nSID: \`' + r.sid + '\`' : '❌ ' + (r.message || JSON.stringify(r).slice(0, 200)), { chat_id: m.chat.id, message_id: status.message_id, parse_mode: 'Markdown' });
  } catch (e) { bot.editMessageText('❌ ' + e.message, { chat_id: m.chat.id, message_id: status.message_id }); }
});

bot.onText(/\\/templatesms (\\+?\\d+) (\\w+)/, async (m, match) => {
  const templates = { welcome: 'Welcome to our service!', otp: 'Your OTP: 123456', verify: 'Please verify: https://ex.com' };
  const body = templates[match[2]];
  if (!body) return bot.sendMessage(m.chat.id, '❌ Templates: ' + Object.keys(templates).join(', '));
  const r = await twilio(match[1], body);
  bot.sendMessage(m.chat.id, r.sid ? '✅ Sent' : '❌ Failed');
});

bot.on('polling_error', e => console.error(e.message));
console.log('✅ SMS gateway running');`
    },

    ai_image_gen: {
        name: 'AI Image Generator', cat: 'AI', price: 80,
        desc: 'Generate images via DALL-E 3 or Flux (Replicate). Prompt history, aspect ratio picker, upscale.',
        requires_env: 'TOKEN,OPENAI_KEY',
        code: `const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const KEY = process.env.OPENAI_KEY;

function generate(prompt, size) {
  return new Promise((res, rej) => {
    const body = JSON.stringify({ model: 'dall-e-3', prompt, n: 1, size, response_format: 'url' });
    const r = https.request({
      hostname: 'api.openai.com', path: '/v1/images/generations', method: 'POST',
      headers: { 'Authorization': 'Bearer ' + KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, x => { let d = ''; x.on('data', c => d += c); x.on('end', () => { try { res(JSON.parse(d)); } catch (e) { rej(e); } }); });
    r.on('error', rej); r.write(body); r.end();
  });
}

bot.onText(/\\/img (.+)/, async (m, match) => {
  const prompt = match[1];
  const status = await bot.sendMessage(m.chat.id, '🎨 Generating...\\n\\n*' + prompt.slice(0, 200) + '*', { parse_mode: 'Markdown', reply_markup: { inline_keyboard: [
    [{ text: '1:1', callback_data: 'gen:' + Date.now() + ':1024x1024' }],
    [{ text: '16:9', callback_data: 'gen:' + Date.now() + ':1792x1024' }],
    [{ text: '9:16', callback_data: 'gen:' + Date.now() + ':1024x1792' }]
  ]}});
  // Auto-generate at default size
  try {
    const r = await generate(prompt, '1024x1024');
    const url = r.data?.[0]?.url;
    if (!url) throw new Error(r.error?.message || 'No image');
    bot.editMessageText('🎨 *' + prompt.slice(0, 200) + '*', { chat_id: m.chat.id, message_id: status.message_id, parse_mode: 'Markdown' });
    bot.sendPhoto(m.chat.id, url, { caption: '✅ DALL-E 3' });
  } catch (e) { bot.editMessageText('❌ ' + e.message.slice(0, 250), { chat_id: m.chat.id, message_id: status.message_id }); }
});

bot.on('polling_error', e => console.error(e.message));
console.log('✅ AI image gen running');`
    },

  
    tts_bot: {
        name: 'Text-to-Speech Bot', cat: 'AI', price: 70,
        desc: 'Convert text to voice via OpenAI TTS. Multiple voices (alloy/echo/fable/onyx/nova/shimmer). Auto-split long text.',
        requires_env: 'TOKEN,OPENAI_KEY',
        code: `const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const fs = require('fs'), path = require('path'), os = require('os');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const KEY = process.env.OPENAI_KEY;
const TMP = path.join(os.tmpdir(), 'ttsbot');
if (!fs.existsSync(TMP)) fs.mkdirSync(TMP, { recursive: true });

const VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
const userVoice = {};

function tts(text, voice, outPath) {
  return new Promise((res, rej) => {
    const body = JSON.stringify({ model: 'tts-1', input: text, voice, response_format: 'opus' });
    const r = https.request({
      hostname: 'api.openai.com', path: '/v1/audio/speech', method: 'POST',
      headers: { 'Authorization': 'Bearer ' + KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, x => {
      if (x.statusCode >= 400) { let d = ''; x.on('data', c => d += c); x.on('end', () => rej(new Error(d.slice(0, 200)))); return; }
      const ws = fs.createWriteStream(outPath);
      x.pipe(ws); ws.on('finish', () => res(outPath)); ws.on('error', rej);
    });
    r.on('error', rej); r.write(body); r.end();
  });
}

bot.onText(/\\/voice (\\w+)/, (m, match) => {
  const v = match[1].toLowerCase();
  if (!VOICES.includes(v)) return bot.sendMessage(m.chat.id, '❌ Voices: ' + VOICES.join(', '));
  userVoice[m.from.id] = v;
  bot.sendMessage(m.chat.id, '✅ Voice set: *' + v + '*', { parse_mode: 'Markdown' });
});

bot.onText(/\\/speak ([\\s\\S]+)/, async (m, match) => {
  const voice = userVoice[m.from.id] || 'alloy';
  const text = match[1].slice(0, 4000);
  const outPath = path.join(TMP, m.from.id + '_' + Date.now() + '.ogg');
  const status = await bot.sendMessage(m.chat.id, '🎙 Generating (' + voice + ')...');
  try {
    await tts(text, voice, outPath);
    await bot.sendVoice(m.chat.id, outPath);
    fs.unlinkSync(outPath);
    bot.deleteMessage(m.chat.id, status.message_id).catch(()=>{});
  } catch (e) { bot.editMessageText('❌ ' + e.message.slice(0, 200), { chat_id: m.chat.id, message_id: status.message_id }); }
});

bot.on('polling_error', e => console.error(e.message));
console.log('✅ TTS running');`
    },

    password_vault: {
        name: 'Password Vault (2FA)', cat: 'Utility', price: 60,
        desc: 'Encrypted vault: store passwords, TOTP 2FA codes via /totp. AES-256-GCM encryption.',
        requires_env: 'TOKEN,VAULT_KEY',
        code: `const TelegramBot = require('node-telegram-bot-api');
const crypto = require('crypto');
const fs = require('fs'), path = require('path');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const KEY = crypto.scryptSync(process.env.VAULT_KEY, 'salt', 32);
const DB = path.join(__dirname, 'vault.json');

let db = {};
if (fs.existsSync(DB)) { try { db = JSON.parse(fs.readFileSync(DB, 'utf8')); } catch {} }
function save() { fs.writeFileSync(DB, JSON.stringify(db, null, 2)); }

function encrypt(text) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', KEY, iv);
  const enc = Buffer.concat([c.update(text, 'utf8'), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), enc]).toString('base64');
}
function decrypt(b64) {
  const buf = Buffer.from(b64, 'base64');
  const iv = buf.slice(0, 12), tag = buf.slice(12, 28), enc = buf.slice(28);
  const d = crypto.createDecipheriv('aes-256-gcm', KEY, iv);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(enc), d.final()]).toString('utf8');
}

// TOTP (RFC 6238)
function totp(secret) {
  const b32 = secret.replace(/\\s/g, '').toUpperCase();
  const buf = Buffer.from(b32.replace(/=+$/, '').replace(/0/g, 'O').replace(/1/g, 'I').replace(/8/g, 'B'), 'base64');
  const counter = Math.floor(Date.now() / 30000);
  const cb = Buffer.alloc(8); cb.writeBigUInt64BE(BigInt(counter));
  const h = crypto.createHmac('sha1', buf).update(cb).digest();
  const off = h[h.length - 1] & 0xf;
  const code = ((h[off] & 0x7f) << 24 | h[off+1] << 16 | h[off+2] << 8 | h[off+3]) % 1000000;
  return String(code).padStart(6, '0');
}

function user(id) { if (!db[id]) db[id] = {}; return db[id]; }

bot.onText(/\\/add (\\S+) (\\S+)/, (m, match) => {
  user(m.from.id)[match[1].toLowerCase()] = encrypt(match[2]);
  save();
  bot.sendMessage(m.chat.id, '🔐 Stored \`' + match[1] + '\`', { parse_mode: 'Markdown' });
});

bot.onText(/\\/get (\\S+)/, m => {
  const enc = user(m.from.id)[m[1].toLowerCase()];
  if (!enc) return bot.sendMessage(m.chat.id, '❌ Not found');
  try { bot.sendMessage(m.chat.id, '🔓 \`' + decrypt(enc) + '\`', { parse_mode: 'Markdown' }); }
  catch { bot.sendMessage(m.chat.id, '❌ Decrypt failed'); }
});

bot.onText(/\\/del (\\S+)/, m => {
  delete user(m.from.id)[m[1].toLowerCase()]; save();
  bot.sendMessage(m.chat.id, '🗑 Deleted');
});

bot.onText(/\\/keys/, m => {
  const keys = Object.keys(user(m.from.id));
  bot.sendMessage(m.chat.id, keys.length ? '🔑 *Keys*\\n' + keys.map(k => '• ' + k).join('\\n') : '📭 Empty', { parse_mode: 'Markdown' });
});

bot.onText(/\\/totp (\\S+)/, m => {
  try {
    const enc = user(m.from.id)[m[1].toLowerCase()];
    const secret = enc ? decrypt(enc) : m[1];
    bot.sendMessage(m.chat.id, '🔐 \`' + totp(secret) + '\` (30s)', { parse_mode: 'Markdown' });
  } catch { bot.sendMessage(m.chat.id, '❌ Invalid secret'); }
});

bot.on('polling_error', e => console.error(e.message));
console.log('✅ Password vault running');`
    },

    screenshot_bot: {
        name: 'Website Screenshot Bot', cat: 'Tools', price: 45,
        desc: 'Full-page screenshots of any URL via screenshotone/thum.io. Device presets (mobile/tablet/desktop).',
        requires_env: 'TOKEN',
        code: `const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });

const DEVICES = {
  desktop: { w: 1920, h: 1080, mobile: 0 },
  tablet:  { w: 768, h: 1024, mobile: 1 },
  mobile:  { w: 375, h: 812, mobile: 1 }
};

bot.onText(/\\/ss (https?:\\/\\/\\S+)/, async (m, match) => {
  const url = match[1];
  const kb = Object.entries(DEVICES).map(([k, v]) => [{ text: '📱 ' + k, callback_data: 'ss:' + k + ':' + Buffer.from(url).toString('base64') }]);
  bot.sendMessage(m.chat.id, '📸 Pick device:', { reply_markup: { inline_keyboard: kb } });
});

bot.on('callback_query', async q => {
  if (!q.data.startsWith('ss:')) return;
  const [, device, b64url] = q.data.split(':');
  const url = Buffer.from(b64url, 'base64').toString();
  const d = DEVICES[device];
  bot.answerCallbackQuery(q.id, { text: 'Capturing...' });
  const status = await bot.sendMessage(q.from.id, '📸 Capturing ' + device + '...');
  const apiUrl = 'https://api.screenshotone.com/take?access_key=demo&url=' + encodeURIComponent(url) + '&viewport_width=' + d.w + '&viewport_height=' + d.h + '&device_scale_factor=1&format=png&block_ads=true&block_cookie_banners=true&full_page=true';
  try {
    bot.editMessageText('📸 Loading...', { chat_id: q.from.id, message_id: status.message_id });
    bot.sendPhoto(q.from.id, apiUrl, { caption: '📸 ' + url + ' (' + device + ')' }).then(() => bot.deleteMessage(q.from.id, status.message_id).catch(()=>{}))
      .catch(e => bot.editMessageText('❌ ' + e.message.slice(0, 200), { chat_id: q.from.id, message_id: status.message_id }));
  } catch (e) { bot.editMessageText('❌ ' + e.message, { chat_id: q.from.id, message_id: status.message_id }); }
});

bot.on('polling_error', e => console.error(e.message));
console.log('✅ Screenshot bot running');`
    },

    crypto_wallet_tracker: {
        name: 'Crypto Wallet Tracker', cat: 'Crypto', price: 70,
        desc: 'Track BTC/ETH/LTC wallet balances + transactions. Watch-only, no private keys. Uses blockchain.info + etherscan.',
        requires_env: 'TOKEN,ETHERSCAN_KEY',
        code: `const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const fs = require('fs'), path = require('path');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const ES_KEY = process.env.ETHERSCAN_KEY;
const DB = path.join(__dirname, 'wallets.json');

let db = { users: {} };
if (fs.existsSync(DB)) { try { db = JSON.parse(fs.readFileSync(DB, 'utf8')); } catch {} }
function save() { fs.writeFileSync(DB, JSON.stringify(db, null, 2)); }

function get(url) {
  return new Promise((res, rej) => {
    https.get(url, r => { let d = ''; r.on('data', c => d += c); r.on('end', () => { try { res(JSON.parse(d)); } catch (e) { rej(e); } }); }).on('error', rej);
  });
}

async function btcBalance(addr) {
  const j = await get('https://blockchain.info/q/addressbalance/' + addr + '?confirmations=1');
  return typeof j === 'number' ? j / 1e8 : null;
}
async function ethBalance(addr) {
  const j = await get('https://api.etherscan.io/api?module=account&action=balance&address=' + addr + '&tag=latest&apikey=' + ES_KEY);
  return j.status === '1' ? parseInt(j.result) / 1e18 : null;
}

function user(id) { if (!db.users[id]) db.users[id] = []; return db.users[id]; }

bot.onText(/\\/watch (btc|eth) (\\S+)/, async (m, match) => {
  const [chain, addr] = [match[1], match[2]];
  user(m.from.id).push({ chain, addr });
  save();
  bot.sendMessage(m.chat.id, '👁 Watching ' + chain.toUpperCase() + ': \`' + addr + '\`', { parse_mode: 'Markdown' });
});

bot.onText(/\\/wallets/, async m => {
  const list = user(m.from.id);
  if (!list.length) return bot.sendMessage(m.chat.id, '📭 None');
  const lines = [];
  for (const w of list) {
    try {
      const bal = w.chain === 'btc' ? await btcBalance(w.addr) : await ethBalance(w.addr);
      lines.push('• ' + w.chain.toUpperCase() + ' \`' + w.addr.slice(0, 10) + '...\` — ' + (bal?.toFixed(6) || '?'));
    } catch { lines.push('• ' + w.addr + ' — error'); }
  }
  bot.sendMessage(m.chat.id, '💰 *Wallets*\\n' + lines.join('\\n'), { parse_mode: 'Markdown' });
});

bot.onText(/\\/unwatch (\\S+)/, m => {
  const list = user(m.from.id);
  const i = list.findIndex(w => w.addr === m[1]);
  if (i < 0) return bot.sendMessage(m.chat.id, '❌ Not found');
  list.splice(i, 1); save();
  bot.sendMessage(m.chat.id, '🗑 Removed');
});

bot.on('polling_error', e => console.error(e.message));
console.log('✅ Wallet tracker running');`
    },

   
    news_bot: {
        name: 'News Aggregator', cat: 'Content', price: 60,
        desc: 'Fetch latest news by category via NewsAPI. Per-user subscriptions, scheduled digests.',
        requires_env: 'TOKEN,NEWSAPI_KEY',
        code: `const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const fs = require('fs'), path = require('path');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const KEY = process.env.NEWSAPI_KEY;
const DB = path.join(__dirname, 'news.json');

let db = { users: {} };
if (fs.existsSync(DB)) { try { db = JSON.parse(fs.readFileSync(DB, 'utf8')); } catch {} }
function save() { fs.writeFileSync(DB, JSON.stringify(db, null, 2)); }

const CATS = { general: '🌍 General', business: '💼 Business', tech: '💻 Tech', sports: '⚽ Sports', science: '🔬 Science', health: '🏥 Health', entertainment: '🎬 Entertainment' };

function fetchNews(cat, country = 'us') {
  return new Promise((res, rej) => {
    https.get('https://newsapi.org/v2/top-headlines?category=' + cat + '&country=' + country + '&pageSize=10&apiKey=' + KEY, r => {
      let d = ''; r.on('data', c => d += c);
      r.on('end', () => { try { res(JSON.parse(d)); } catch (e) { rej(e); } });
    }).on('error', rej);
  });
}

bot.onText(/\\/news/, m => {
  const kb = Object.entries(CATS).map(([k, v]) => [{ text: v, callback_data: 'news:cat:' + k }]);
  const rows = [];
  for (let i = 0; i < kb.length; i += 2) rows.push(kb.slice(i, i + 2));
  bot.sendMessage(m.chat.id, '📰 Pick category:', { reply_markup: { inline_keyboard: rows } });
});

bot.on('callback_query', async q => {
  if (!q.data.startsWith('news:cat:')) return;
  const cat = q.data.split(':')[2];
  bot.answerCallbackQuery(q.id, { text: 'Loading...' });
  try {
    const j = await fetchNews(cat);
    if (!j.articles?.length) return bot.sendMessage(q.from.id, '❌ No news');
    for (const a of j.articles.slice(0, 5)) {
      const caption = '📰 *' + (a.title || '').slice(0, 200) + '*\\n\\n' + (a.description || '').slice(0, 300);
      const kb = a.url ? { inline_keyboard: [[{ text: '🔗 Read', url: a.url }]] } : undefined;
      if (a.urlToImage) {
        try { await bot.sendPhoto(q.from.id, a.urlToImage, { caption, parse_mode: 'Markdown', reply_markup: kb }); }
        catch { await bot.sendMessage(q.from.id, caption, { parse_mode: 'Markdown', reply_markup: kb }); }
      } else await bot.sendMessage(q.from.id, caption, { parse_mode: 'Markdown', reply_markup: kb });
      await new Promise(r => setTimeout(r, 300));
    }
  } catch (e) { bot.sendMessage(q.from.id, '❌ ' + e.message); }
});

bot.onText(/\\/subscribe (\\w+)/, m => {
  const cat = m[1];
  if (!CATS[cat]) return bot.sendMessage(m.chat.id, '❌ Unknown category');
  db.users[m.from.id] = db.users[m.from.id] || {};
  db.users[m.from.id][cat] = true;
  save();
  bot.sendMessage(m.chat.id, '✅ Subscribed to ' + CATS[cat]);
});

bot.onText(/\\/unsubscribe (\\w+)/, m => {
  if (db.users[m.from.id]) delete db.users[m.from.id][m[1]];
  save();
  bot.sendMessage(m.chat.id, '🗑 Unsubscribed');
});

// Daily digest
setInterval(async () => {
  for (const [uid, cats] of Object.entries(db.users)) {
    for (const cat of Object.keys(cats)) {
      try {
        const j = await fetchNews(cat);
        if (j.articles?.[0]) bot.sendMessage(uid, '📰 *' + CATS[cat] + '*\\n\\n' + j.articles[0].title + '\\n\\n' + (j.articles[0].url || ''), { parse_mode: 'Markdown' });
      } catch {}
    }
  }
}, 6 * 60 * 60 * 1000);

bot.on('polling_error', e => console.error(e.message));
console.log('✅ News bot running');`
    },

    currency_exchange: {
        name: 'Currency Exchange Bot', cat: 'Finance', price: 40,
        desc: 'Real-time currency conversion via exchangerate.host. /fx 100 USD EUR. Historical rates.',
        requires_env: 'TOKEN',
        code: `const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });

function get(url) {
  return new Promise((res, rej) => {
    https.get(url, r => { let d = ''; r.on('data', c => d += c); r.on('end', () => { try { res(JSON.parse(d)); } catch (e) { rej(e); } }); }).on('error', rej);
  });
}

bot.onText(/\\/fx ([\\d.]+) ([A-Z]{3}) ([A-Z]{3})/, async (m, match) => {
  const [, amtStr, from, to] = match;
  const amt = parseFloat(amtStr);
  try {
    const j = await get('https://api.exchangerate.host/convert?from=' + from + '&to=' + to + '&amount=' + amt);
    if (!j.result) throw new Error('No rate');
    bot.sendMessage(m.chat.id, '💱 *' + amt + ' ' + from + '* = *' + j.result.toFixed(2) + ' ' + to + '*\\n\\nRate: 1 ' + from + ' = ' + (j.info?.rate || j.result / amt).toFixed(6) + ' ' + to, { parse_mode: 'Markdown' });
  } catch (e) { bot.sendMessage(m.chat.id, '❌ ' + e.message); }
});

bot.onText(/\\/hist (\\d{4}-\\d{2}-\\d{2}) ([A-Z]{3}) ([A-Z]{3})/, async (m, match) => {
  const [, date, from, to] = match;
  try {
    const j = await get('https://api.exchangerate.host/' + date + '?base=' + from + '&symbols=' + to);
    const rate = j.rates?.[to];
    if (!rate) throw new Error('No data');
    bot.sendMessage(m.chat.id, '📅 *' + date + '*\\n1 ' + from + ' = ' + rate + ' ' + to, { parse_mode: 'Markdown' });
  } catch (e) { bot.sendMessage(m.chat.id, '❌ ' + e.message); }
});

bot.onText(/\\/rates ([A-Z]{3})/, async (m, match) => {
  try {
    const j = await get('https://api.exchangerate.host/latest?base=' + match[1]);
    const common = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'AUD', 'CAD', 'CHF', 'CNY', 'BTC', 'ETH'];
    const lines = common.filter(c => j.rates[c]).map(c => '• 1 ' + match[1] + ' = ' + j.rates[c].toFixed(4) + ' ' + c);
    bot.sendMessage(m.chat.id, '💱 *Rates for ' + match[1] + '*\\n' + lines.join('\\n'), { parse_mode: 'Markdown' });
  } catch (e) { bot.sendMessage(m.chat.id, '❌ ' + e.message); }
});

bot.on('polling_error', e => console.error(e.message));
console.log('✅ Currency bot running');`
    },

    cron_scheduler: {
        name: 'Cron Scheduler Bot', cat: 'Utility', price: 75,
        desc: 'Schedule recurring messages/commands with cron syntax. /cron "0 9 * * *" Good morning! Persistent jobs.',
        requires_env: 'TOKEN,ADMIN_ID',
        code: `const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
const fs = require('fs'), path = require('path');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const ADMIN = process.env.ADMIN_ID;
const DB = path.join(__dirname, 'crons.json');

let db = { jobs: [] };
if (fs.existsSync(DB)) { try { db = JSON.parse(fs.readFileSync(DB, 'utf8')); } catch {} }
function save() { fs.writeFileSync(DB, JSON.stringify(db, null, 2)); }

const running = {};

function startJob(job) {
  if (running[job.id]) running[job.id].stop();
  running[job.id] = cron.schedule(job.expr, () => {
    bot.sendMessage(job.chatId, job.text).catch(e => console.error('Cron send failed:', e.message));
  }, { timezone: job.tz || 'UTC' });
}

db.jobs.forEach(startJob);

bot.onText(/\\/cron (.+?) "([^"]+)" "([^"]+)"/, (m, match) => {
  if (String(m.from.id) !== String(ADMIN)) return;
  const [, name, expr, text] = match;
  if (!cron.validate(expr)) return bot.sendMessage(m.chat.id, '❌ Invalid cron expression');
  const id = Date.now().toString(36);
  db.jobs.push({ id, name, expr, text, chatId: m.chat.id, tz: 'UTC' });
  save();
  startJob(db.jobs.find(j => j.id === id));
  bot.sendMessage(m.chat.id, '✅ Job created: ' + name + '\\n\`' + expr + '\`\\nText: ' + text, { parse_mode: 'Markdown' });
});

bot.onText(/\\/crons/, m => {
  if (String(m.from.id) !== String(ADMIN)) return;
  if (!db.jobs.length) return bot.sendMessage(m.chat.id, '📭 No jobs');
  bot.sendMessage(m.chat.id, '⏰ *Jobs*\\n' + db.jobs.map(j => '• ' + j.id + ' ' + j.name + ' \`' + j.expr + '\`').join('\\n'), { parse_mode: 'Markdown' });
});

bot.onText(/\\/delcron (\\S+)/, m => {
  if (String(m.from.id) !== String(ADMIN)) return;
  const i = db.jobs.findIndex(j => j.id === m[1]);
  if (i < 0) return bot.sendMessage(m.chat.id, '❌ Not found');
  if (running[m[1]]) running[m[1]].stop();
  delete running[m[1]];
  db.jobs.splice(i, 1); save();
  bot.sendMessage(m.chat.id, '🗑 Deleted');
});

bot.on('polling_error', e => console.error(e.message));
console.log('✅ Cron scheduler running');`
    },

   
    price_alert: {
        name: 'Price Drop Alert', cat: 'Utility', price: 70,
        desc: 'Track product URLs (Amazon/eBay/etc), get alerts on price changes. Polls every 30 min.',
        requires_env: 'TOKEN,SCRAPER_KEY',
        code: `const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const fs = require('fs'), path = require('path');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const SCRAPER = process.env.SCRAPER_KEY;
const DB = path.join(__dirname, 'prices.json');

let db = { users: {}, items: [] };
if (fs.existsSync(DB)) { try { db = JSON.parse(fs.readFileSync(DB, 'utf8')); } catch {} }
function save() { fs.writeFileSync(DB, JSON.stringify(db, null, 2)); }

function scrape(url) {
  // Use ScraperAPI or ScrapingBee — swap per your provider
  return new Promise((res, rej) => {
    const apiUrl = 'https://api.scraperapi.com?api_key=' + SCRAPER + '&url=' + encodeURIComponent(url);
    https.get(apiUrl, r => {
      let d = ''; r.on('data', c => d += c);
      r.on('end', () => {
        // Very rough price extraction — customize per site
        const m = d.match(/\\$([\\d,]+\\.\\d{2})/);
        res(m ? parseFloat(m[1].replace(/,/g, '')) : null);
      });
    }).on('error', rej);
  });
}

bot.onText(/\\/track (https?:\\/\\/\\S+)(?: ([\\d.]+))?/, async (m, match) => {
  const url = match[1], target = match[2] ? parseFloat(match[2]) : null;
  const status = await bot.sendMessage(m.chat.id, '🔍 Fetching price...');
  try {
    const price = await scrape(url);
    if (!price) throw new Error('Could not parse price');
    const id = Date.now().toString(36);
    db.items.push({ id, url, userId: m.from.id, chatId: m.chat.id, initial: price, current: price, target, lastCheck: Date.now() });
    save();
    bot.editMessageText('👁 *Tracking*\\n\\nURL: ' + url.slice(0, 60) + '...\\nCurrent: $' + price + (target ? '\\nTarget: $' + target : ''), { chat_id: m.chat.id, message_id: status.message_id, parse_mode: 'Markdown' });
  } catch (e) { bot.editMessageText('❌ ' + e.message, { chat_id: m.chat.id, message_id: status.message_id }); }
});

bot.onText(/\\/watchlist/, m => {
  const items = db.items.filter(i => i.userId === m.from.id);
  if (!items.length) return bot.sendMessage(m.chat.id, '📭 Empty');
  bot.sendMessage(m.chat.id, '👁 *Watchlist*\\n' + items.map(i => '• $' + i.current + (i.target ? ' (target $' + i.target + ')' : '') + '\\n  ' + i.url.slice(0, 60)).join('\\n'), { parse_mode: 'Markdown' });
});

bot.onText(/\\/untrack (\\S+)/, m => {
  const i = db.items.findIndex(x => x.id === m[1] && x.userId === m.from.id);
  if (i < 0) return bot.sendMessage(m.chat.id, '❌ Not found');
  db.items.splice(i, 1); save();
  bot.sendMessage(m.chat.id, '🗑 Removed');
});

setInterval(async () => {
  for (const item of db.items) {
    try {
      const price = await scrape(item.url);
      if (!price) continue;
      const diff = price - item.current;
      if (Math.abs(diff) > 0.01) {
        const arrow = diff < 0 ? '📉' : '📈';
        let msg = arrow + ' *Price change!*\\n\\n' + item.url.slice(0, 80) + '\\n\\nWas: $' + item.current + '\\nNow: $' + price;
        if (item.target && price <= item.target) msg += '\\n\\n🎯 *Target hit!*';
        bot.sendMessage(item.chatId, msg, { parse_mode: 'Markdown' }).catch(()=>{});
      }
      item.current = price;
      item.lastCheck = Date.now();
    } catch {}
  }
  save();
}, 30 * 60 * 1000);

bot.on('polling_error', e => console.error(e.message));
console.log('✅ Price alert running');`
    },

    stock_market: {
        name: 'Stock Market Bot', cat: 'Finance', price: 60,
        desc: 'Live stock quotes via Alpha Vantage. /stock AAPL. Chart + fundamentals + watchlist.',
        requires_env: 'TOKEN,ALPHAVANTAGE_KEY',
        code: `const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const fs = require('fs'), path = require('path');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const KEY = process.env.ALPHAVANTAGE_KEY;
const DB = path.join(__dirname, 'stocks.json');

let db = { users: {} };
if (fs.existsSync(DB)) { try { db = JSON.parse(fs.readFileSync(DB, 'utf8')); } catch {} }
function save() { fs.writeFileSync(DB, JSON.stringify(db, null, 2)); }

function av(params) {
  return new Promise((res, rej) => {
    const q = new URLSearchParams({ ...params, apikey: KEY }).toString();
    https.get('https://www.alphavantage.co/query?' + q, r => {
      let d = ''; r.on('data', c => d += c);
      r.on('end', () => { try { res(JSON.parse(d)); } catch (e) { rej(e); } });
    }).on('error', rej);
  });
}

bot.onText(/\\/stock (\\w+)/, async (m, match) => {
  const sym = match[1].toUpperCase();
  try {
    const j = await av({ function: 'GLOBAL_QUOTE', symbol: sym });
    const q = j['Global Quote'];
    if (!q || !q['05. price']) throw new Error('Unknown symbol');
    const change = q['09. change'];
    const pct = q['10. change percent'];
    const arrow = parseFloat(change) >= 0 ? '📈' : '📉';
    bot.sendMessage(m.chat.id, arrow + ' *' + sym + '*\\n\\n💰 $' + q['05. price'] + '\\n' + arrow + ' ' + change + ' (' + pct + ')\\n\\nOpen: $' + q['02. open'] + '\\nHigh: $' + q['03. high'] + '\\nLow: $' + q['04. low'] + '\\nVol: ' + q['06. volume'], { parse_mode: 'Markdown' });
  } catch (e) { bot.sendMessage(m.chat.id, '❌ ' + e.message); }
});

bot.onText(/\\/watchstock (\\w+)/, m => {
  db.users[m.from.id] = db.users[m.from.id] || [];
  if (!db.users[m.from.id].includes(m[1].toUpperCase())) db.users[m.from.id].push(m[1].toUpperCase());
  save();
  bot.sendMessage(m.chat.id, '✅ Watching ' + m[1].toUpperCase());
});

bot.onText(/\\/mystocks/, async m => {
  const list = db.users[m.from.id] || [];
  if (!list.length) return bot.sendMessage(m.chat.id, '📭 Empty');
  const lines = [];
  for (const sym of list) {
    try {
      const j = await av({ function: 'GLOBAL_QUOTE', symbol: sym });
      const q = j['Global Quote'];
      const arrow = parseFloat(q['09. change']) >= 0 ? '📈' : '📉';
      lines.push(arrow + ' ' + sym + ': $' + q['05. price']);
    } catch { lines.push('❌ ' + sym); }
    await new Promise(r => setTimeout(r, 12000)); // rate limit
  }
  bot.sendMessage(m.chat.id, '📊 *Watchlist*\\n' + lines.join('\\n'), { parse_mode: 'Markdown' });
});

bot.on('polling_error', e => console.error(e.message));
console.log('✅ Stock bot running');`
    },

    loan_calculator: {
        name: 'Loan / EMI Calculator', cat: 'Finance', price: 35,
        desc: 'Calculate EMI, amortization schedule, total interest. /loan 500000 8.5 60 (principal, rate%, months).',
        requires_env: 'TOKEN',
        code: `const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });

function emi(p, annualRate, months) {
  const r = annualRate / 12 / 100;
  if (r === 0) return p / months;
  return p * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
}

function fmt(n) { return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

bot.onText(/\\/loan ([\\d.]+) ([\\d.]+) (\\d+)/, async (m, match) => {
  const [, pStr, rStr, nStr] = match;
  const p = parseFloat(pStr), rate = parseFloat(rStr), months = parseInt(nStr);
  if (!p || !months) return bot.sendMessage(m.chat.id, '❌ Usage: /loan <amount> <rate%> <months>');
  const monthly = emi(p, rate, months);
  const total = monthly * months;
  const interest = total - p;

  let schedule = '\\n\\n📅 *Amortization (first 6)*\\n';
  let balance = p;
  const r = rate / 12 / 100;
  for (let i = 1; i <= Math.min(6, months); i++) {
    const intPart = balance * r;
    const prinPart = monthly - intPart;
    balance -= prinPart;
    schedule += i + '. Int: ' + fmt(intPart) + ' Prin: ' + fmt(prinPart) + '\\n';
  }

  bot.sendMessage(m.chat.id, '💰 *Loan Calculator*\\n\\n' +
    'Principal: $' + fmt(p) + '\\nRate: ' + rate + '% p.a.\\nTerm: ' + months + ' months\\n\\n' +
    '💵 *Monthly EMI:* $' + fmt(monthly) + '\\n' +
    '📊 Total Payment: $' + fmt(total) + '\\n' +
    '📈 Total Interest: $' + fmt(interest) +
    schedule, { parse_mode: 'Markdown' });
});

bot.onText(/\\/sip ([\\d.]+) ([\\d.]+) (\\d+) (\\d+)/, async (m, match) => {
  const [, amtStr, rateStr, yearsStr] = match;
  const amt = parseFloat(amtStr), rate = parseFloat(rateStr) / 100, years = parseInt(match[3]);
  const r = rate / 12;
  const n = years * 12;
  const fv = amt * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = amt * n;
  bot.sendMessage(m.chat.id, '📈 *SIP Calculator*\\n\\nMonthly: $' + fmt(amt) + '\\nRate: ' + (rate*100).toFixed(1) + '%\\nYears: ' + years + '\\n\\n💵 Invested: $' + fmt(invested) + '\\n💰 Future Value: $' + fmt(fv) + '\\n📊 Gains: $' + fmt(fv - invested), { parse_mode: 'Markdown' });
});

bot.on('polling_error', e => console.error(e.message));
console.log('✅ Loan calculator running');`
    },

    book_library: {
        name: 'Book Library Bot', cat: 'Content', price: 85,
        desc: 'Digital library: browse by category, search, download books. Admin uploads PDF/EPUB.',
        requires_env: 'TOKEN,STORAGE_CHANNEL,ADMIN_ID',
        code: `const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs'), path = require('path');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const CHAN = process.env.STORAGE_CHANNEL, ADMIN = process.env.ADMIN_ID;
const DB = path.join(__dirname, 'books.json');

let db = { books: {}, categories: ['Fiction', 'Non-fiction', 'Tech', 'Self-help', 'Business', 'Other'] };
if (fs.existsSync(DB)) { try { db = JSON.parse(fs.readFileSync(DB, 'utf8')); } catch {} }
function save() { fs.writeFileSync(DB, JSON.stringify(db, null, 2)); }

bot.onText(/\\/start/, m => {
  bot.sendMessage(m.chat.id, '📚 *Book Library*\\n\\n/search <title>\\n/browse — see all\\n/cats — categories\\n\\<a href='https://t.me/NEX_TECH_HOSTING_ROBOT'>~Nᴇx Tᴇᴄʜ Pʀᴇᴍɪᴜᴍ Hᴏsᴛɪɴɢ Rᴏʙᴏᴛ</a>', { parse_mode: 'HTML' });
});

bot.onText(/\\/cats/, m => {
  const kb = db.categories.map(c => [{ text: '📚 ' + c, callback_data: 'bk:cat:' + c }]);
  bot.sendMessage(m.chat.id, '📂 Categories:', { reply_markup: { inline_keyboard: kb } });
});

bot.onText(/\\/search (.+)/, m => {
  const q = m[1].toLowerCase();
  const hits = Object.entries(db.books).filter(([k, v]) => v.title.toLowerCase().includes(q) || v.author?.toLowerCase().includes(q)).slice(0, 10);
  if (!hits.length) return bot.sendMessage(m.chat.id, '❌ No results');
  const kb = hits.map(([id, b]) => [{ text: '📖 ' + b.title + ' — ' + (b.author || 'unknown'), callback_data: 'bk:get:' + id }]);
  bot.sendMessage(m.chat.id, '🔍 Results:', { reply_markup: { inline_keyboard: kb } });
});

bot.onText(/\\/browse/, m => {
  const all = Object.entries(db.books).slice(0, 20);
  if (!all.length) return bot.sendMessage(m.chat.id, '📭 Empty library');
  const kb = all.map(([id, b]) => [{ text: '📖 ' + b.title, callback_data: 'bk:get:' + id }]);
  bot.sendMessage(m.chat.id, '📚 All books:', { reply_markup: { inline_keyboard: kb } });
});

bot.on('callback_query', async q => {
  if (q.data.startsWith('bk:cat:')) {
    const cat = q.data.split(':')[2];
    const items = Object.entries(db.books).filter(([k, b]) => b.category === cat).slice(0, 15);
    if (!items.length) return bot.answerCallbackQuery(q.id, { text: 'Empty' });
    const kb = items.map(([id, b]) => [{ text: '📖 ' + b.title, callback_data: 'bk:get:' + id }]);
    bot.sendMessage(q.from.id, '📂 ' + cat + ':', { reply_markup: { inline_keyboard: kb } });
    bot.answerCallbackQuery(q.id);
  }
  if (q.data.startsWith('bk:get:')) {
    const b = db.books[q.data.split(':')[2]];
    if (!b) return bot.answerCallbackQuery(q.id, { text: 'Not found' });
    bot.answerCallbackQuery(q.id);
    bot.sendDocument(q.from.id, b.file_id, { caption: '📖 *' + b.title + '*\\n👤 ' + (b.author || 'unknown') + '\\n📂 ' + b.category, parse_mode: 'Markdown' }).catch(e => bot.sendMessage(q.from.id, '❌ ' + e.message));
  }
});

bot.on('document', async m => {
  if (String(m.from.id) !== String(ADMIN)) return;
  const d = m.document;
  if (!/\\.(pdf|epub|mobi)$/i.test(d.file_name)) return;
  const cap = (m.caption || '').split('|').map(s => s.trim());
  const [title, author, category] = cap;
  const id = d.file_name.toLowerCase().replace(/[^a-z0-9]/g, '') + '_' + Date.now().toString(36);
  db.books[id] = { title: title || d.file_name, author: author || 'Unknown', category: category || 'Other', file_id: d.file_id, size: d.file_size, added: Date.now() };
  save();
  bot.sendMessage(m.chat.id, '✅ Added: ' + db.books[id].title + '\\n\\nID: \`' + id + '\`', { parse_mode: 'Markdown' });
});

bot.on('polling_error', e => console.error(e.message));
console.log('✅ Book library running');`
    },

    course_seller: {
        name: 'Course Seller Bot', cat: 'Business', price: 110,
        desc: 'Sell online courses. Purchase flow, content delivery, progress tracking, admin upload, refunds.',
        requires_env: 'TOKEN,ADMIN_ID',
        code: `const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs'), path = require('path');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const ADMIN = process.env.ADMIN_ID;
const DB = path.join(__dirname, 'courses.json');

let db = { users: {}, courses: {}, purchases: [] };
if (fs.existsSync(DB)) { try { db = JSON.parse(fs.readFileSync(DB, 'utf8')); } catch {} }
function save() { fs.writeFileSync(DB, JSON.stringify(db, null, 2)); }
function user(id) { if (!db.users[id]) db.users[id] = { balance: 0, courses: [] }; return db.users[id]; }

bot.onText(/\\/start/, m => {
  user(m.from.id);
  bot.sendMessage(m.chat.id, '🎓 *Course Platform*\\n\\n/courses — browse\\n/mycourses — purchased\\n/balance\\n\\<a href='https://t.me/NEX_TECH_HOSTING_ROBOT'>~Nᴇx Tᴇᴄʜ Pʀᴇᴍɪᴜᴍ Hᴏsᴛɪɴɢ Rᴏʙᴏᴛ</a>', { parse_mode: 'HTML' });
});

bot.onText(/\\/courses/, m => {
  const list = Object.entries(db.courses);
  if (!list.length) return bot.sendMessage(m.chat.id, '📭 No courses yet');
  const kb = list.map(([id, c]) => [{ text: '📚 ' + c.title + ' — $' + c.price, callback_data: 'co:view:' + id }]);
  bot.sendMessage(m.chat.id, '🎓 *Courses*', { parse_mode: 'Markdown', reply_markup: { inline_keyboard: kb } });
});

bot.on('callback_query', async q => {
  const uid = q.from.id, u = user(uid);
  if (q.data.startsWith('co:view:')) {
    const c = db.courses[q.data.split(':')[2]];
    if (!c) return bot.answerCallbackQuery(q.id, { text: 'Not found' });
    const owned = u.courses.includes(q.data.split(':')[2]);
    bot.sendMessage(uid, '📚 *' + c.title + '*\\n\\n' + (c.desc || '') + '\\n\\n💰 $' + c.price + '\\n👤 ' + (c.author || 'Unknown') + '\\n📖 ' + (c.lessons?.length || 0) + ' lessons', {
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: owned ? [[{ text: '▶️ Start', callback_data: 'co:learn:' + q.data.split(':')[2] }]] : [[{ text: '🛒 Buy — $' + c.price, callback_data: 'co:buy:' + q.data.split(':')[2] }]] }
    });
    bot.answerCallbackQuery(q.id);
  }
  if (q.data.startsWith('co:buy:')) {
    const id = q.data.split(':')[2], c = db.courses[id];
    if (u.balance < c.price) return bot.answerCallbackQuery(q.id, { text: '❌ Need $' + c.price, show_alert: true });
    u.balance -= c.price;
    u.courses.push(id);
    db.purchases.push({ userId: uid, courseId: id, price: c.price, at: Date.now() });
    save();
    bot.sendMessage(uid, '✅ *Purchased!*\\n\\n📚 ' + c.title, { parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '▶️ Start', callback_data: 'co:learn:' + id }]] } });
    bot.sendMessage(ADMIN, '💰 New sale: $' + c.price + ' — ' + c.title + ' by user ' + uid).catch(()=>{});
    bot.answerCallbackQuery(q.id, { text: '✅ Purchased' });
  }
  if (q.data.startsWith('co:learn:')) {
    const id = q.data.split(':')[2], c = db.courses[id];
    if (!u.courses.includes(id)) return bot.answerCallbackQuery(q.id, { text: 'Not owned', show_alert: true });
    if (!c.lessons?.length) return bot.sendMessage(uid, '📖 No lessons yet');
    bot.sendMessage(uid, '📖 *' + c.title + '*\\n\\nLessons:\\n' + c.lessons.map((l, i) => (i+1) + '. ' + l.title).join('\\n'), { parse_mode: 'Markdown', reply_markup: { inline_keyboard: c.lessons.map((l, i) => [{ text: (i+1) + '. ' + l.title, callback_data: 'co:lesson:' + id + ':' + i }]) } });
    bot.answerCallbackQuery(q.id);
  }
  if (q.data.startsWith('co:lesson:')) {
    const [, , id, idx] = q.data.split(':');
    const c = db.courses[id], l = c.lessons[idx];
    if (l.file_id) bot.sendDocument(uid, l.file_id, { caption: l.title }).catch(()=>{});
    else bot.sendMessage(uid, '📖 *' + l.title + '*\\n\\n' + (l.content || ''));
    bot.answerCallbackQuery(q.id);
  }
});

bot.onText(/\\/addcourse (.+)/, (m, match) => {
  if (String(m.from.id) !== String(ADMIN)) return;
  const [title, priceStr, desc, author] = match[1].split('|').map(s => s.trim());
  const price = parseFloat(priceStr);
  if (!title || isNaN(price)) return bot.sendMessage(m.chat.id, '❌ Format: /addcourse Title | price | desc | author');
  const id = Date.now().toString(36);
  db.courses[id] = { title, price, desc: desc || '', author: author || 'Admin', lessons: [], createdAt: Date.now() };
  save();
  bot.sendMessage(m.chat.id, '✅ Course created\\nID: \`' + id + '\`\\n\\nAdd lessons: /addlesson ' + id + ' Title | content', { parse_mode: 'Markdown' });
});

bot.onText(/\\/addlesson (\\S+) (.+)/, (m, match) => {
  if (String(m.from.id) !== String(ADMIN)) return;
  const c = db.courses[match[1]];
  if (!c) return bot.sendMessage(m.chat.id, '❌ No course');
  const [title, content] = match[2].split('|').map(s => s.trim());
  c.lessons.push({ title, content });
  save();
  bot.sendMessage(m.chat.id, '✅ Lesson added');
});

bot.onText(/\\/credit (\\d+) ([\\d.]+)/, (m, match) => {
  if (String(m.from.id) !== String(ADMIN)) return;
  user(match[1]).balance += parseFloat(match[2]); save();
  bot.sendMessage(m.chat.id, '✅ Credited');
  bot.sendMessage(match[1], '💰 +$' + match[2]).catch(()=>{});
});

bot.on('polling_error', e => console.error(e.message));
console.log('✅ Course seller running');`
    },

    lead_capture: {
        name: 'Lead Capture Bot', cat: 'Business', price: 65,
        desc: 'Funnel flow: ask name → email → phone → message. Saves to CSV, notifies admin, auto-followup.',
        requires_env: 'TOKEN,ADMIN_ID',
        code: `const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs'), path = require('path');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const ADMIN = process.env.ADMIN_ID;
const CSV = path.join(__dirname, 'leads.csv');
const sessions = {};

if (!fs.existsSync(CSV)) fs.writeFileSync(CSV, 'timestamp,userId,name,email,phone,message\\n');

const STEPS = ['name', 'email', 'phone', 'message'];
const PROMPTS = {
  name: '👤 What is your *full name*?',
  email: '📧 Your *email address*?',
  phone: '📱 Your *phone* (with country code)?',
  message: '💬 Any *message* for us? (or /skip)'
};
const VALIDATE = {
  name: v => v.length >= 2 && v.length <= 80,
  email: v => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v),
  phone: v => /^\\+?[\\d\\s-]{7,20}$/.test(v),
  message: v => true
};

function ask(chatId, step) {
  bot.sendMessage(chatId, PROMPTS[step], { parse_mode: 'Markdown', reply_markup: { force_reply: true } });
}

bot.onText(/\\/start/, m => {
  sessions[m.from.id] = { step: 0, data: {}, chatId: m.chat.id };
  bot.sendMessage(m.chat.id, '👋 Welcome! Let\\'s get in touch.\\n\\n/cancel to abort.');
  ask(m.chat.id, 'name');
});

bot.onText(/\\/cancel/, m => { delete sessions[m.from.id]; bot.sendMessage(m.chat.id, '❌ Cancelled'); });

bot.on('message', m => {
  const s = sessions[m.from.id];
  if (!s || !m.text || m.text.startsWith('/')) return;
  const step = STEPS[s.step];
  let val = m.text.trim();
  if (step === 'message' && val === '/skip') val = '';
  if (!VALIDATE[step](val)) return bot.sendMessage(m.chat.id, '⚠️ Invalid input. Try again:', { reply_markup: { force_reply: true } });
  s.data[step] = val;
  s.step++;
  if (s.step < STEPS.length) return ask(m.chat.id, STEPS[s.step]);

  // Save lead
  const d = s.data;
  const row = [new Date().toISOString(), m.from.id, JSON.stringify(d.name), JSON.stringify(d.email), JSON.stringify(d.phone), JSON.stringify(d.message)].join(',');
  fs.appendFileSync(CSV, row + '\\n');
  bot.sendMessage(m.chat.id, '✅ *Thanks!*\\n\\nWe\\'ll contact you soon.', { parse_mode: 'Markdown' });
  bot.sendMessage(ADMIN, '🔔 *New Lead*\\n\\n👤 ' + d.name + '\\n📧 ' + d.email + '\\n📱 ' + d.phone + '\\n💬 ' + (d.message || '(none)'), { parse_mode: 'Markdown' });
  delete sessions[m.from.id];
});

bot.onText(/\\/leads/, m => {
  if (String(m.from.id) !== String(ADMIN)) return;
  const csv = fs.readFileSync(CSV, 'utf8').split('\\n').filter(Boolean);
  bot.sendMessage(m.chat.id, '📊 Total leads: ' + (csv.length - 1));
  bot.sendDocument(m.chat.id, CSV, { caption: '📊 Leads CSV' }).catch(()=>{});
});

bot.on('polling_error', e => console.error(e.message));
console.log('✅ Lead capture running');`
    },

   
    xp_system: {
        name: 'XP Leaderboard Bot', cat: 'Group', price: 55,
        desc: 'Award XP per message in groups, level up system with ranks. /top, /rank, /xp. Per-chat tracking.',
        requires_env: 'TOKEN',
        code: `const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs'), path = require('path');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const DB = path.join(__dirname, 'xp.json');

let db = { chats: {} };
if (fs.existsSync(DB)) { try { db = JSON.parse(fs.readFileSync(DB, 'utf8')); } catch {} }
let dirty = false;
function save() { if (dirty) { fs.writeFileSync(DB, JSON.stringify(db, null, 2)); dirty = false; } }
setInterval(save, 10000);

const XP_PER_MSG = 5;
const COOLDOWN = 30000; // 30s between XP grants per user
const lastMsg = {};

function levelFromXp(xp) { return Math.floor(Math.sqrt(xp / 50)) + 1; }
function xpForLevel(l) { return (l - 1) * (l - 1) * 50; }

function u(chatId, userId) {
  db.chats[chatId] = db.chats[chatId] || { users: {} };
  db.chats[chatId].users[userId] = db.chats[chatId].users[userId] || { xp: 0, level: 1, msgs: 0, name: '' };
  return db.chats[chatId].users[userId];
}

bot.on('message', m => {
  if (!m.from || m.from.is_bot || !m.text || m.text.startsWith('/')) return;
  const key = m.chat.id + ':' + m.from.id;
  const now = Date.now();
  const rec = u(m.chat.id, m.from.id);
  rec.msgs++;
  rec.name = m.from.first_name || m.from.username || 'User';
  dirty = true;
  if (!lastMsg[key] || now - lastMsg[key] > COOLDOWN) {
    lastMsg[key] = now;
    const oldLevel = rec.level;
    rec.xp += XP_PER_MSG;
    rec.level = levelFromXp(rec.xp);
    if (rec.level > oldLevel) {
      bot.sendMessage(m.chat.id, '🎉 ' + rec.name + ' leveled up to *' + rec.level + '*!', { parse_mode: 'Markdown' }).catch(()=>{});
    }
  }
});

bot.onText(/\\/top/, m => {
  const chat = db.chats[m.chat.id];
  if (!chat) return bot.sendMessage(m.chat.id, '📭 No data yet');
  const top = Object.entries(chat.users).sort((a, b) => b[1].xp - a[1].xp).slice(0, 10);
  const medals = ['🥇', '🥈', '🥉'];
  bot.sendMessage(m.chat.id, '🏆 *Leaderboard*\\n\\n' + top.map(([uid, r], i) => (medals[i] || (i + 1) + '.') + ' ' + r.name + ' — Lv ' + r.level + ' (' + r.xp + ' XP)').join('\\n'), { parse_mode: 'Markdown' });
});

bot.onText(/\\/rank(?: (.+))?/, m => {
  const target = m.reply_to_message?.from;
  const rec = u(m.chat.id, target ? target.id : m.from.id);
  const nextXp = xpForLevel(rec.level + 1);
  const currXp = xpForLevel(rec.level);
  const progress = Math.floor((rec.xp - currXp) / (nextXp - currXp) * 100);
  const bar = '█'.repeat(Math.floor(progress / 10)) + '░'.repeat(10 - Math.floor(progress / 10));
  bot.sendMessage(m.chat.id, '📊 *' + rec.name + '*\\n\\nLevel: *' + rec.level + '*\\nXP: ' + rec.xp + '\\nMessages: ' + rec.msgs + '\\n\\n' + bar + ' ' + progress + '%', { parse_mode: 'Markdown' });
});

bot.onText(/\\/resetxp/, m => {
  // Only works if bot is admin
  if (!db.chats[m.chat.id]) return;
  db.chats[m.chat.id] = { users: {} }; dirty = true;
  bot.sendMessage(m.chat.id, '🔄 Leaderboard reset');
});

bot.on('polling_error', e => console.error(e.message));
console.log('✅ XP system running');`
    },

    subtitle_bot: {
        name: 'Subtitle Generator', cat: 'AI', price: 95,
        desc: 'Generate SRT subtitles from video/audio via Whisper. Send file → get .srt + .vtt.',
        requires_env: 'TOKEN,OPENAI_KEY',
        code: `const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const fs = require('fs'), path = require('path'), os = require('os');
const FormData = require('form-data');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const KEY = process.env.OPENAI_KEY;
const TMP = path.join(os.tmpdir(), 'subbot');
if (!fs.existsSync(TMP)) fs.mkdirSync(TMP, { recursive: true });

function whisperSrt(filePath) {
  return new Promise((res, rej) => {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('model', 'whisper-1');
    form.append('response_format', 'srt');
    const r = https.request({
      hostname: 'api.openai.com', path: '/v1/audio/transcriptions', method: 'POST',
      headers: { 'Authorization': 'Bearer ' + KEY, ...form.getHeaders() }
    }, x => {
      let d = ''; x.on('data', c => d += c);
      x.on('end', () => x.statusCode >= 400 ? rej(new Error(d.slice(0, 200))) : res(d));
    });
    r.on('error', rej); form.pipe(r);
  });
}

function srtToVtt(srt) {
  return 'WEBVTT\\n\\n' + srt.replace(/(\\d{2}:\\d{2}:\\d{2}),(\\d{3})/g, '$1.$2');
}

async function handleMedia(m) {
  const media = m.video || m.audio || m.document;
  if (!media) return;
  if (media.file_size > 25 * 1024 * 1024) return bot.sendMessage(m.chat.id, '❌ Max 25MB');
  const status = await bot.sendMessage(m.chat.id, '🎬 Generating subtitles...');
  try {
    await bot.downloadFile(media.file_id, TMP);
    const files = fs.readdirSync(TMP).filter(f => f.includes(media.file_id));
    if (!files.length) throw new Error('Download failed');
    const local = path.join(TMP, files[0]);
    const srt = await whisperSrt(local);
    const srtPath = local + '.srt', vttPath = local + '.vtt';
    fs.writeFileSync(srtPath, srt);
    fs.writeFileSync(vttPath, srtToVtt(srt));
    await bot.sendDocument(m.chat.id, srtPath, { caption: '📄 SRT subtitles' });
    await bot.sendDocument(m.chat.id, vttPath, { caption: '📄 WebVTT subtitles' });
    bot.deleteMessage(m.chat.id, status.message_id).catch(()=>{});
    fs.unlinkSync(local); fs.unlinkSync(srtPath); fs.unlinkSync(vttPath);
  } catch (e) { bot.editMessageText('❌ ' + e.message.slice(0, 250), { chat_id: m.chat.id, message_id: status.message_id }); }
}

bot.on('video', handleMedia);
bot.on('audio', handleMedia);
bot.on('document', m => { if (/\\.(mp4|mkv|mov|mp3|wav|m4a)$/i.test(m.document?.file_name || '')) handleMedia(m); });

bot.on('polling_error', e => console.error(e.message));
console.log('✅ Subtitle generator running');`
    },

   
    form_builder: {
        name: 'Form Builder Bot', cat: 'Business', price: 80,
        desc: 'Admins build custom forms, users fill them, results to CSV. /newform, /form <id>, /results <id>.',
        requires_env: 'TOKEN,ADMIN_ID',
        code: `const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs'), path = require('path');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const ADMIN = process.env.ADMIN_ID;
const DB = path.join(__dirname, 'forms.json');

let db = { forms: {}, responses: {} };
if (fs.existsSync(DB)) { try { db = JSON.parse(fs.readFileSync(DB, 'utf8')); } catch {} }
function save() { fs.writeFileSync(DB, JSON.stringify(db, null, 2)); }

const sessions = {};

bot.onText(/\\/newform (.+)/, (m, match) => {
  if (String(m.from.id) !== String(ADMIN)) return;
  const title = match[1];
  const id = Date.now().toString(36);
  db.forms[id] = { title, fields: [], createdAt: Date.now(), createdBy: m.from.id };
  db.responses[id] = [];
  save();
  bot.sendMessage(m.chat.id, '✅ Form created\\nID: \`' + id + '\`\\n\\nAdd fields: /addfield ' + id + ' <question>\\n\\nPublish: /publish ' + id, { parse_mode: 'Markdown' });
});

bot.onText(/\\/addfield (\\S+) (.+)/, (m, match) => {
  if (String(m.from.id) !== String(ADMIN)) return;
  const f = db.forms[match[1]];
  if (!f) return bot.sendMessage(m.chat.id, '❌ No form');
  f.fields.push({ q: match[2], type: 'text' });
  save();
  bot.sendMessage(m.chat.id, '✅ Field added (' + f.fields.length + ' total)');
});

bot.onText(/\\/publish (\\S+)/, (m, match) => {
  if (String(m.from.id) !== String(ADMIN)) return;
  const f = db.forms[match[1]];
  if (!f || !f.fields.length) return bot.sendMessage(m.chat.id, '❌ Invalid or empty form');
  bot.sendMessage(m.chat.id, '📋 *' + f.title + '*\\n\\nFill it: /form ' + match[1], { parse_mode: 'Markdown' });
});

bot.onText(/\\/form (\\S+)/, m => {
  const id = m[1], f = db.forms[id];
  if (!f) return bot.sendMessage(m.chat.id, '❌ No form');
  sessions[m.from.id] = { id, step: 0, answers: [] };
  bot.sendMessage(m.chat.id, '📋 *' + f.title + '*\\n\\nQ1: ' + f.fields[0].q + '\\n\\n/skip to skip • /cancel to abort', { parse_mode: 'Markdown', reply_markup: { force_reply: true } });
});

bot.onText(/\\/cancel/, m => { delete sessions[m.from.id]; bot.sendMessage(m.chat.id, '❌ Cancelled'); });

bot.on('message', m => {
  const s = sessions[m.from.id];
  if (!s || !m.text || m.text.startsWith('/')) return;
  const f = db.forms[s.id];
  s.answers.push(m.text === '/skip' ? null : m.text);
  s.step++;
  if (s.step < f.fields.length) {
    bot.sendMessage(m.chat.id, 'Q' + (s.step + 1) + ': ' + f.fields[s.step].q, { reply_markup: { force_reply: true } });
  } else {
    db.responses[s.id].push({ userId: m.from.id, username: m.from.username || m.from.first_name, at: Date.now(), answers: s.answers });
    save();
    bot.sendMessage(m.chat.id, '✅ *Submitted!* Thanks.', { parse_mode: 'Markdown' });
    bot.sendMessage(ADMIN, '🔔 New response on form \`' + s.id + '\` from ' + m.from.id).catch(()=>{});
    delete sessions[m.from.id];
  }
});

bot.onText(/\\/results (\\S+)/, m => {
  if (String(m.from.id) !== String(ADMIN)) return;
  const f = db.forms[m[1]], rs = db.responses[m[1]];
  if (!f) return bot.sendMessage(m.chat.id, '❌ No form');
  if (!rs.length) return bot.sendMessage(m.chat.id, '📭 No responses');
  const header = f.fields.map(x => x.q).join(',');
  const rows = rs.map(r => r.answers.map(a => JSON.stringify(a || '')).join(','));
  const csvPath = path.join(__dirname, 'form_' + m[1] + '.csv');
  fs.writeFileSync(csvPath, header + '\\n' + rows.join('\\n'));
  bot.sendMessage(m.chat.id, '📊 *' + f.title + '* — ' + rs.length + ' responses', { parse_mode: 'Markdown' });
  bot.sendDocument(m.chat.id, csvPath, { caption: '📊 CSV' }).catch(()=>{});
});

bot.on('polling_error', e => console.error(e.message));
console.log('✅ Form builder running');`
    },

    server_dashboard: {
        name: 'Server Stats Dashboard', cat: 'DevOps', price: 90,
        desc: 'Live stats from any Linux server via SSH: CPU, RAM, disk, top processes, systemd services. /stats, /svc <name>, /logs <name> <lines>.',
        requires_env: 'TOKEN,SSH_HOST,SSH_USER,SSH_KEY,ADMIN_ID',
        code: `const TelegramBot = require('node-telegram-bot-api');
const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const HOST = process.env.SSH_HOST, USER = process.env.SSH_USER, KEY = process.env.SSH_KEY, ADMIN = process.env.ADMIN_ID;

async function ssh() {
  const s = new NodeSSH();
  await s.connect({ host: HOST, username: USER, privateKey: fs.readFileSync(KEY, 'utf8') });
  return s;
}

async function exec(cmd) {
  const s = await ssh();
  try { const r = await s.execCommand(cmd); return r.stdout || r.stderr; }
  finally { s.dispose(); }
}

function bar(pct) {
  pct = Math.min(100, Math.max(0, pct));
  const filled = Math.round(pct / 10);
  return '█'.repeat(filled) + '░'.repeat(10 - filled) + ' ' + pct.toFixed(1) + '%';
}

const isAdmin = m => String(m.from.id) === String(ADMIN);

bot.onText(/\\/stats/, async m => {
  if (!isAdmin(m)) return;
  const status = await bot.sendMessage(m.chat.id, '⏳ Fetching...');
  try {
    const [cpu, mem, disk, up, load, procs] = await Promise.all([
      exec("top -bn1 | grep 'Cpu(s)' | awk '{print $2}'"),
      exec("free -m | awk 'NR==2{printf \\"%.1f\\", $3*100/$2}'"),
      exec("df -h / | awk 'NR==2{print $5}' | tr -d '%'"),
      exec('uptime -p'),
      exec('cat /proc/loadavg | cut -d" " -f1-3'),
      exec("ps aux --sort=-%cpu | head -6 | awk 'NR>1 {printf \\"%-15s %5s%% %5s%%\\\\n\\", $11, $3, $4}'")
    ]);
    const text = '📊 *Server Stats*\\n\\n' +
      '🖥 Host: \`' + HOST + '\`\\n' +
      '⏱ ' + up.trim() + '\\n\\n' +
      '💻 *CPU:* ' + cpu.trim() + '%\\n' + bar(parseFloat(cpu)) + '\\n\\n' +
      '🧠 *RAM:*\\n' + bar(parseFloat(mem)) + '\\n\\n' +
      '💾 *Disk:*\\n' + bar(parseFloat(disk)) + '\\n\\n' +
      '⚡ *Load:* ' + load.trim() + '\\n\\n' +
      '🔥 *Top Processes:*\\n\`' + procs + '\`';
    bot.editMessageText(text, { chat_id: m.chat.id, message_id: status.message_id, parse_mode: 'Markdown' });
  } catch (e) { bot.editMessageText('❌ ' + e.message.slice(0, 250), { chat_id: m.chat.id, message_id: status.message_id }); }
});

bot.onText(/\\/svc (\\S+)/, async m => {
  if (!isAdmin(m)) return;
  try {
    const out = await exec('systemctl status ' + m[1] + ' --no-pager | head -15');
    bot.sendMessage(m.chat.id, '\`\`\`\\n' + out + '\\n\`\`\`', { parse_mode: 'Markdown' });
  } catch (e) { bot.sendMessage(m.chat.id, '❌ ' + e.message); }
});

bot.onText(/\\/logs (\\S+)(?: (\\d+))?/, async (m, match) => {
  if (!isAdmin(m)) return;
  const n = match[2] || 30;
  try {
    const out = await exec('journalctl -u ' + match[1] + ' -n ' + n + ' --no-pager');
    const chunks = out.match(/[\\s\\S]{1,3800}/g) || [];
    for (const c of chunks.slice(0, 3)) bot.sendMessage(m.chat.id, '\`\`\`\\n' + c + '\\n\`\`\`', { parse_mode: 'Markdown' });
  } catch (e) { bot.sendMessage(m.chat.id, '❌ ' + e.message); }
});

bot.onText(/\\/restart (\\S+)/, async m => {
  if (!isAdmin(m)) return;
  const status = await bot.sendMessage(m.chat.id, '🔄 Restarting ' + m[1] + '...');
  try {
    await exec('systemctl restart ' + m[1]);
    bot.editMessageText('✅ Restarted ' + m[1], { chat_id: m.chat.id, message_id: status.message_id });
  } catch (e) { bot.editMessageText('❌ ' + e.message, { chat_id: m.chat.id, message_id: status.message_id }); }
});

bot.onText(/\\/services/, async m => {
  if (!isAdmin(m)) return;
  try {
    const out = await exec("systemctl list-units --type=service --state=running --no-pager --no-legend | awk '{print $1}' | head -30");
    bot.sendMessage(m.chat.id, '🟢 *Running services*\\n\`' + out + '\`', { parse_mode: 'Markdown' });
  } catch (e) { bot.sendMessage(m.chat.id, '❌ ' + e.message); }
});

bot.on('polling_error', e => console.error(e.message));
console.log('✅ Server dashboard running');`
    }
};

let templatesDB = loadJSON(TEMPLATES_FILE, DEFAULT_TEMPLATES);
if (Object.keys(templatesDB).length === 0) { templatesDB = DEFAULT_TEMPLATES; saveJSON(TEMPLATES_FILE, templatesDB); }
function saveTemplates() { saveJSON(TEMPLATES_FILE, templatesDB); }

function getUserTier(uid) {
    const u = usersDB[uid];
    if (!u) return 'free';
    if (u.tier && settings.tiers[u.tier]) return u.tier;
    return 'free';
}

function getMaxBots(uid) {
    const tier = getUserTier(uid);
    if (tier === 'vip') return settings.max_bots_vip;
    if (tier === 'premium') return settings.max_bots_premium;
    const extra = usersDB[uid]?.extra_slots || 0;
    return settings.max_bots_free + extra;
}

function hasOwned(uid, tplKey) {
    const u = usersDB[uid];
    if (!u) return false;
    if (!u.templates) u.templates = [];
    return u.templates.includes(tplKey);
}

function purchaseTemplate(uid, tplKey) {
    const tpl = templatesDB[tplKey];
    if (!tpl) return { ok: false, msg: 'Template not found' };
    if (hasOwned(uid, tplKey)) return { ok: false, msg: 'Already owned' };
    const u = usersDB[uid];
    if (!u) return { ok: false, msg: 'User not found' };
    if ((u.points || 0) < tpl.price) return { ok: false, msg: 'Not enough points' };
    u.points -= tpl.price;
    if (!u.templates) u.templates = [];
    u.templates.push(tplKey);
    saveDB();
    return { ok: true };
}

function deployTemplateToUser(uid, tplKey) {
    const tpl = templatesDB[tplKey];
    if (!tpl) return null;
    const fName = `${tplKey}_${Date.now()}.js`;
    const fPath = path.join(DEPLOY_DIR, `${uid}_${fName}`);
    fs.writeFileSync(fPath, tpl.code);
    return { fPath, fName };
}

function getCategories() {
    const cats = new Set();
    for (const k in templatesDB) cats.add(templatesDB[k].cat);
    return Array.from(cats).sort();
}

function getTemplatesByCat(cat) {
    return Object.entries(templatesDB).filter(([k, v]) => v.cat === cat);
}


function doSpin(uid) {
    const now = Date.now();
    const cooldown = settings.economy.spin_cooldown_hours * 3600000;
    const last = econDB.spins[uid] || 0;
    if (now - last < cooldown) return { ok: false, waitH: Math.ceil((cooldown - (now - last)) / 3600000) };
    const reward = [1, 2, 3, 5, 7, 10, 15, 25][Math.floor(Math.random() * 8)];
    usersDB[uid].points = (usersDB[uid].points || 0) + reward;
    econDB.spins[uid] = now;
    saveEcon(); saveDB();
    return { ok: true, reward };
}

function doScratch(uid) {
    const cost = settings.economy.scratch_cost;
    if ((usersDB[uid].points || 0) < cost) return { ok: false, msg: 'Not enough points' };
    usersDB[uid].points -= cost;
    const rewards = settings.economy.scratch_rewards;
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    usersDB[uid].points += reward;
    saveDB();
    return { ok: true, reward, cost };
}

function claimDaily(uid) {
    const today = moment().format('YYYY-MM-DD');
    const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
    const u = usersDB[uid];
    if (!u) return { ok: false };
    if (u.last_daily === today) return { ok: false, msg: 'Already claimed' };
    let streak = u.daily_streak || 0;
    if (u.last_daily === yesterday) streak++;
    else streak = 1;
    const bonusArr = settings.economy.streak_bonus;
    const idx = Math.min(streak - 1, bonusArr.length - 1);
    const reward = settings.economy.daily_reward + (bonusArr[idx] || 0);
    u.points = (u.points || 0) + reward;
    u.last_daily = today;
    u.daily_streak = streak;
    saveDB();
    return { ok: true, reward, streak };
}

function referralRegister(newUid, refId) {
    if (!usersDB[refId] || refId === newUid) return null;
    const bonus = settings.points_per_referral;
    usersDB[refId].points = (usersDB[refId].points || 0) + bonus;
    usersDB[refId].referral_count = (usersDB[refId].referral_count || 0) + 1;
    econDB.referrals[refId] = (econDB.referrals[refId] || 0) + 1;
    saveDB(); saveEcon();
    return bonus;
}

function giftPoints(fromUid, toUid, amount) {
    if (amount <= 0) return { ok: false, msg: 'Invalid amount' };
    if (!usersDB[toUid]) return { ok: false, msg: 'Target user not found' };
    if ((usersDB[fromUid].points || 0) < amount) return { ok: false, msg: 'Not enough points' };
    usersDB[fromUid].points -= amount;
    usersDB[toUid].points = (usersDB[toUid].points || 0) + amount;
    saveDB();
    return { ok: true };
}

function redeemCoupon(uid, code) {
    const c = couponsDB[code.toUpperCase()];
    if (!c) return { ok: false, msg: 'Invalid code' };
    if (c.uses >= c.max_uses) return { ok: false, msg: 'Code expired' };
    if (c.used_by && c.used_by.includes(uid)) return { ok: false, msg: 'Already used' };
    usersDB[uid].points = (usersDB[uid].points || 0) + c.reward;
    c.uses++;
    if (!c.used_by) c.used_by = [];
    c.used_by.push(uid);
    saveCoupons(); saveDB();
    return { ok: true, reward: c.reward };
}

function purchaseStoreItem(uid, key) {
    const item = settings.store_items[key];
    if (!item) return { ok: false, msg: 'Item not found' };
    if ((usersDB[uid].points || 0) < item.cost) return { ok: false, msg: 'Not enough points' };
    usersDB[uid].points -= item.cost;
    if (key === 'extra_slot') usersDB[uid].extra_slots = (usersDB[uid].extra_slots || 0) + 1;
    else if (key === 'priority') usersDB[uid].priority_until = Date.now() + 7 * 86400000;
    else if (key === 'custom_prefix') usersDB[uid].custom_prefix = true;
    else if (key === 'auto_restart_plus') usersDB[uid].restart_plus = true;
    saveDB();
    return { ok: true };
}

function upgradeTier(uid, tierKey) {
    const tier = settings.tiers[tierKey];
    if (!tier) return { ok: false, msg: 'Invalid tier' };
    if ((usersDB[uid].points || 0) < tier.cost) return { ok: false, msg: 'Not enough points' };
    usersDB[uid].points -= tier.cost;
    usersDB[uid].tier = tierKey;
    saveDB();
    return { ok: true };
}

function checkQuestProgress(uid) {
    const u = usersDB[uid];
    if (!u) return [];
    const completed = [];
    for (const q of questsDB.quests) {
        let current = 0;
        if (q.type === 'deploys') current = u.total_deployments || 0;
        else if (q.type === 'referrals') current = u.referral_count || 0;
        else if (q.type === 'streak') current = u.daily_streak || 0;
        if (current >= q.target) {
            const key = `${uid}_${q.id}`;
            if (!econDB.quests[key]) {
                econDB.quests[key] = true;
                u.points = (u.points || 0) + q.reward;
                completed.push(q);
            }
        }
    }
    if (completed.length) { saveEcon(); saveDB(); }
    return completed;
}

function createAuction(item, durationMin, startBid) {
    auctionsDB.active = {
        item, startBid,
        currentBid: startBid,
        topBidder: null,
        endsAt: Date.now() + durationMin * 60000,
        startedAt: Date.now()
    };
    saveAuctions();
}

function placeBid(uid, amount) {
    const a = auctionsDB.active;
    if (!a) return { ok: false, msg: 'No active auction' };
    if (Date.now() > a.endsAt) return { ok: false, msg: 'Auction ended' };
    if (amount <= a.currentBid) return { ok: false, msg: 'Bid too low' };
    if ((usersDB[uid].points || 0) < amount) return { ok: false, msg: 'Not enough points' };
    if (a.topBidder) {
        const prev = usersDB[a.topBidder];
        if (prev) prev.points += a.currentBid;
    }
    usersDB[uid].points -= amount;
    a.currentBid = amount;
    a.topBidder = uid;
    saveAuctions(); saveDB();
    return { ok: true };
}


function isAdmin(uid) { return String(uid) === String(ADMIN_ID); }

function isBanned(uid) {
    return usersDB[uid]?.banned === true;
}

function isMaintBlocked(uid) {
    return settings.maintenance && !isAdmin(uid);
}

function banUser(uid, reason = 'No reason') {
    if (!usersDB[uid]) return false;
    usersDB[uid].banned = true;
    usersDB[uid].ban_reason = reason;
    usersDB[uid].banned_at = moment().format();
    saveDB();
    // stop all their bots
    for (const [fPath, info] of Object.entries(runningProcesses)) {
        if (info.userId === String(uid)) stopBot(fPath);
    }
    return true;
}

function unbanUser(uid) {
    if (!usersDB[uid]) return false;
    usersDB[uid].banned = false;
    delete usersDB[uid].ban_reason;
    saveDB();
    return true;
}

function addPoints(uid, amount) {
    if (!usersDB[uid]) return false;
    usersDB[uid].points = (usersDB[uid].points || 0) + amount;
    saveDB();
    return true;
}

function subtractPoints(uid, amount) {
    if (!usersDB[uid]) return false;
    usersDB[uid].points = Math.max(0, (usersDB[uid].points || 0) - amount);
    saveDB();
    return true;
}

function setPoints(uid, amount) {
    if (!usersDB[uid]) return false;
    usersDB[uid].points = Math.max(0, amount);
    saveDB();
    return true;
}

function globalAddPoints(amount) {
    let count = 0;
    for (const uid in usersDB) {
        usersDB[uid].points = (usersDB[uid].points || 0) + amount;
        count++;
    }
    saveDB();
    return count;
}

function setUserLimit(uid, limit) {
    if (!usersDB[uid]) return false;
    usersDB[uid].custom_bot_limit = limit;
    saveDB();
    return true;
}

function forceRestartAll() {
    let count = 0;
    const snapshot = Object.entries(runningProcesses);
    for (const [fPath, info] of snapshot) {
        const { userId, fileName } = info;
        stopBot(fPath);
        setTimeout(() => {
            runUserFile(fPath, parseInt(userId), fileName);
        }, 1500);
        count++;
    }
    return count;
}

function cleanDeadProcesses() {
    let cleaned = 0;
    for (const [fPath, info] of Object.entries(runningProcesses)) {
        if (info.process.exitCode !== null) {
            delete runningProcesses[fPath];
            cleaned++;
        }
    }
    return cleaned;
}

async function broadcastToAll(text, fromAdminId) {
    let sent = 0, failed = 0;
    for (const uid in usersDB) {
        try {
            await bot.sendMessage(parseInt(uid), premiumText('📢  A𝖓𝖓𝖔𝖚𝖓𝖈𝖊𝖒𝖊𝖓𝖙 ', text, '📨'), { parse_mode: 'HTML' });
            sent++;
            await new Promise(r => setTimeout(r, 50));
        } catch { failed++; }
    }
    adminLog('broadcast', fromAdminId, { sent, failed });
    return { sent, failed };
}

async function backupToChannel() {
    try {
        const stamp = moment().format('YYYYMMDD_HHmmss');
        const tmp = path.join(BACKUP_DIR, `backup_${stamp}.json`);
        const full = {
            users: usersDB,
            settings,
            coupons: couponsDB,
            quests: questsDB,
            tags: tagsDB,
            economy: econDB,
            health: healthDB,
            market: marketDB,
            templates: templatesDB,
            exportedAt: moment().format()
        };
        fs.writeFileSync(tmp, JSON.stringify(full, null, 2));
        await bot.sendDocument(CHANNEL_ID, tmp, { caption: `💾 A𝖚𝖙𝖔-B𝖆𝖈𝖐𝖚𝖕 ${stamp}` });
        fs.unlinkSync(tmp);
        return true;
    } catch (e) {
        log('error', 'backup failed', e.message);
        return false;
    }
}

function searchUsers(query) {
    const q = String(query).toLowerCase();
    const results = [];
    for (const uid in usersDB) {
        const u = usersDB[uid];
        if (
            uid.includes(q) ||
            (u.username && u.username.toLowerCase().includes(q)) ||
            (u.first_name && u.first_name.toLowerCase().includes(q))
        ) {
            results.push({ uid, ...u });
        }
    }
    return results.slice(0, 20);
}

function getSystemStats() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const load = os.loadavg();
    let totalSize = 0;
    try {
        const stat = fs.statSync(DB.users);
        totalSize += stat.size;
    } catch {}
    return {
        uptime: process.uptime(),
        platform: os.platform(),
        arch: os.arch(),
        cpus: os.cpus().length,
        load1: load[0].toFixed(2),
        load5: load[1].toFixed(2),
        memTotalMB: (totalMem / 1048576).toFixed(0),
        memUsedMB: (usedMem / 1048576).toFixed(0),
        memPct: ((usedMem / totalMem) * 100).toFixed(1),
        nodeVersion: process.version,
        dbSizeKB: (totalSize / 1024).toFixed(1),
        runningBots: Object.keys(runningProcesses).length,
        totalUsers: Object.keys(usersDB).length
    };
}

async function generateUserReport(uid) {
    const u = usersDB[uid];
    if (!u) return 'U𝖘𝖊𝖗 N𝖔𝖙 F𝖔𝖚𝖓𝖉';
    const myBots = Object.values(runningProcesses).filter(p => p.userId === String(uid));
    const lines = [
        `👤 <b>U𝖘𝖊𝖗:</b> ${uid}`,
        `📛 <b>N𝖆𝖒𝖊:</b> ${esc(u.first_name || 'N/A')}`,
        `🔖 <b>U𝖘𝖊𝖗𝖓𝖆𝖒𝖊:</b> ${u.username ? '@' + u.username : 'N/A'}`,
        `💰 <b>P𝖔𝖎𝖓𝖙𝖘:</b> ${u.points || 0}`,
        `🏆 <b>T𝖎𝖊𝖗:</b> ${getUserTier(uid)}`,
        `📤 <b>D𝖊𝖕𝖑𝖔𝖞𝖒𝖊𝖓𝖙𝖘:</b> ${u.total_deployments || 0}`,
        `👥 <b>R𝖊𝖋𝖊𝖗𝖆𝖑𝖘:</b> ${u.referral_count || 0}`,
        `🔥 <b>S𝖙𝖗𝖊𝖆𝖐:</b> ${u.daily_streak || 0}`,
        `🤖 <b>A𝖈𝖙𝖎𝖛𝖊 B𝖔𝖙𝖘:</b> ${myBots.length}`,
        `📦 <b>T𝖊𝖒𝖕𝖑𝖆𝖙𝖊𝖘 O𝖜𝖓𝖊𝖉:</b> ${(u.templates || []).length}`,
        `🚫 <b>B𝖆𝖓𝖉𝖊𝖉:</b> ${u.banned ? 'YES - ' + (u.ban_reason || '') : 'No'}`,
        `📅 <b>J𝖔𝖎𝖓𝖊𝖉:</b> ${u.joined || 'N/A'}`
    ];
    return lines.join('\n');
}
async function checkForceJoin(userId) {
    if (!settings.force_join) return true;
    if (String(userId) === String(ADMIN_ID)) return true;
    for (const ch of FORCE_JOIN_CHANNELS) {
        try {
            const uname = ch.link.replace('https://t.me/', '').replace('@', '');
            const member = await bot.getChatMember(`@${uname}`, userId);
            if (member.status === 'left' || member.status === 'kicked') return false;
        } catch (e) {
            log('warn', `force-join check failed for ${ch.name}:`, e.message);
            if (settings.force_join_strict) return false;
            continue;
        }
    }
    return true;
}

function getForceJoinKeyboard() {
    const kb = { inline_keyboard: [] };
    for (const ch of FORCE_JOIN_CHANNELS) {
        kb.inline_keyboard.push([{ text: `📢 ${ch.name}`, url: ch.link }]);
    }
    kb.inline_keyboard.push([{ text: '✅ ɪ ᴊᴏɪɴᴇᴅ', callback_data: 'check_join' }]);
    return kb;
}


function mainKeyboard(userId) {
    const kb = [
        ['✦ Dᴇᴘʟᴏʏ Js', '✦ Tᴇᴍᴘʟᴀᴛᴇs'],
        ['✦ Mʏ Fɪʟᴇs', '✦ Pᴏɪɴᴛs'],
        ['✦ Sᴛᴀᴛs', '✦ Rᴇғᴇʀʀᴀʟs'],
        ['✦ Dᴀɪʟʏ', '✦ Sᴘɪɴ'],
        ['✦ Sᴄʀᴀᴛᴄʜ', '✦ Sᴛᴏʀᴇ'],
        ['✦ Qᴜᴇsᴛs', '✦ Cᴏᴜᴘᴏɴ'],
        ['✦ Gɪғᴛ', '✦ Lᴏɢs'],
        ['✦ Sᴜᴘᴘᴏʀᴛ', '✦ Mᴏʀᴇ Bᴏᴛs']
    ];
    if (isAdmin(userId)) {
        kb.push(['✦ Aᴅᴍɪɴ Pᴀɴᴇʟ', '✦ Aʟʟ Fɪʟᴇs']);
    }
    return { keyboard: kb, resize_keyboard: true };
}

function adminKeyboard() {
    const maintText = settings.maintenance ? '🔴 Maint ON' : '🟢 Maint OFF';
    const notifyText = settings.new_user_notify ? '🔔 Notify ON' : '🔕 Notify OFF';
    const forceText = settings.force_join ? '🔒 ForceJoin ON' : '🔓 ForceJoin OFF';
    const approvalText = settings.deploy_approval ? '🛡 Approval ON' : '🛡 Approval OFF';
    const restartText = settings.auto_restart ? '🔄 AutoRestart ON' : '🔄 AutoRestart OFF';
    const alertText = settings.crash_alert ? '🚨 Alerts ON' : '🚨 Alerts OFF';

    return {
        inline_keyboard: [
            [{ text: '➕ Add Points', callback_data: 'adm_add_pts' }, { text: '➖ Sub Points', callback_data: 'adm_sub_pts' }],
            [{ text: '🛠 Set Points', callback_data: 'adm_set_pts' }, { text: '🌍 Global Add', callback_data: 'adm_global_add' }],
            [{ text: '🚫 Ban User', callback_data: 'adm_ban' }, { text: '✅ Unban User', callback_data: 'adm_unban' }],
            [{ text: '🔍 Search User', callback_data: 'adm_search' }, { text: '📋 User Report', callback_data: 'adm_report' }],
            [{ text: '🎭 Impersonate', callback_data: 'adm_impersonate' }],
            [{ text: '📢 Broadcast', callback_data: 'adm_broadcast' }],
            [{ text: '🎥 Set Video', callback_data: 'adm_set_video' }, { text: '🗑 Clear Video', callback_data: 'adm_clear_video' }],
            [{ text: '💾 Backup to Channel', callback_data: 'adm_backup' }],
            [{ text: '🎟 Create Coupon', callback_data: 'adm_coupon' }, { text: '📜 List Coupons', callback_data: 'adm_list_coupons' }],
            [{ text: '🎨 Add Template', callback_data: 'adm_add_template' }, { text: '📦 List Templates', callback_data: 'adm_list_templates' }],
            [{ text: '🔨 Force Restart All', callback_data: 'adm_force_restart' }],
            [{ text: '🧹 Clean Dead', callback_data: 'adm_clean' },
            { text: '🔨 Deploy Limits', callback_data: 'adm_limits' }],
            [{ text: maintText, callback_data: 'adm_toggle_maint' },
            { text: notifyText, callback_data: 'adm_toggle_notify' }],
            [{ text: forceText, callback_data: 'adm_toggle_force' },
            { text: approvalText, callback_data: 'adm_toggle_approval' }],
            [{ text: restartText, callback_data: 'adm_toggle_restart' },
            { text: alertText, callback_data: 'adm_toggle_alert' }],
            [{ text: '🖥 Server Stats', callback_data: 'adm_stats' },
            { text: '📊 System Info', callback_data: 'adm_system' },
            { text: '📜 Admin Logs', callback_data: 'adm_logs' }],
            [{ text: '📋 Manage Channels', callback_data: 'adm_channels' }]
        ]
    };
}

function templatesCategoriesKeyboard() {
    const cats = getCategories();
    const rows = [];
    for (let i = 0; i < cats.length; i += 2) {
        const row = [{ text: `📁 ${cats[i]}`, callback_data: `tcat_${cats[i]}` }];
        if (cats[i + 1]) row.push({ text: `📁 ${cats[i + 1]}`, callback_data: `tcat_${cats[i + 1]}` });
        rows.push(row);
    }
    rows.push([{ text: '🔙 Back to Menu', callback_data: 'back_menu' }]);
    return { inline_keyboard: rows };
}

function templateListKeyboard(cat, uid) {
    const items = getTemplatesByCat(cat);
    const rows = [];
    for (const [key, tpl] of items) {
        const owned = hasOwned(uid, key);
        const label = owned
            ? `✅ ${tpl.name}`
            : `💎 ${tpl.name} — ${tpl.price} pts`;
        rows.push([{ text: label, callback_data: `tpl_${key}` }]);
    }
    rows.push([{ text: '🔙 Categories', callback_data: 'templates_root' }]);
    return { inline_keyboard: rows };
}

function templateActionsKeyboard(key, uid) {
    const tpl = templatesDB[key];
    const owned = hasOwned(uid, key);
    const rows = [];
    if (owned) {
        rows.push([{ text: '🚀 D𝖊𝖕𝖑𝖔𝖞 N𝖔𝖜', callback_data: `tdeploy_${key}` }]);
    } else if (tpl.price === 0) {
        rows.push([{ text: '🆓 Cʟᴀɪᴍ Fʀᴇᴇ', callback_data: `tbuy_${key}` }]);
    } else {
        rows.push([{ text: `💎 Bᴜʏ — ${tpl.price} ᴘᴛs`, callback_data: `tbuy_${key}` }]);
    }
    rows.push([{ text: '🔙 Bᴀᴄᴋ', callback_data: `tcat_${tpl.cat}` }]);
    return { inline_keyboard: rows };
}

function storeKeyboard() {
    const rows = [];
    for (const [key, item] of Object.entries(settings.store_items)) {
        rows.push([{ text: `💎 ${item.name} — ${item.cost} pts`, callback_data: `store_${key}` }]);
    }
    rows.push([{ text: '🔙 Bᴀᴄᴋ Tᴏ Mᴇɴᴜ', callback_data: 'back_menu' }]);
    return { inline_keyboard: rows };
}

function tiersKeyboard(uid) {
    const currentTier = getUserTier(uid);
    const rows = [];
    for (const [key, tier] of Object.entries(settings.tiers)) {
        const mark = currentTier === key ? '⭐ ' : '';
        const label = tier.cost === 0
            ? `${mark}${tier.name} — Free`
            : `${mark}${tier.name} — ${tier.cost} pts`;
        rows.push([{ text: label, callback_data: `tier_${key}` }]);
    }
    rows.push([{ text: '🔙 Bᴀᴄᴋ Tᴏ Mᴇɴᴜ', callback_data: 'back_menu' }]);
    return { inline_keyboard: rows };
}

function fileActionsKeyboard(fName, uid) {
    return {
        inline_keyboard: [
            [{ text: '▶️ Sᴛᴀʀᴛ', callback_data: `run_${fName}_${uid}`, style: 'success' }, { text: '⏹ Sᴛᴏᴘ', callback_data: `stop_${fName}_${uid}`, style: 'danger' }],
            [{ text: '📥 Dᴏᴡɴʟᴏᴀᴅ', callback_data: `down_${fName}_${uid}`, style: 'primary' }, { text: '📋 Lᴏɢs', callback_data: `logs_${fName}_${uid}`, style: 'primary' }],
            [{ text: '🖥 Cᴏɴsᴏʟᴇ', callback_data: `console_${fName}_${uid}`, style: 'primary' }, { text: '✏️ Rᴇɴᴀᴍᴇ', callback_data: `rename_${fName}_${uid}`, style: 'primary' }],
            [{ text: '🏷 Tᴀɢs', callback_data: `tags_${fName}_${uid}`, style: 'primary' }, { text: '📊 Hᴇᴀʟᴛʜs', callback_data: `health_${fName}_${uid}`, style: 'primary' }],
            [{ text: '🗑️ Dᴇʟᴇᴛᴇ', callback_data: `del_${fName}_${uid}`, style: 'danger' }]
        ]
    };
}

function logsListKeyboard(uid) {
    const files = usersDB[uid]?.files || [];
    if (files.length === 0) return null;
    const rows = files.map(f => [{ text: `📄 ${f}`, callback_data: `viewlog_${f}_${uid}` }]);
    rows.push([{ text: '🔍 Search Logs', callback_data: `logsearch_${uid}` }]);
    return { inline_keyboard: rows };
}

function adminFileActionsKeyboard(fName, targetUid) {
    return {
        inline_keyboard: [
            [{ text: '▶️ Rᴜɴ', callback_data: `run_${fName}_${targetUid}`, style: 'success' }, { text: '⏹ Sᴛᴏᴘ', callback_data: `stop_${fName}_${targetUid}`, style: 'danger' }],
            [{ text: '🗑️ Dᴇʟᴇᴛᴇ', callback_data: `del_${fName}_${targetUid}`, style: 'danger' }],
            [{ text: '📋 Lᴏɢs', callback_data: `logs_${fName}_${targetUid}`, style: 'primary' }, { text: '🖥 Cᴏɴsᴏʟᴇ', callback_data: `console_${fName}_${targetUid}`, style: 'primary' }]
        ]
    };
}

function backMenuKeyboard() {
    return { inline_keyboard: [[{ text: '🔙 Bᴀᴄᴋ Tᴏ Mᴇɴᴜ', callback_data: 'back_menu' }]] };
}


function welcomeMessage(user, isNew) {
    const uid = String(user.id);
    const points = usersDB[uid]?.points || 0;
    const tier = getUserTier(uid);
    const bots = Object.values(runningProcesses).filter(p => p.userId === uid).length;

    return `
<b>✦ Nᴇx Tᴇᴄʜ Cʟᴏᴜᴅ Hᴏsᴛɪɴɢ ✦</b>
<b>🌐 24/7 Js Cʟᴏᴜᴅ Dᴇᴘʟᴏʏᴍᴇɴᴛ</b>

━━━━━━━━━━━━━━━━━━━━

<b>👋 Wᴇʟᴄᴏᴍᴇ${isNew ? '' : ' back'}, ${esc(user.first_name)}!</b>

<b>📊 Yᴏᴜʀ Dᴀsʜʙᴏᴀʀᴅ:</b>
• 💰 Pᴏɪɴᴛs: ${points}
• 🏆 Tɪᴇʀ: ${tier.toUpperCase()}
• 🤖 Aᴄᴛɪᴠᴇ Bᴏᴛs: ${bots}

━━━━━━━━━━━━━━━━━━━━━

<b>✨ Fᴇᴀᴛᴜʀᴇs:</b>
• 📤 Dᴇᴘʟᴏʏ Jᴀᴠᴀsᴄʀɪᴘᴛ (.js, .zip)
• 🎨 Pʀᴇ-ᴍᴀᴅᴇ Tᴇᴍᴘʟᴀᴛᴇs
• 🔄 Aᴜᴛᴏ-ʀᴇsᴛᴀʀᴛ Oɴ Cʀᴀsʜ
• 🖥 Lɪᴠᴇ Cᴏɴsᴏʟᴇ
• 🎁 Dᴀɪʟʏ, Sᴘɪɴ, Sᴄʀᴀᴛᴄʜ, Qᴜᴇsᴛs

💡 Usᴇ Bᴜᴛᴛᴏɴs Bᴇʟᴏᴡ!`;
}

function deployPromptMessage(uid) {
    const points = usersDB[uid]?.points || 0;
    return premiumText('📤 Dᴇᴘʟᴏʏ Js Bᴏᴛ',
        `📂 Sᴜᴘᴘᴏʀᴛᴇᴅ: <b>.Js</b>, <b>.Zɪᴘ</b>\n💰 Cᴏsᴛ: ${settings.hosting_cost} ᴘᴛs\n💎 Bᴀʟᴀɴᴄᴇ: ${points} Pᴛs\n🤖 Mᴀx Bᴏᴛs: ${getMaxBots(uid)}\n\n📌 <b>Jᴀᴠᴀsᴄʀɪᴘᴛ Oɴʟʏ</b>\n⚠️ Uᴘʟᴏᴀᴅ Nᴏᴡ Aɴᴅ Sᴛᴀʀᴛ Hᴏsᴛɪɴɢ

<i>~ Pᴏᴡᴇʀᴇᴅ Bʏ Nᴇx Tᴇᴄʜ</i>`,
        '🟢');
}

function pointsDashboard(uid) {
    const u = usersDB[uid] || {};
    const tier = getUserTier(uid);
    const tierData = settings.tiers[tier];
    return premiumText('💰 Pᴏɪɴᴛs Dᴀsʜʙᴏᴀʀᴅ',
        `💎 Bᴀʟᴀɴᴄᴇ: ${u.points || 0} Pᴛs\n🏆 Tɪᴇʀ: ${tierData.name}\n📤 Dᴇᴘʟᴏʏᴍᴇɴᴛs: ${u.total_deployments || 0}\n📂 Fɪʟᴇs: ${(u.files || []).length}\n🎨 Tᴇᴍᴘʟᴀᴛᴇs: ${(u.templates || []).length}\n👥 Rᴇғᴇʀʀᴀʟs: ${u.referral_count || 0}\n🔥 Sᴛʀᴇᴀᴋ: ${u.daily_streak || 0}\n💸 Cᴏsᴛ/Bᴏᴛ: ${settings.hosting_cost} Pᴛs\n🎁 Rᴇғᴇʀʀᴀʟ: +${settings.points_per_referral} Pᴛs`,
        '💎');
}

function statsDashboard() {
    const totalUsers = Object.keys(usersDB).length;
    const activeUsers = Object.values(usersDB).filter(u => (u.files || []).length > 0).length;
    const totalBots = Object.keys(runningProcesses).length;
    const totalFiles = Object.values(usersDB).reduce((s, u) => s + (u.files?.length || 0), 0);
    const totalPoints = Object.values(usersDB).reduce((s, u) => s + (u.points || 0), 0);
    const totalTemplates = Object.keys(templatesDB).length;

    return premiumText('📊 ᴘʟᴀᴛғᴏʀᴍ Statistics',
        `👥 ᴜsᴇʀs: ${totalUsers}\n🔥 Aᴄᴛɪᴠᴇ: ${activeUsers}\n🤖 Rᴜɴɴɪɴɢ Bᴏᴛs: ${totalBots}\n📄 Tᴏᴛᴀʟ Fɪʟᴇs: ${totalFiles}\n💰 Tᴏᴛᴀʟ Pᴏɪɴᴛs: ${totalPoints}\n🎨 Tᴇᴍᴘʟᴀᴛᴇs: ${totalTemplates}`,
        '📊');
}

function referralMessage(uid) {
    const refLink = `https://t.me/${settings.bot_username || 'your_bot'}?start=${uid}`;
    const u = usersDB[uid] || {};
    return premiumText('🔗 ʀᴇғᴇʀʀᴀʟ sʏsᴛᴇᴍ',
        `💰 Bᴏɴᴜs: ${settings.points_per_referral} Pᴛs Pᴇʀ Fʀɪᴇɴᴅ\n👥 Tᴏᴛᴀʟ Rᴇғᴇʀʀᴀʟs: ${u.referral_count || 0}\n\n📎 <b>Yᴏᴜʀ Lɪɴᴋ:</b>\n<code>${refLink}</code>`,
        '🎯');
}

function questsMessage(uid) {
    const u = usersDB[uid] || {};
    let txt = '';
    for (const q of questsDB.quests) {
        let cur = 0;
        if (q.type === 'deploys') cur = u.total_deployments || 0;
        else if (q.type === 'referrals') cur = u.referral_count || 0;
        else if (q.type === 'streak') cur = u.daily_streak || 0;
        const done = econDB.quests[`${uid}_${q.id}`] ? '✅' : '⏳';
        txt += `${done} <b>${q.name}</b>\n   ${q.desc}\n   Pʀᴏɢʀᴇss: ${Math.min(cur, q.target)}/${q.target} • Rᴇᴡᴀʀᴅ: +${q.reward} Pᴛs\n\n`;
    }
    return premiumText('🏆 Qᴜᴇsᴛs', txt || 'Nᴏ Qᴜᴇsᴛs Aᴠᴀɪʟᴀʙʟᴇ', '🎯');
}


async function sendWelcome(chatId, user, isNew) {
    const uid = String(user.id);
    if (settings.welcome_video && isNew) {
        try {
            await bot.sendVideo(chatId, settings.welcome_video, {
                caption: welcomeMessage(user, isNew),
                parse_mode: 'HTML',
                reply_markup: mainKeyboard(uid)
            });
            return;
        } catch (e) { log('warn', 'welcome video failed', e.message); }
    }
    await bot.sendMessage(chatId, welcomeMessage(user, isNew), {
        parse_mode: 'HTML',
        reply_markup: mainKeyboard(uid)
    });
}

async function registerNewUser(msg, refId) {
    const uid = String(msg.from.id);
    const now = moment().format();
    usersDB[uid] = {
        points: 10,
        files: [],
        templates: [],
        joined: now,
        first_name: msg.from.first_name,
        username: msg.from.username,
        total_deployments: 0,
        referral_count: 0,
        daily_streak: 0,
        extra_slots: 0,
        tier: 'free'
    };
    saveDB();

    let referrerNotified = false;
    if (refId && usersDB[refId] && refId !== uid) {
        const bonus = referralRegister(uid, refId);
        if (bonus) {
            referrerNotified = true;
            try {
                bot.sendMessage(parseInt(refId),
                    premiumText('🎁 Rᴇғᴇʀʀᴀʟ Bᴏɴᴜs!', `Nᴇᴡ Usᴇʀ Jᴏɪɴᴇᴅ Vɪᴀ Yᴏᴜʀ Lɪɴᴋ!\n💰 +${bonus} points`, '🎉'),
                    { parse_mode: 'HTML' });
            } catch {}
        }
    }

    if (settings.new_user_notify) {
        notifyAdminNewUser(uid, msg.from.first_name, msg.from.username, referrerNotified ? refId : null);
    }

    return true;
}

function notifyAdminNewUser(userId, userName, username, referrer) {
    const ts = moment().format('YYYY-MM-DD HH:mm:ss');
    const total = Object.keys(usersDB).length;
    let txt = `\n<b>╔═══════════════════╗</b>\n<b>║  🆕 Nᴇᴡ Usᴇʀ Jᴏɪɴᴇᴅ</b>\n<b>╚═══════════════════╝</b>\n\n<blockquote>👤 <b>Iᴅ:</b> ${userId}\n📛 <b>Nᴀᴍᴇ:</b> ${esc(userName)}\n🔖 <b>Usᴇʀɴᴀᴍᴇ:</b> ${username ? '@' + esc(username) : 'N/A'}\n🕐 <b>Tɪᴍᴇ:</b> ${ts}</blockquote>\n\n<blockquote>📊 <b>Tᴏᴛᴀʟ Usᴇʀs:</b> ${total}\n🤖 <b>Rᴜɴɴɪɴɢ Bᴏᴛs:</b> ${Object.keys(runningProcesses).length}</blockquote>`;
    if (referrer) txt += `\n<blockquote>🔗 <b>Rᴇғғᴇʀᴇʀ:</b> ${referrer}</blockquote>`;
    try { bot.sendMessage(ADMIN_ID, txt, { parse_mode: 'HTML' }); } catch {}
}

/* 
𝖜𝖊𝖑𝖑 𝖜𝖊 𝖍𝖆𝖛𝖊 𝖈𝖔𝖒𝖊 𝖙𝖍𝖎𝖘 𝖋𝖆𝖗 𝖙𝖎𝖒𝖊 𝖋𝖔𝖗 𝖈𝖔𝖒𝖒𝖆𝖓𝖉𝖘 𝖓𝖔𝖙 𝖘𝖙𝖆𝖗𝖙𝖎𝖓𝖌 𝖜𝖎𝖙𝖍 𝖙𝖍𝖊 𝖒𝖆𝖎𝖓 𝖔𝖓𝖊 /𝖘𝖙𝖆𝖗𝖙 𝖈𝖔𝖒𝖒𝖆𝖓𝖉
*/

bot.onText(/\/start(.*)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const uid = String(msg.from.id);

    if (isMaintBlocked(uid)) {
        return bot.sendMessage(chatId, premiumText('🔧 Mᴀɪɴᴛᴇɴᴀɴᴄᴇ', 'Bᴏᴛ Is Uɴᴅᴇʀ Mᴀɪɴᴛᴇɴᴀɴᴄᴇ. Pʟᴇᴀsᴇ Tʀʏ Aɢᴀɪɴ Lᴀᴛᴇʀ.', '🔄'), { parse_mode: 'HTML' });
    }

    if (isBanned(uid)) {
        return bot.sendMessage(chatId, errorText('🚫 Banned',
            `Yᴏᴜ Aʀᴇ Bᴀɴɴᴇᴅ.\nRᴇᴀsᴏɴ: ${usersDB[uid]?.ban_reason || 'Unknown'}\n Cᴏɴᴛᴀᴄᴛ Sᴜᴘᴘᴏʀᴛ Fᴏʀ Aᴘᴘᴇᴀʟ .`), { parse_mode: 'HTML' });
    }

    // force join
    if (settings.force_join && !isAdmin(uid)) {
        const joined = await checkForceJoin(uid);
        if (!joined) {
            return bot.sendMessage(chatId,
                premiumText('📢 Jᴏɪɴ Cʜᴀɴɴᴇʟs',
                    '⚠️ <b>Kɪɴᴅʟʏ Jᴏɪɴ Tʜᴇsᴇ Cʜᴀɴɴᴇʟs Tᴏ Usᴇ Tʜɪs Bᴏᴛ!</b>\n\n👇 Jᴏɪɴ Aʟʟ Cʜᴀɴɴᴇʟs, Tʜᴇɴ Cʟɪᴄᴋ "ɪ Jᴏɪɴᴇᴅ".',
                    '🔒'),
                { parse_mode: 'HTML', reply_markup: getForceJoinKeyboard() });
        }
    }

    const isNew = !usersDB[uid];
    let refId = null;
    if (isNew) {
        const param = (match[1] || '').trim();
        if (param) refId = param;
        await registerNewUser(msg, refId);
    } else {
        usersDB[uid].first_name = msg.from.first_name;
        usersDB[uid].username = msg.from.username;
        saveDB();
    }

    if (!settings.bot_username) {
        try {
            const me = await bot.getMe();
            settings.bot_username = me.username;
            saveSettings();
        } catch {}
    }

    await sendWelcome(chatId, msg.from, isNew);
});

// ─── Deploy ───

bot.onText(/✦ Dᴇᴘʟᴏʏ Js/, async (msg) => {
    const chatId = msg.chat.id;
    const uid = String(msg.from.id);

    if (isMaintBlocked(uid)) return;
    if (isBanned(uid)) return bot.sendMessage(chatId, errorText('Banned', 'You Are Banned.'), { parse_mode: 'HTML' });

    if (settings.force_join && !isAdmin(uid)) {
        const joined = await checkForceJoin(uid);
        if (!joined) {
            return bot.sendMessage(chatId, premiumText('📢 Jᴏɪɴ Cʜᴀɴɴᴇʟs', '⚠️ Jᴏɪɴ Aʟʟ Cʜᴀɴɴᴇʟs Fɪʀsᴛ.', '🔒'),
                { parse_mode: 'HTML', reply_markup: getForceJoinKeyboard() });
        }
    }

    const points = usersDB[uid]?.points || 0;
    if (points < settings.hosting_cost) {
        return bot.sendMessage(chatId, premiumText('💎 Iɴsᴜғғɪᴄɪᴇɴᴛ Pᴏɪɴᴛs',
            `💰 Bᴀʟᴀɴᴄᴇ: ${points}\n💎 Rᴇǫᴜɪʀᴇᴅ: ${settings.hosting_cost}\n\n💡 Rᴇғᴇʀ Fʀɪᴇɴᴅs Oʀ Sᴘɪɴ Dᴀɪʟʏ!`),
            { parse_mode: 'HTML' });
    }

    const activeBots = Object.values(runningProcesses).filter(p => p.userId === uid).length;
    const totalFiles = (usersDB[uid].files || []).length;
    const maxBots = getMaxBots(uid);
    if (totalFiles >= maxBots) {
        return bot.sendMessage(chatId, errorText('Bᴏᴛ Lɪᴍɪᴛ Rᴇᴀᴄʜᴇᴅ',
            `📊 Yᴏᴜʀ Lɪᴍɪᴛ: ${maxBots}\n📂 Cᴜʀʀᴇɴᴛ: ${totalFiles}\n\n💡 Uᴘɢʀᴀᴅᴇ Tɪᴇʀ Oʀ Bᴜʏ Exᴛʀᴀ Sʟᴏᴛs Iɴ Sᴛᴏʀᴇ.`),
            { parse_mode: 'HTML' });
    }

    const rl = rateLimit(uid, 'deploy', settings.rate_limit_deploys, settings.rate_limit_window_min);
    if (!rl.allowed) {
        return bot.sendMessage(chatId, warnText('🚦 Rᴀᴛᴇ Lɪᴍɪᴛᴇᴅ',
            `Tᴏᴏ Mᴀɴʏ Dᴇᴘʟᴏʏs. Tʀʏ Aɢᴀɪɴ Iɴ ${rl.waitMin} min.`), { parse_mode: 'HTML' });
    }

    userStates[uid] = { action: 'awaiting_deploy_file', ts: Date.now() };

    if (settings.deploy_approval && !isAdmin(uid)) {
        userStates[uid].needsApproval = true;
    }

    await bot.sendMessage(chatId, deployPromptMessage(uid), { parse_mode: 'HTML' });
});

// Document handler
bot.on('document', async (msg) => {
    const uid = String(msg.from.id);
    const state = userStates[uid];
    if (!state || state.action !== 'awaiting_deploy_file') return;
    delete userStates[uid];
    await processUpload(msg);
});

async function processUpload(msg) {
    const chatId = msg.chat.id;
    const uid = String(msg.from.id);

    if (!msg.document) return;
    const fileName = msg.document.file_name || `file_${Date.now()}.js`;
    const fileSize = msg.document.file_size || 0;

    if (fileSize > 20 * 1024 * 1024) {
        return bot.sendMessage(chatId, errorText('Fɪʟᴇ Tᴏᴏ Lᴀʀɢᴇ', 'Mᴀx 20Mʙ.'), { parse_mode: 'HTML' });
    }

    const validExts = ['.js', '.zip'];
    if (!validExts.some(e => fileName.toLowerCase().endsWith(e))) {
        return bot.sendMessage(chatId, errorText('Wʀᴏɴɢ Fᴏʀᴍᴀᴛ', 'Oɴʟʏ .Js Aɴᴅ .Zɪᴘ Aʟʟᴏᴡᴇᴅ.'), { parse_mode: 'HTML' });
    }

    const progMsg = await bot.sendMessage(chatId, premiumText('⏳ Pʀᴏᴄᴇssɪɴɢ...', `📦 ${esc(fileName)}\n⏳ Dᴏᴡɴʟᴏᴀᴅɪɴɢ...`, '⚙️'), { parse_mode: 'HTML' });

    try {
        let buf;
        try { buf = await fetchTelegramFile(msg.document.file_id); }
        catch (e) {
            return bot.editMessageText(errorText('Dᴏᴡɴʟᴏᴀᴅ Fᴀɪʟᴇᴅ', 'Tʀʏ Uᴘʟᴏᴀᴅɪɴɢ Aɢᴀɪɴ.'), {
                chat_id: chatId, message_id: progMsg.message_id, parse_mode: 'HTML'
            });
        }

        const fHash = hashBuffer(buf);
        const existing = (usersDB[uid].file_hashes || {})[fHash];
        if (existing) {
            return bot.editMessageText(warnText('Dᴜᴘʟɪᴄᴀᴛᴇ Fɪʟᴇ',
                `You Aʟʀᴇᴀᴅʏ Dᴇᴘʟᴏʏᴇᴅ Tʜɪs Fɪʟᴇ As <b>${esc(existing)}</b>.`),
                { chat_id: chatId, message_id: progMsg.message_id, parse_mode: 'HTML' });
        }

        const safeName = fileName.replace(/[^\w.\-]/g, '_');
        const savePath = path.join(DEPLOY_DIR, `${uid}_${safeName}`);
        const absSavePath = path.resolve(savePath);
        fs.writeFileSync(absSavePath, buf);

        let finalPath = absSavePath;
        let finalName = safeName;

        if (safeName.endsWith('.zip')) {
            await bot.editMessageText(premiumText('⏳ Pʀᴏᴄᴇssɪɴɢ...', '📦 Exᴛʀᴀᴄᴛɪɴɢ Zɪᴘ...', '⚙️'),
                { chat_id: chatId, message_id: progMsg.message_id, parse_mode: 'HTML' });

            const extractDir = path.join(DEPLOY_DIR, `${uid}_${safeName.replace('.zip', '')}_${Date.now()}`);
            const absExtractDir = path.resolve(extractDir);
            fs.mkdirSync(absExtractDir, { recursive: true });

            try {
                const zip = new AdmZip(absSavePath);
                const validation = validateZip(zip, absExtractDir);
                if (!validation.ok) {
                    fs.unlinkSync(absSavePath);
                    return bot.editMessageText(errorText('Sᴇᴄᴜʀɪᴛʏ Bʟᴏᴄᴋ', `Sᴜsᴘɪᴄɪᴏᴜs Pᴀᴛʜ: ${validation.reason}`),
                        { chat_id: chatId, message_id: progMsg.message_id, parse_mode: 'HTML' });
                }
                zip.extractAllTo(absExtractDir, true);
                fs.unlinkSync(absSavePath);
            } catch (e) {
                return bot.editMessageText(errorText('Iɴᴠᴀʟɪᴅ Zɪᴘ', e.message),
                    { chat_id: chatId, message_id: progMsg.message_id, parse_mode: 'HTML' });
            }

            const jsFiles = walkDir(absExtractDir, ['.js']);
            if (jsFiles.length === 0) {
                return bot.editMessageText(errorText('Nᴏ Js Fɪʟᴇ', 'Aʀᴄʜɪᴠᴇ Hᴀs Nᴏ .Js Fɪʟᴇ.'),
                    { chat_id: chatId, message_id: progMsg.message_id, parse_mode: 'HTML' });
            }
            finalPath = pickMainJs(jsFiles);
            finalName = path.basename(finalPath);
        }

        if (!finalName.endsWith('.js')) {
            return bot.editMessageText(errorText('Wʀᴏɴɢ Fᴏʀᴍᴀᴛ', 'Mᴀɪɴ Fɪʟᴇ Mᴜsᴛ Bᴇ .Js'),
                { chat_id: chatId, message_id: progMsg.message_id, parse_mode: 'HTML' });
        }

        await bot.editMessageText(premiumText('⏳ Pʀᴏᴄᴇssɪɴɢ...', '📦 Iɴsᴛᴀʟʟɪɴɢ Dᴇᴘᴇɴᴅᴇɴᴄɪᴇs...', '⚙️'),
            { chat_id: chatId, message_id: progMsg.message_id, parse_mode: 'HTML' });

        const installRes = await installNodeDeps(path.dirname(finalPath));
        if (!installRes.success) {
            log('warn', `deps failed for ${uid}:`, installRes.msg);
        }

        if (settings.deploy_approval && !isAdmin(uid)) {
            pendingApprovals[`${uid}_${finalName}`] = {
                uid, fName: finalName, fPath: finalPath, ts: Date.now()
            };
            try {
                await bot.sendMessage(ADMIN_ID, premiumText('🛡 Aᴘᴘʀᴏᴠᴀʟ Nᴇᴇᴅᴇᴅ',
                    `👤 Usᴇʀ: <a href="tg://user?id=${uid}">${uid}</a>\n📄 Fɪʟᴇ: ${esc(finalName)}`,
                    '🔔'), {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '✅ Approve', callback_data: `appr_${uid}_${finalName}`, style: 'success' },
                             { text: '❌ Reject', callback_data: `rej_${uid}_${finalName}`, style: 'danger' }]
                        ]
                    }
                });
            } catch {}
            return bot.editMessageText(infoText('⏳ Pᴇɴᴅɪɴɢ Aᴘᴘʀᴏᴠᴀʟ', 'Yᴏᴜʀ Bᴏᴛ Is Aᴡᴀɪᴛɪɴɢ Aᴅᴍɪɴ Aᴘᴘʀᴏᴠᴀʟ.'),
                { chat_id: chatId, message_id: progMsg.message_id, parse_mode: 'HTML' });
        }

        const runRes = await runUserFile(finalPath, parseInt(uid), finalName);

        if (runRes.success) {
            if (!usersDB[uid].files.includes(finalName)) usersDB[uid].files.push(finalName);
            if (!usersDB[uid].file_hashes) usersDB[uid].file_hashes = {};
            usersDB[uid].file_hashes[fHash] = finalName;
            usersDB[uid].points -= settings.hosting_cost;
            usersDB[uid].total_deployments = (usersDB[uid].total_deployments || 0) + 1;
            saveDB();

            const completed = checkQuestProgress(uid);

            await bot.editMessageText(successText('Dᴇᴘʟᴏʏᴍᴇɴᴛ Sᴜᴄᴄᴇssғᴜʟ!',
                `📄 <b>${esc(finalName)}</b>\n🟢 Sᴛᴀᴛᴜs: Rᴜɴɴɪɴɢ\n📊 Pɪᴅ: ${runRes.pid}\n💰 Rᴇᴍᴀɪɴɪɴɢ: ${usersDB[uid].points} Pᴛs${completed.length ? `\n\n🏆 <b>Qᴜᴇsᴛs Cᴏᴍᴘʟᴇᴛᴇ!</b>\n${completed.map(q => `• ${q.name} (+${q.reward})`).join('\n')}` : ''}`),
                { chat_id: chatId, message_id: progMsg.message_id, parse_mode: 'HTML' });

            announceDeployment(parseInt(uid), finalName);
        } else {
            await bot.editMessageText(errorText('Dᴇᴘʟᴏʏᴍᴇɴᴛ Fᴀɪʟᴇᴅ',
                `📄 ${esc(finalName)}\n❌ ${esc(runRes.status.slice(0, 400))}`),
                { chat_id: chatId, message_id: progMsg.message_id, parse_mode: 'HTML' });
        }
    } catch (e) {
        log('error', 'upload error:', e.message);
        try {
            bot.editMessageText(errorText('Error', esc(e.message)),
                { chat_id: chatId, message_id: progMsg.message_id, parse_mode: 'HTML' });
        } catch {}
    }
}

async function announceDeployment(userId, fileName) {
    try {
        const user = await bot.getChat(userId);
        const name = esc(user.first_name || 'User');
        const mention = `<a href="tg://user?id=${userId}">${name}</a>`;
        const ts = moment().format('YYYY-MM-DD HH:mm:ss');
        const txt = `\n<b>╔══════════════════╗</b>\n<b>║✦NⒺⓌ BⓄⓉ DⒺⓅⓁⓄⓎⒺⒹ✦</b>\n<b>╚══════════════════╝</b>\n\n<blockquote>👤 <b>Dᴇᴘʟᴏʏᴇᴅ Bʏ:</b> ${mention}\n📄 <b>Fɪʟᴇ:</b> ${esc(fileName)}\n🕐 <b>Tɪᴍᴇ:</b> ${ts}\n⚡ <b>Sᴛᴀᴛᴜs:</b> 🟢 Rᴜɴɴɪɴɢ\n📂 <b>Tʏᴘᴇ:</b> Jᴀᴠᴀsᴄʀɪᴘᴛ</blockquote>\n\n<blockquote>━━━━━━━━━━━━━━━━━━━━━━━\n🎯 <b>DⒺⓅⓁⓄⓎ YⓄⓊⓇⓈ NⓄⓌ</b>\n💡 Nᴇx Tᴇᴄʜ 24/7 Cʟᴏᴜᴅ Hᴏsᴛɪɴɢ\n⚡ Fᴀsᴛ & Rᴇʟɪᴀʙʟᴇ\n🛡️ Sᴇᴄᴜʀᴇ Dᴇᴘʟᴏʏᴍᴇɴᴛ\n━━━━━━━━━━━━━━━━━━━━━━━</blockquote>`;
        await bot.sendMessage(CHANNEL_ID, txt, {
            parse_mode: 'HTML',
            reply_markup: { inline_keyboard: [[{ text: '🚀 Dᴇᴘʟᴏʏ Nᴏᴡ', url: `https://t.me/${settings.bot_username || 'your_bot'}` }]] }
        });
    } catch (e) { log('warn', 'announce failed', e.message); }
}

// ─── Menu button handlers ───

bot.onText(/✦ Tᴇᴍᴘʟᴀᴛᴇs/, async (msg) => {
    const chatId = msg.chat.id;
    const uid = String(msg.from.id);
    if (isBanned(uid) || isMaintBlocked(uid)) return;
    userStates[uid] = { action: 'browsing_templates' };
    bot.sendMessage(chatId, premiumText('🎨 Tᴇᴍᴘʟᴀᴛᴇs Mᴀʀᴋᴇᴛᴘʟᴀᴄᴇ',
        'Bʀᴏᴡsᴇ Pʀᴇ-Mᴀᴅᴇ Bᴏᴛ Tᴇᴍᴘʟᴀᴛᴇs.\n💎 Bᴜʏ Oɴᴄᴇ, Dᴇᴘʟᴏʏ Fᴏʀᴇᴠᴇʀ!', '🛍'),
        { parse_mode: 'HTML', reply_markup: templatesCategoriesKeyboard() });
});

bot.onText(/✦ Mʏ Fɪʟᴇs/, async (msg) => {
    const chatId = msg.chat.id;
    const uid = String(msg.from.id);
    if (isBanned(uid) || isMaintBlocked(uid)) return;

    const files = usersDB[uid]?.files || [];
    if (files.length === 0) {
        return bot.sendMessage(chatId, infoText('📂 Nᴏ Fɪʟᴇ Fᴏᴜɴᴅ', 'Usᴇ <b>✦ Dᴇᴘʟᴏʏ Js</b> Oʀ <b>✦ Tᴇᴍᴘʟᴀᴛᴇs</b>!'), { parse_mode: 'HTML' });
    }

    for (const fName of files) {
        const fPath = path.join(DEPLOY_DIR, `${uid}_${fName}`);
        const abs = path.resolve(fPath);
        const info = runningProcesses[abs];
        const isRunning = info && info.process.exitCode === null;
        const status = isRunning ? '🟢 Running' : '🔴 Stopped';
        const pid = isRunning ? info.pid : 'N/A';
        let runtime = '';
        if (isRunning) {
            const mins = Math.floor((Date.now() - info.startTime) / 60000);
            runtime = `\n⏱️ ${mins}m`;
        }
        const health = getHealthScore(uid, fName);
        bot.sendMessage(chatId,
            premiumText(`📄 ${esc(fName)}`,
                `Sᴛᴀᴛᴜs: ${status}\nPɪᴅ: ${pid}\n❤️ Hᴇᴀʟᴛʜ: ${health}/100${runtime}`,
                '🤖'),
            { parse_mode: 'HTML', reply_markup: fileActionsKeyboard(fName, uid) });
    }
});

bot.onText(/✦ Pᴏɪɴᴛs/, async (msg) => {
    const uid = String(msg.from.id);
    if (isBanned(uid) || isMaintBlocked(uid)) return;
    bot.sendMessage(msg.chat.id, pointsDashboard(uid), { parse_mode: 'HTML' });
});

bot.onText(/✦ Sᴛᴀᴛs/, async (msg) => {
    const uid = String(msg.from.id);
    if (isBanned(uid) || isMaintBlocked(uid)) return;
    bot.sendMessage(msg.chat.id, statsDashboard(), { parse_mode: 'HTML' });
});

bot.onText(/✦ Rᴇғᴇʀʀᴀʟ/, async (msg) => {
    const uid = String(msg.from.id);
    if (isBanned(uid) || isMaintBlocked(uid)) return;
    bot.sendMessage(msg.chat.id, referralMessage(uid), { parse_mode: 'HTML' });
});

bot.onText(/✦ Dᴀɪʟʏ/, async (msg) => {
    const chatId = msg.chat.id;
    const uid = String(msg.from.id);
    if (isBanned(uid) || isMaintBlocked(uid)) return;

    const r = claimDaily(uid);
    if (!r.ok) {
        return bot.sendMessage(chatId, infoText('⏳ Dᴀɪʟʏ', r.msg || 'Cᴏᴍᴇ Bᴀᴄᴋ Tᴏᴍᴏʀʀᴏᴡ!'), { parse_mode: 'HTML' });
    }
    const completed = checkQuestProgress(uid);
    bot.sendMessage(chatId, premiumText('🎉 Dᴀɪʟʏ Cʟᴀɪᴍᴇᴅ!',
        `💰 +${r.reward} Pᴏɪɴᴛs\n🔥 Sᴛʀᴇᴀᴋ: ${r.streak} Dᴀʏs\n💎 Nᴇᴡ Bᴀʟᴀɴᴄᴇ: ${usersDB[uid].points} Pᴛs${completed.length ? `\n\n🏆 Qᴜᴇsᴛs: ${completed.map(q => q.name).join(', ')}` : ''}`,
        '⭐'), { parse_mode: 'HTML' });
});

bot.onText(/✦ Sᴘɪɴ/, async (msg) => {
    const chatId = msg.chat.id;
    const uid = String(msg.from.id);
    if (isBanned(uid) || isMaintBlocked(uid)) return;

    const r = doSpin(uid);
    if (!r.ok) {
        return bot.sendMessage(chatId, infoText('⏳ Cᴏᴏʟᴅᴏᴡɴ', `Tʀʏ Aɢᴀɪɴ Iɴ ${r.waitH}Hʀ`), { parse_mode: 'HTML' });
    }
    bot.sendMessage(chatId, premiumText('🎡 Sᴘɪɴ Rᴇsᴜʟᴛ',
        `🎉 Yᴏᴜ Wᴏɴ <b>+${r.reward} Pᴏɪɴᴛs</b>!\n💎 Bᴀʟᴀɴᴄᴇ: ${usersDB[uid].points} Pᴛs`, '🎰'), { parse_mode: 'HTML' });
});

bot.onText(/✦ Sᴄʀᴀᴛᴄʜ/, async (msg) => {
    const chatId = msg.chat.id;
    const uid = String(msg.from.id);
    if (isBanned(uid) || isMaintBlocked(uid)) return;

    const r = doScratch(uid);
    if (!r.ok) {
        return bot.sendMessage(chatId, errorText('Sᴄʀᴀᴛᴄʜ Fᴀɪʟᴇᴅ', r.msg || 'Tʀʏ Lᴀᴛᴇʀ'), { parse_mode: 'HTML' });
    }
    bot.sendMessage(chatId, premiumText('🎫 Sᴄʀᴀᴛᴄʜ Cᴀʀᴅ',
        `💸 Cᴏsᴛ: ${r.cost} Pᴛs\n🎁 Wᴏɴ: ${r.reward} Pᴛs\n💎 Bᴀʟᴀɴᴄᴇ: ${usersDB[uid].points} Pᴛs`, '🎟'),
        { parse_mode: 'HTML' });
});

bot.onText(/✦ Sᴛᴏʀᴇ/, async (msg) => {
    const uid = String(msg.from.id);
    if (isBanned(uid) || isMaintBlocked(uid)) return;
    bot.sendMessage(msg.chat.id, premiumText('🛒 ᴘᴏɪɴᴛs sᴛᴏʀᴇ',
        `💎 Bᴀʟᴀɴᴄᴇ: ${usersDB[uid].points} Pᴛs\n\nBᴜʏ Uᴘɢʀᴀᴅᴇs Bᴇʟᴏᴡ!`, '💎'),
        { parse_mode: 'HTML', reply_markup: storeKeyboard() });
});

bot.onText(/✦ Qᴜᴇsᴛs/, async (msg) => {
    const uid = String(msg.from.id);
    if (isBanned(uid) || isMaintBlocked(uid)) return;
    bot.sendMessage(msg.chat.id, questsMessage(uid), { parse_mode: 'HTML' });
});

bot.onText(/✦ Cᴏᴜᴘᴏɴs/, async (msg) => {
    const chatId = msg.chat.id;
    const uid = String(msg.from.id);
    if (isBanned(uid) || isMaintBlocked(uid)) return;
    userStates[uid] = { action: 'awaiting_coupon' };
    bot.sendMessage(chatId, premiumText('🎟 Rᴇᴅᴇᴇᴍ Cᴏᴜᴘᴏɴ', 'Sᴇɴᴅ Yᴏᴜʀ Cᴏᴜᴘᴏɴ Cᴏᴅᴇ:', '📩'), { parse_mode: 'HTML' });
});

bot.onText(/✦ Gɪғᴛ/, async (msg) => {
    const chatId = msg.chat.id;
    const uid = String(msg.from.id);
    if (isBanned(uid) || isMaintBlocked(uid)) return;
    userStates[uid] = { action: 'gift_userid' };
    bot.sendMessage(chatId, premiumText('🎁 Gɪғᴛ Pᴏɪɴᴛs', 'Sᴇɴᴅ Tᴀʀɢᴇᴛ Usᴇʀ Iᴅ:', '💝'), { parse_mode: 'HTML' });
});

bot.onText(/✦ Lᴏɢs/, async (msg) => {
    const chatId = msg.chat.id;
    const uid = String(msg.from.id);
    if (isBanned(uid) || isMaintBlocked(uid)) return;

    const kb = logsListKeyboard(uid);
    if (!kb) return bot.sendMessage(chatId, infoText('📋 Nᴏ Lᴏɢs', 'Nᴏ Bᴏᴛs Dᴇᴘʟᴏʏᴇᴅ Yᴇᴛ.'), { parse_mode: 'HTML' });
    bot.sendMessage(chatId, premiumText('📋 Vɪᴇᴡ Lᴏɢs', 'Sᴇʟᴇᴄᴛ A Bᴏᴛ:', '📜'),
        { parse_mode: 'HTML', reply_markup: kb });
});

bot.onText(/✦ Sᴜᴘᴘᴏʀᴛ/, async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, premiumText('📞 Support Center',
        `👤 Oᴡɴᴇʀ: @NEX_CONTACT_AGENT_BOT\n📢 Cʜᴀɴɴᴇʟ: ${CHANNEL_ID}\n\n💡 Js Bᴏᴛ Oɴʟʏ!\n🕐 Rᴇsᴘᴏɴsᴇ Wɪᴛʜɪɴ 24Hʀ`,
        '💬'), { parse_mode: 'HTML' });
});

bot.onText(/✦ Mᴏʀᴇ Bᴏᴛs/, async (msg) => {
    bot.sendMessage(msg.chat.id, premiumText('ᴍᴏʀᴇ ʙᴏᴛs',
        `Nᴇx Tᴇᴄʜ Iɴᴄ\n\n<a href="https://t.me/will add later">Nᴇx Vɪᴛᴜᴀʟ Nᴜᴍʙᴇʀ Rᴏʙᴏᴛ</a> 🟢\n\n<a href="https://t.me/Premiun_Cloud_Hosting_Js_Robot">ᴘʀᴇᴍɪᴜᴍ ᴄʟᴏᴜᴅ ʜᴏsᴛɪɴɢ ┈ᴊs┈</a> 🟢\n\n• More Coming Soon ⚡️`,
        '🔮'), { parse_mode: 'HTML' });
});

// ─── Text state handler ───
bot.on('text', async (msg) => {
    const chatId = msg.chat.id;
    const uid = String(msg.from.id);
    const state = userStates[uid];
    if (!state || !state.action) return;

    const txt = msg.text || '';

    // ── ADMIN STATES ──
    if (isAdmin(uid) && state.action.startsWith('adm_')) {
        delete userStates[uid];

        if (state.action === 'adm_add_pts_userid') { state.targetId = txt.trim(); state.action = 'adm_add_pts_amount'; userStates[uid] = state; return bot.sendMessage(chatId, premiumText('💰 Amount', 'Enter points to add:', '💎'), { parse_mode: 'HTML' }); }
        if (state.action === 'adm_add_pts_amount') {
            const amt = parseInt(txt);
            if (isNaN(amt) || amt <= 0) return bot.sendMessage(chatId, errorText('Invalid', 'Number required'), { parse_mode: 'HTML' });
            if (!addPoints(state.targetId, amt)) return bot.sendMessage(chatId, errorText('Failed', 'User not found'), { parse_mode: 'HTML' });
            adminLog('add_pts', uid, { target: state.targetId, amount: amt });
            bot.sendMessage(chatId, successText('Points Added', `+${amt} to ${state.targetId}\nNew: ${usersDB[state.targetId].points}`), { parse_mode: 'HTML' });
            try { bot.sendMessage(parseInt(state.targetId), premiumText('💰 ᴘᴏɪɴᴛs ᴀᴅᴅᴇᴅ', `+${amt} ᴘᴏɪɴᴛs ғʀᴏᴍ ᴀᴅᴍɪɴ`, '🎁'), { parse_mode: 'HTML' }); } catch {}
            return;
        }
        if (state.action === 'adm_sub_pts_userid') { state.targetId = txt.trim(); state.action = 'adm_sub_pts_amount'; userStates[uid] = state; return bot.sendMessage(chatId, premiumText('💰 Amount', 'Enter points to subtract:', '💎'), { parse_mode: 'HTML' }); }
        if (state.action === 'adm_sub_pts_amount') {
            const amt = parseInt(txt);
            if (isNaN(amt) || amt <= 0) return bot.sendMessage(chatId, errorText('Invalid', 'Number required'), { parse_mode: 'HTML' });
            if (!subtractPoints(state.targetId, amt)) return bot.sendMessage(chatId, errorText('Failed', 'User not found'), { parse_mode: 'HTML' });
            adminLog('sub_pts', uid, { target: state.targetId, amount: amt });
            bot.sendMessage(chatId, successText('Points Subtracted', `-${amt} from ${state.targetId}\nNew: ${usersDB[state.targetId].points}`), { parse_mode: 'HTML' });
            return;
        }
        if (state.action === 'adm_set_pts_userid') { state.targetId = txt.trim(); state.action = 'adm_set_pts_amount'; userStates[uid] = state; return bot.sendMessage(chatId, premiumText('💰 Amount', 'Enter new points value:', '💎'), { parse_mode: 'HTML' }); }
        if (state.action === 'adm_set_pts_amount') {
            const amt = parseInt(txt);
            if (isNaN(amt) || amt < 0) return bot.sendMessage(chatId, errorText('Invalid', 'Number required'), { parse_mode: 'HTML' });
            if (!setPoints(state.targetId, amt)) return bot.sendMessage(chatId, errorText('Failed', 'User not found'), { parse_mode: 'HTML' });
            adminLog('set_pts', uid, { target: state.targetId, amount: amt });
            bot.sendMessage(chatId, successText('Points Set', `${state.targetId} = ${amt}`), { parse_mode: 'HTML' });
            return;
        }
        if (state.action === 'adm_global_add_amount') {
            const amt = parseInt(txt);
            if (isNaN(amt) || amt <= 0) return bot.sendMessage(chatId, errorText('Invalid', 'Number required'), { parse_mode: 'HTML' });
            const n = globalAddPoints(amt);
            adminLog('global_add', uid, { amount: amt, users: n });
            bot.sendMessage(chatId, successText('Global Add Done', `+${amt} to ${n} users\nTotal: ${amt * n}`), { parse_mode: 'HTML' });
            return;
        }
        if (state.action === 'adm_ban_userid') { state.targetId = txt.trim(); state.action = 'adm_ban_reason'; userStates[uid] = state; return bot.sendMessage(chatId, premiumText('📝 Reason', 'Enter ban reason:', '⚠️'), { parse_mode: 'HTML' }); }
        if (state.action === 'adm_ban_reason') {
            if (!banUser(state.targetId, txt)) return bot.sendMessage(chatId, errorText('Failed', 'User not found'), { parse_mode: 'HTML' });
            adminLog('ban', uid, { target: state.targetId, reason: txt });
            bot.sendMessage(chatId, successText('User Banned', `${state.targetId}\nReason: ${esc(txt)}`), { parse_mode: 'HTML' });
            try { bot.sendMessage(parseInt(state.targetId), errorText('🚫 Banned', `Reason: ${esc(txt)}`), { parse_mode: 'HTML' }); } catch {}
            return;
        }
        if (state.action === 'adm_unban_userid') {
            if (!unbanUser(txt.trim())) return bot.sendMessage(chatId, errorText('Failed', 'User not found'), { parse_mode: 'HTML' });
            adminLog('unban', uid, { target: txt.trim() });
            bot.sendMessage(chatId, successText('Unbanned', txt.trim()), { parse_mode: 'HTML' });
            try { bot.sendMessage(parseInt(txt.trim()), successText('Unbanned', 'You can use the bot again.'), { parse_mode: 'HTML' }); } catch {}
            return;
        }
        if (state.action === 'adm_search_query') {
            const res = searchUsers(txt);
            if (!res.length) return bot.sendMessage(chatId, infoText('No Results', `No users match "${esc(txt)}"`), { parse_mode: 'HTML' });
            let out = '';
            for (const u of res) out += `👤 <code>${u.uid}</code> — ${esc(u.first_name || 'N/A')}${u.username ? ' (@' + esc(u.username) + ')' : ''}\n💰 ${u.points || 0} pts\n\n`;
            bot.sendMessage(chatId, premiumText('🔍 Search Results', out.slice(0, 3500), '🔎'), { parse_mode: 'HTML' });
            return;
        }
        if (state.action === 'adm_report_uid') {
            const r = await generateUserReport(txt.trim());
            bot.sendMessage(chatId, premiumText('📋 User Report', r, '📊'), { parse_mode: 'HTML' });
            return;
        }
        if (state.action === 'adm_impersonate_uid') {
            const target = txt.trim();
            if (!usersDB[target]) return bot.sendMessage(chatId, errorText('Not Found', 'Invalid user'), { parse_mode: 'HTML' });
            const u = usersDB[target];
            const myBots = Object.values(runningProcesses).filter(p => p.userId === String(target));
            bot.sendMessage(chatId, premiumText(`🎭 Viewing as ${target}`,
                `👤 ${esc(u.first_name || 'N/A')}\n💰 Points: ${u.points || 0}\n🏆 Tier: ${getUserTier(target)}\n📤 Deploys: ${u.total_deployments || 0}\n🤖 Active Bots: ${myBots.length}\n🚫 Banned: ${u.banned ? 'Yes' : 'No'}`,
                '👁'), { parse_mode: 'HTML' });
            return;
        }
        if (state.action === 'adm_limits_uid') {
            const parts = txt.split(/\s+/);
            if (parts.length !== 2) return bot.sendMessage(chatId, errorText('Format', 'USER_ID LIMIT'), { parse_mode: 'HTML' });
            const [targetUid, lim] = parts;
            const limit = parseInt(lim);
            if (isNaN(limit) || limit < 0) return bot.sendMessage(chatId, errorText('Invalid', 'Bad limit'), { parse_mode: 'HTML' });
            if (!setUserLimit(targetUid, limit)) return bot.sendMessage(chatId, errorText('Failed', 'User not found'), { parse_mode: 'HTML' });
            adminLog('set_limit', uid, { target: targetUid, limit });
            bot.sendMessage(chatId, successText('Limit Set', `${targetUid} → ${limit}`), { parse_mode: 'HTML' });
            return;
        }
        if (state.action === 'adm_coupon_code') {
            const parts = txt.split(/\s+/);
            if (parts.length !== 3) return bot.sendMessage(chatId, errorText('Format', 'CODE REWARD MAX'), { parse_mode: 'HTML' });
            const [code, reward, max] = parts;
            const r = parseInt(reward), m = parseInt(max);
            if (isNaN(r) || isNaN(m) || r <= 0 || m <= 0) return bot.sendMessage(chatId, errorText('Invalid', 'Bad numbers'), { parse_mode: 'HTML' });
            couponsDB[code.toUpperCase()] = { reward: r, max_uses: m, uses: 0, used_by: [], created: moment().format() };
            saveCoupons();
            adminLog('create_coupon', uid, { code: code.toUpperCase(), reward: r, max: m });
            bot.sendMessage(chatId, successText('Coupon Created', `Code: <code>${esc(code.toUpperCase())}</code>\nReward: ${r} pts\nMax Uses: ${m}`), { parse_mode: 'HTML' });
            return;
        }
        if (state.action === 'adm_template_name') { state.tplName = txt; state.action = 'adm_template_cat'; userStates[uid] = state; return bot.sendMessage(chatId, premiumText('📁 Category', 'Send category name (e.g. Utility, Crypto):', '🎨'), { parse_mode: 'HTML' }); }
        if (state.action === 'adm_template_cat') { state.tplCat = txt; state.action = 'adm_template_price'; userStates[uid] = state; return bot.sendMessage(chatId, premiumText('💎 Price', 'Send price in points:', '💰'), { parse_mode: 'HTML' }); }
        if (state.action === 'adm_template_price') {
            const p = parseInt(txt);
            if (isNaN(p) || p < 0) return bot.sendMessage(chatId, errorText('Invalid', 'Number required'), { parse_mode: 'HTML' });
            state.tplPrice = p; state.action = 'adm_template_desc'; userStates[uid] = state;
            return bot.sendMessage(chatId, premiumText('📝 Description', 'Send description:', '✍️'), { parse_mode: 'HTML' });
        }
        if (state.action === 'adm_template_desc') { state.tplDesc = txt; state.action = 'adm_template_code'; userStates[uid] = state; return bot.sendMessage(chatId, premiumText('💻 Code', 'Send the .js code as text (or upload as file):', '📄'), { parse_mode: 'HTML' }); }
        if (state.action === 'adm_template_code') {
            const code = txt;
            const key = state.tplName.toLowerCase().replace(/[^\w]/g, '_') + '_' + Date.now();
            templatesDB[key] = { name: state.tplName, cat: state.tplCat, price: state.tplPrice, desc: state.tplDesc, requires_env: 'TOKEN', code };
            saveTemplates();
            adminLog('add_template', uid, { key, name: state.tplName });
            bot.sendMessage(chatId, successText('Template Added', `Key: <code>${key}</code>\nName: ${esc(state.tplName)}`), { parse_mode: 'HTML' });
            return;
        }
        if (state.action === 'adm_broadcast') {
            bot.sendMessage(chatId, infoText('📢 Sending...', 'Broadcasting now'), { parse_mode: 'HTML' });
            const r = await broadcastToAll(txt, uid);
            bot.sendMessage(chatId, successText('Broadcast Done', `✅ Sent: ${r.sent}\n❌ Failed: ${r.failed}`), { parse_mode: 'HTML' });
            return;
        }
        return;
    }

    // ── USER STATES ──
    if (state.action === 'awaiting_coupon') {
        delete userStates[uid];
        const r = redeemCoupon(uid, txt.trim());
        if (r.ok) bot.sendMessage(chatId, successText('ᴄᴏᴜᴘᴏɴ ʀᴇᴅᴇᴇᴍᴇᴅ', `💰 +${r.reward} ᴘᴏɪɴᴛs`), { parse_mode: 'HTML' });
        else bot.sendMessage(chatId, errorText('ᴄᴏᴜᴘᴏɴ ғᴀɪʟᴇᴅ', r.msg), { parse_mode: 'HTML' });
        return;
    }
    if (state.action === 'gift_userid') {
        state.targetId = txt.trim(); state.action = 'gift_amount'; userStates[uid] = state;
        return bot.sendMessage(chatId, premiumText('💝 Aᴍᴏᴜɴᴛ', 'ᴇɴᴛᴇʀ ᴘᴏɪɴᴛs ᴛᴏ ɢɪғᴛ:', '💰'), { parse_mode: 'HTML' });
    }
    if (state.action === 'gift_amount') {
        delete userStates[uid];
        const amount = parseInt(txt);
        if (isNaN(amount) || amount <= 0) return bot.sendMessage(chatId, errorText('Iɴᴠᴀʟɪᴅ', 'ᴇɴᴛᴇʀ ᴀ ɴᴜᴍʙᴇʀ'), { parse_mode: 'HTML' });
        const r = giftPoints(uid, state.targetId, amount);
        if (r.ok) {
            bot.sendMessage(chatId, successText('ɢɪғᴛ sᴇɴᴛ', `Gɪғᴛᴇᴅ ${amount} ᴘᴛs ᴛᴏ ${state.targetId}`), { parse_mode: 'HTML' });
            try { bot.sendMessage(parseInt(state.targetId), premiumText('🎁 ɢɪғᴛ ʀᴇᴄᴇɪᴠᴇᴅ', `Yᴏᴜ ɢᴏᴛ ${amount} ᴘᴛs ғʀᴏᴍ ${uid}`, '💝'), { parse_mode: 'HTML' }); } catch {}
        } else bot.sendMessage(chatId, errorText('ɢɪғᴛ ғᴀɪʟᴇᴅ', r.msg), { parse_mode: 'HTML' });
        return;
    }
    if (state.action === 'console_input') {
        delete userStates[uid];
        const ok = sendToBot(state.fPath, txt);
        bot.sendMessage(chatId, ok ? successText('Sᴇɴᴛ', 'ᴄᴏᴍᴍᴀɴᴅ sᴇɴᴛ ᴛᴏ ʙᴏᴛ sᴛᴅɪɴ') : errorText('Fᴀɪʟᴇᴅ', 'ʙᴏᴛ ɴᴏᴛ ʀᴜɴɴɪɴɢ'), { parse_mode: 'HTML' });
        return;
    }
    if (state.action === 'rename_file') {
        delete userStates[uid];
        const newName = txt.trim().replace(/[^\w.\-]/g, '_');
        if (!newName.endsWith('.js')) return bot.sendMessage(chatId, errorText('ɪɴᴠᴀʟɪᴅ', 'ᴍᴜsᴛ ᴇɴᴅ ɪɴ .ᴊs'), { parse_mode: 'HTML' });
        const oldPath = path.join(DEPLOY_DIR, `${uid}_${state.oldName}`);
        const newPath = path.join(DEPLOY_DIR, `${uid}_${newName}`);
        try {
            if (runningProcesses[path.resolve(oldPath)]) stopBot(oldPath);
            fs.renameSync(oldPath, newPath);
            const idx = usersDB[uid].files.indexOf(state.oldName);
            if (idx >= 0) usersDB[uid].files[idx] = newName;
            saveDB();
            bot.sendMessage(chatId, successText('Rᴇɴᴀᴍᴇᴅ', `${state.oldName} → ${newName}`), { parse_mode: 'HTML' });
        } catch (e) { bot.sendMessage(chatId, errorText('ʀᴇɴᴀᴍᴇ ғᴀɪʟᴇᴅ', e.message), { parse_mode: 'HTML' }); }
        return;
    }
    if (state.action === 'log_search') {
        delete userStates[uid];
        const keyword = txt.trim();
        const files = usersDB[uid]?.files || [];
        let found = 0;
        for (const f of files) {
            const lf = getLogFile(uid, f);
            if (!fs.existsSync(lf)) continue;
            const content = fs.readFileSync(lf, 'utf8');
            const lines = content.split('\n').filter(l => l.toLowerCase().includes(keyword.toLowerCase()));
            if (lines.length) {
                found++;
                bot.sendMessage(chatId, premiumText(`🔍 ${f} — ${lines.length} ᴍᴀᴛᴄʜᴇs`,
                    `<code>${esc(lines.slice(-30).join('\n').slice(0, 3000))}</code>`, '📜'), { parse_mode: 'HTML' });
            }
        }
        if (!found) bot.sendMessage(chatId, infoText('ɴᴏ ᴍᴀᴛᴄʜᴇs', `ɴᴏ ʀᴇsᴜʟᴛs ғᴏʀ "${esc(keyword)}"`), { parse_mode: 'HTML' });
        return;
    }
    if (state.action === 'github_url') {
        delete userStates[uid];
        const url = txt.trim();
        if (!/^https?:\/\/github\.com\/[\w\-.]+\/[\w\-.]+/.test(url)) {
            return bot.sendMessage(chatId, errorText('ɪɴᴠᴀʟɪᴅ ᴜʀʟ', 'ᴍᴜsᴛ ʙᴇ ᴀ ɢɪᴛʜᴜʙ ʀᴇᴘᴏ ᴜʀʟ'), { parse_mode: 'HTML' });
        }
        const prog = await bot.sendMessage(chatId, premiumText('⏳ Cloning...', '📦 ғᴇᴛᴄʜɪɴɢ ʀᴇᴘᴏ', '⚙️'), { parse_mode: 'HTML' });
        const targetDir = path.join(DEPLOY_DIR, `${uid}_gh_${Date.now()}`);
        const r = await cloneGitHubRepo(url, targetDir);
        if (!r.success) {
            return bot.editMessageText(errorText('ᴄʟᴏɴᴇ ғᴀɪʟᴇᴅ', esc(r.msg.slice(0, 300))),
                { chat_id: chatId, message_id: prog.message_id, parse_mode: 'HTML' });
        }
        const jsFiles = walkDir(targetDir, ['.js']);
        if (!jsFiles.length) {
            return bot.editMessageText(errorText('ɴᴏ ᴊs ғᴏᴜɴᴅ', 'ʀᴇᴘᴏ ʜᴀs ɴᴏ .ᴊs Fɪʟᴇs'),
                { chat_id: chatId, message_id: prog.message_id, parse_mode: 'HTML' });
        }
        const mainFile = pickMainJs(jsFiles);
        const fName = `${path.basename(targetDir)}_${path.basename(mainFile)}`;
        const newPath = path.join(DEPLOY_DIR, `${uid}_${fName}`);
        fs.copyFileSync(mainFile, newPath);
        await installNodeDeps(targetDir);
        const runRes = await runUserFile(newPath, parseInt(uid), fName);
        if (runRes.success) {
            if (!usersDB[uid].files.includes(fName)) usersDB[uid].files.push(fName);
            usersDB[uid].points -= settings.hosting_cost;
            usersDB[uid].total_deployments = (usersDB[uid].total_deployments || 0) + 1;
            saveDB();
            bot.editMessageText(successText('Gɪᴛʜᴜʙ Dᴇᴘʟᴏʏᴇᴅ', `📄 ${esc(fName)}\n🟢 Rᴜɴɴɪɴɢ`),
                { chat_id: chatId, message_id: prog.message_id, parse_mode: 'HTML' });
            announceDeployment(parseInt(uid), fName);
        } else {
            bot.editMessageText(errorText('ᴅᴇᴘʟᴏʏ ғᴀɪʟᴇᴅ', esc(runRes.status.slice(0, 400))),
                { chat_id: chatId, message_id: prog.message_id, parse_mode: 'HTML' });
        }
        return;
    }
});


bot.on('callback_query', async (cb) => {
    const chatId = cb.message.chat.id;
    const msgId = cb.message.message_id;
    const uid = String(cb.from.id);
    const data = cb.data || '';

    const answer = (t, opts = {}) => { try { bot.answerCallbackQuery(cb.id, { text: t, ...opts }); } catch {} };
    const editMarkup = (kb) => { try { bot.editMessageReplyMarkup(kb, { chat_id: chatId, message_id: msgId }); } catch {} };

    // ─── Force join check ───
    if (data === 'check_join') {
        const joined = await checkForceJoin(uid);
        if (joined) {
            answer('✅ Verified!');
            try { bot.deleteMessage(chatId, msgId); } catch {}
            const isNew = !usersDB[uid];
            if (isNew) {
                const fakeMsg = { from: cb.from, chat: { id: chatId } };
                await registerNewUser(fakeMsg, null);
            }
            await sendWelcome(chatId, cb.from, isNew);
        } else {
            answer('❌ Join all channels first!', { show_alert: true });
        }
        return;
    }

    if (data === 'back_menu') {
        try { bot.deleteMessage(chatId, msgId); } catch {}
        return;
    }

    // ─── Admin route ───
    if (isAdmin(uid) && data.startsWith('adm_')) {
        return handleAdminCallback(cb, chatId, msgId, uid, data, answer, editMarkup);
    }

    // ─── Ban check ───
    if (isBanned(uid)) { answer('🚫 Yᴏᴜ Aʀᴇ Bᴀɴᴅᴇᴅ'); return; }

    // ─── Approval (admin only) ───
    if (data.startsWith('appr_') || data.startsWith('rej_')) {
        if (!isAdmin(uid)) return answer('Not admin');
        const parts = data.split('_');
        const targetUid = parts[1];
        const fName = parts.slice(2).join('_');
        const key = `${targetUid}_${fName}`;
        const pending = pendingApprovals[key];
        if (!pending) return answer('Already handled');

        if (data.startsWith('appr_')) {
            delete pendingApprovals[key];
            const runRes = await runUserFile(pending.fPath, parseInt(targetUid), fName);
            if (runRes.success) {
                if (!usersDB[targetUid].files.includes(fName)) usersDB[targetUid].files.push(fName);
                usersDB[targetUid].points -= settings.hosting_cost;
                usersDB[targetUid].total_deployments = (usersDB[targetUid].total_deployments || 0) + 1;
                saveDB();
                try { bot.sendMessage(parseInt(targetUid), successText('✅ Aᴘᴘʀᴏᴠᴇᴅ', `Yᴏᴜʀ ʙᴏᴛ ${esc(fName)} ɪs ɴᴏᴡ ʀᴜɴɴɪɴɢ!`), { parse_mode: 'HTML' }); } catch {}
                answer('Approved!');
                announceDeployment(parseInt(targetUid), fName);
            } else {
                answer('Run failed');
            }
        } else {
            delete pendingApprovals[key];
            try { bot.sendMessage(parseInt(targetUid), errorText('❌ ʀᴇᴊᴇᴄᴛᴇᴅ', `ʏᴏᴜʀ ᴅᴇᴘʟᴏʏ ${esc(fName)} ᴡᴀs ʀᴇᴊᴇᴄᴛᴇᴅ.`), { parse_mode: 'HTML' }); } catch {}
            answer('Rejected');
        }
        try { bot.deleteMessage(chatId, msgId); } catch {}
        return;
    }

    // ─── Templates ───
    if (data === 'templates_root') {
        try {
            bot.editMessageText(premiumText('🎨 ᴛᴇᴍᴘʟᴀᴛᴇs ᴍᴀʀᴋᴇᴛᴘʟᴀᴄᴇ',
                'ʙʀᴏᴡsᴇ ᴘʀᴇ-ᴍᴀᴅᴇ ʙᴏᴛ ᴛᴇᴍᴘʟᴀᴛᴇs.\n💎 ʙᴜʏ ᴏɴᴄᴇ, ᴅᴇᴘʟᴏʏ ғᴏʀᴇᴠᴇʀ!', '🛍'),
                { chat_id: chatId, message_id: msgId, parse_mode: 'HTML', reply_markup: templatesCategoriesKeyboard() });
        } catch {}
        answer();
        return;
    }

    if (data.startsWith('tcat_')) {
        const cat = data.slice(5);
        try {
            bot.editMessageText(premiumText(`📁 ${cat} Templates`,
                `Bʀᴏᴡsᴇ ᴀɴᴅ ʙᴜʏ ᴛᴇᴍᴘʟᴀᴛᴇs.`, '🎨'),
                { chat_id: chatId, message_id: msgId, parse_mode: 'HTML', reply_markup: templateListKeyboard(cat, uid) });
        } catch {}
        answer();
        return;
    }

    if (data.startsWith('tpl_')) {
        const key = data.slice(4);
        const tpl = templatesDB[key];
        if (!tpl) return answer('Template missing');
        const owned = hasOwned(uid, key);
        const statusTxt = owned ? '✅ Oᴡɴᴇᴅ' : (tpl.price === 0 ? '🆓 Fʀᴇᴇ' : `💎 ᴘʀɪᴄᴇ: ${tpl.price} ᴘᴛs`);
        const txt = premiumText(`🎨 ${tpl.name}`,
            `📁 ᴄᴀᴛᴇɢᴏʀʏ: ${tpl.cat}\n${statusTxt}\n\n${esc(tpl.desc)}\n\n${tpl.requires_env ? `⚠️ ʀᴇǫᴜɪʀᴇs ᴇɴᴠ: <code>${esc(tpl.requires_env)}</code>` : ''}`,
            '📦');
        try {
            bot.editMessageText(txt, {
                chat_id: chatId, message_id: msgId, parse_mode: 'HTML',
                reply_markup: templateActionsKeyboard(key, uid)
            });
        } catch {}
        answer();
        return;
    }

    if (data.startsWith('tbuy_')) {
        const key = data.slice(5);
        const r = purchaseTemplate(uid, key);
        if (!r.ok) return answer(r.msg, { show_alert: true });
        const tpl = templatesDB[key];
        answer('✅ ᴘᴜʀᴄʜᴀsᴇᴅ!');
        try {
            bot.editMessageText(premiumText(`🎉 ᴜɴʟᴏᴄᴋᴇᴅ!`,
                `Yᴏᴜ ɴᴏᴡ ᴏᴡɴ <b>${esc(tpl.name)}</b>.\nDᴇᴘʟᴏʏ ɪᴛ ᴀɴʏᴛɪᴍᴇ!`, '✅'),
                { chat_id: chatId, message_id: msgId, parse_mode: 'HTML', reply_markup: templateActionsKeyboard(key, uid) });
        } catch {}
        return;
    }

    if (data.startsWith('tdeploy_')) {
        const key = data.slice(8);
        if (!hasOwned(uid, key)) return answer('ʙᴜʏ ғɪʀsᴛ', { show_alert: true });
        const maxBots = getMaxBots(uid);
        const files = usersDB[uid].files || [];
        if (files.length >= maxBots) return answer(`Lɪᴍɪᴛ ʀᴇᴀᴄʜᴇᴅ (${maxBots})`, { show_alert: true });
        const rl = rateLimit(uid, 'deploy', settings.rate_limit_deploys, settings.rate_limit_window_min);
        if (!rl.allowed) return answer(`Rᴀᴛᴇ ʟɪᴍɪᴛᴇᴅ. ᴡᴀɪᴛ ${rl.waitMin}ᴍ`, { show_alert: true });
        const points = usersDB[uid].points || 0;
        if (points < settings.hosting_cost) return answer('ɴᴏᴛ ᴇɴᴏᴜɢʜ ᴘᴏɪɴᴛs', { show_alert: true });

        const t = deployTemplateToUser(uid, key);
        if (!t) return answer('Template error');
        const runRes = await runUserFile(t.fPath, parseInt(uid), t.fName);
        if (runRes.success) {
            if (!usersDB[uid].files.includes(t.fName)) usersDB[uid].files.push(t.fName);
            usersDB[uid].points -= settings.hosting_cost;
            usersDB[uid].total_deployments = (usersDB[uid].total_deployments || 0) + 1;
            saveDB();
            const completed = checkQuestProgress(uid);
            answer('🚀 ᴅᴇᴘʟᴏʏᴇᴅ!');
            bot.sendMessage(chatId, successText('ᴛᴇᴍᴘʟᴀᴛᴇ ᴅᴇᴘʟᴏʏᴇᴅ',
                `📄 ${esc(t.fName)}\n🟢 ʀᴜɴɴɪɴɢ\n💰 ʀᴇᴍᴀɪɴɪɴɢ: ${usersDB[uid].points} pts${completed.length ? `\n🏆 +${completed.reduce((s, q) => s + q.reward, 0)} ǫᴜᴇsᴛ ᴘᴛs` : ''}`),
                { parse_mode: 'HTML' });
            announceDeployment(parseInt(uid), t.fName);
        } else {
            answer('ᴅᴇᴘʟᴏʏ ғᴀɪʟᴇᴅ: ' + runRes.status.slice(0, 50), { show_alert: true });
        }
        return;
    }

    // ─── Store / Tiers ───
    if (data.startsWith('store_')) {
        const key = data.slice(6);
        const r = purchaseStoreItem(uid, key);
        if (!r.ok) return answer(r.msg, { show_alert: true });
        answer('✅ ᴘᴜʀᴄʜᴀsᴇᴅ!');
        bot.sendMessage(chatId, successText('sᴛᴏʀᴇ ᴘᴜʀᴄʜᴀsᴇ', `Iᴛᴇᴍ: ${settings.store_items[key].name}\n💰 ʙᴀʟᴀɴᴄᴇ: ${usersDB[uid].points}`), { parse_mode: 'HTML' });
        return;
    }

    if (data.startsWith('tier_')) {
        const key = data.slice(5);
        const r = upgradeTier(uid, key);
        if (!r.ok) return answer(r.msg, { show_alert: true });
        answer('🏆 ᴜᴘɢʀᴀᴅᴇᴅ!');
        bot.sendMessage(chatId, successText('ᴛɪᴇʀ ᴜᴘɢʀᴀᴅᴇᴅ', `Yᴏᴜ ᴀʀᴇ ɴᴏᴡ <b>${settings.tiers[key].name}</b>!`), { parse_mode: 'HTML' });
        return;
    }

    // ─── File actions ───
    if (data.startsWith('run_') || data.startsWith('stop_') || data.startsWith('down_') ||
        data.startsWith('del_') || data.startsWith('logs_') || data.startsWith('viewlog_') ||
        data.startsWith('console_') || data.startsWith('rename_') || data.startsWith('tags_') ||
        data.startsWith('health_') || data.startsWith('logsearch_')) {
        return handleFileCallback(cb, chatId, msgId, uid, data, answer);
    }

    answer();
});

// ─── File callback router ───

async function handleFileCallback(cb, chatId, msgId, uid, data, answer) {
    const parts = data.split('_');
    const action = parts[0];

    if (action === 'viewlog') {
        const fName = parts.slice(1, -1).join('_');
        const targetUid = parts[parts.length - 1];
        if (targetUid !== uid && !isAdmin(uid)) return answer('ɴᴏᴛ ᴀʟʟᴏᴡᴇᴅ');
        const lf = getLogFile(targetUid, fName);
        if (!fs.existsSync(lf)) return answer('ɴᴏ ʟᴏɢ ғɪʟᴇ');
        const content = fs.readFileSync(lf, 'utf8').slice(-3500);
        bot.sendMessage(chatId, premiumText(`📋 ʟᴏɢs: ${fName}`, `<pre>${esc(content)}</pre>`, '📜'), { parse_mode: 'HTML' });
        return answer();
    }

    if (action === 'logsearch') {
        userStates[uid] = { action: 'log_search' };
        bot.sendMessage(chatId, premiumText('🔍 Sᴇᴀʀᴄʜ Lᴏɢs', 'Sᴇɴᴅ Kᴇʏᴡᴏʀᴅ Tᴏ Sᴇᴀʀᴄʜ:', '🔎'), { parse_mode: 'HTML' });
        return answer();
    }

    const fName = parts.slice(1, -1).join('_');
    const targetUid = parts[parts.length - 1];

    if (targetUid !== uid && !isAdmin(uid)) return answer('ɴᴏᴛ ᴀʟʟᴏᴡᴇᴅ');

    const fPath = path.join(DEPLOY_DIR, `${targetUid}_${fName}`);
    const abs = path.resolve(fPath);

    if (action === 'stop') {
        const ok = stopBot(abs);
        if (ok) { answer('⏹ sᴛᴏᴘᴘᴇᴅ'); try { bot.editMessageReplyMarkup(fileActionsKeyboard(fName, targetUid), { chat_id: chatId, message_id: msgId }); } catch {} }
        else answer('ʙᴏᴛ ɴᴏᴛ ʀᴜɴɴɪɴɢ');
        return;
    }

    if (action === 'run') {
        if (!fs.existsSync(abs)) return answer('File missing');
        const runRes = await runUserFile(abs, parseInt(targetUid), fName);
        if (runRes.success) {
            answer('▶️ sᴛᴀʀᴛᴇᴅ');
            try { bot.editMessageReplyMarkup(fileActionsKeyboard(fName, targetUid), { chat_id: chatId, message_id: msgId }); } catch {}
        } else {
            answer(`ғᴀɪʟᴇᴅ: ${runRes.status.slice(0, 60)}`, { show_alert: true });
        }
        return;
    }

    if (action === 'down') {
        if (!fs.existsSync(abs)) return answer('ғɪʟᴇ ᴍɪssɪɴɢ');
        try { await bot.sendDocument(chatId, abs, { caption: `📥 ${fName}` }); } catch {}
        return answer();
    }

    if (action === 'del') {
        try {
            if (runningProcesses[abs]) stopBot(abs);
            if (fs.existsSync(abs)) {
                const stat = fs.statSync(abs);
                if (stat.isDirectory()) fs.rmSync(abs, { recursive: true });
                else fs.unlinkSync(abs);
            }
            if (usersDB[targetUid]?.files) {
                usersDB[targetUid].files = usersDB[targetUid].files.filter(f => f !== fName);
            }
            if (usersDB[targetUid]?.file_hashes) {
                for (const [h, n] of Object.entries(usersDB[targetUid].file_hashes)) {
                    if (n === fName) delete usersDB[targetUid].file_hashes[h];
                }
            }
            saveDB();
            const lf = getLogFile(targetUid, fName);
            if (fs.existsSync(lf)) fs.unlinkSync(lf);
            try { bot.deleteMessage(chatId, msgId); } catch {}
            answer('🗑️ ᴅᴇʟᴇᴛᴇᴅ');
        } catch (e) { answer('Error: ' + e.message.slice(0, 50)); }
        return;
    }

    if (action === 'logs') {
        const lf = getLogFile(targetUid, fName);
        if (!fs.existsSync(lf)) return answer('ɴᴏ ʟᴏɢ ғɪʟᴇ');
        const content = fs.readFileSync(lf, 'utf8').slice(-3500);
        bot.sendMessage(chatId, premiumText(`📋 ʟᴏɢs: ${fName}`, `<pre>${esc(content)}</pre>`, '📜'), { parse_mode: 'HTML' });
        return answer();
    }

    if (action === 'console') {
        userStates[uid] = { action: 'console_input', fPath: abs };
        bot.sendMessage(chatId, premiumText('🖥 ʟɪᴠᴇ ᴄᴏɴsᴏʟᴇ', `sᴇɴᴅ ɪɴᴘᴜᴛ ғᴏʀ <b>${fName}</b>:`, '📟'), { parse_mode: 'HTML' });
        return answer();
    }

    if (action === 'rename') {
        userStates[uid] = { action: 'rename_file', oldName: fName };
        bot.sendMessage(chatId, premiumText('✏️ ʀᴇɴᴀᴍᴇ', `Sᴇɴᴅ ɴᴇᴡ ғɪʟᴇɴᴀᴍᴇ ғᴏʀ <b>${fName}</b> (ᴍᴜsᴛ ᴇɴᴅ .ᴊs)`, '📝'), { parse_mode: 'HTML' });
        return answer();
    }

    if (action === 'health') {
        const h = healthDB[`${targetUid}_${fName}`] || {};
        const score = getHealthScore(targetUid, fName);
        const uptimeMin = Math.floor((h.totalUptime || 0) / 60000);
        bot.sendMessage(chatId, premiumText(`❤️ ʜᴇᴀʟᴛʜ: ${fName}`,
            `Sᴄᴏʀᴇ: <b>${score}/100</b>\n🟢 sᴛᴀʀᴛs: ${h.starts || 0}\n💥 ᴄʀᴀsʜᴇs: ${h.crashes || 0}\n🔄 ʀᴇsᴛᴀʀᴛs: ${h.restarts || 0}\n⏱ ᴛᴏᴛᴀʟ ᴜᴘᴛɪᴍᴇ: ${uptimeMin}m`,
            '📊'), { parse_mode: 'HTML' });
        return answer();
    }

    if (action === 'tags') {
        const current = tagsDB[`${targetUid}_${fName}`] || [];
        bot.sendMessage(chatId, premiumText('🏷 Tᴀɢs', `Cᴜʀʀᴇɴᴛ: ${current.join(', ') || 'none'}\n\nsᴇɴᴅ ᴛᴀɢs ᴠɪᴀ <code>/ᴛᴀɢ ${fName} ᴛᴀɢ𝟷,ᴛᴀɢ𝟸</code>`, '🏷'), { parse_mode: 'HTML' });
        return answer();
    }

    answer();
}

// ─── Admin callback handler ───

async function handleAdminCallback(cb, chatId, msgId, uid, data, answer, editMarkup) {
    const editMarkupSafe = (kb) => { try { bot.editMessageReplyMarkup(kb, { chat_id: chatId, message_id: msgId }); } catch {} };

    if (data === 'adm_toggle_maint') {
        settings.maintenance = !settings.maintenance; saveSettings();
        adminLog('toggle_maint', uid, { value: settings.maintenance });
        answer(`Maintenance: ${settings.maintenance ? 'ON' : 'OFF'}`);
        editMarkupSafe(adminKeyboard());
        return;
    }
    if (data === 'adm_toggle_notify') {
        settings.new_user_notify = !settings.new_user_notify; saveSettings();
        answer(`Notify: ${settings.new_user_notify ? 'ON' : 'OFF'}`);
        editMarkupSafe(adminKeyboard());
        return;
    }
    if (data === 'adm_toggle_force') {
        settings.force_join = !settings.force_join; saveSettings();
        answer(`ForceJoin: ${settings.force_join ? 'ON' : 'OFF'}`);
        editMarkupSafe(adminKeyboard());
        return;
    }
    if (data === 'adm_toggle_approval') {
        settings.deploy_approval = !settings.deploy_approval; saveSettings();
        answer(`Approval: ${settings.deploy_approval ? 'ON' : 'OFF'}`);
        editMarkupSafe(adminKeyboard());
        return;
    }
    if (data === 'adm_toggle_restart') {
        settings.auto_restart = !settings.auto_restart; saveSettings();
        answer(`AutoRestart: ${settings.auto_restart ? 'ON' : 'OFF'}`);
        editMarkupSafe(adminKeyboard());
        return;
    }
    if (data === 'adm_toggle_alert') {
        settings.crash_alert = !settings.crash_alert; saveSettings();
        answer(`Alerts: ${settings.crash_alert ? 'ON' : 'OFF'}`);
        editMarkupSafe(adminKeyboard());
        return;
    }

    if (data === 'adm_clean') {
        const n = cleanDeadProcesses();
        answer(`🧹 Cleaned ${n}`);
        return;
    }

    if (data === 'adm_force_restart') {
        const n = forceRestartAll();
        adminLog('force_restart', uid, { count: n });
        answer(`🔨 Restarting ${n} bots...`);
        return;
    }

    if (data === 'adm_backup') {
        answer('💾 Backing up...');
        const ok = await backupToChannel();
        bot.sendMessage(chatId, ok ? successText('Backup Done', 'Sent to channel') : errorText('Backup Failed', 'Try again'),
            { parse_mode: 'HTML' });
        return;
    }

    if (data === 'adm_stats' || data === 'adm_system') {
        const s = getSystemStats();
        const txt = premiumText('🖥 sʏsᴛᴇᴍ sᴛᴀᴛs',
            `⏱ ᴜᴘᴛɪᴍᴇ: ${Math.floor(s.uptime / 3600)}h\n💻 ᴘʟᴀᴛғᴏʀᴍ: ${s.platform} ${s.arch}\n⚙️ ᴄᴘᴜs: ${s.cpus}\n📊 ʟᴏᴀᴅ: ${s.load1} / ${s.load5}\n🧠 ʀᴀᴍ: ${s.memUsedMB}ᴍʙ / ${s.memTotalMB}ᴍʙ (${s.memPct}%)\n🟢 ɴᴏᴅᴇ: ${s.nodeVersion}\n💾 ᴅᴍ: ${s.dbSizeKB}ᴋʙ\n👥 ᴜsᴇʀs: ${s.totalUsers}\n🤖 ʙᴏᴛs: ${s.runningBots}`,
            '📊');
        try { bot.editMessageText(txt, { chat_id: chatId, message_id: msgId, parse_mode: 'HTML', reply_markup: adminKeyboard() }); } catch { bot.sendMessage(chatId, txt, { parse_mode: 'HTML' }); }
        answer();
        return;
    }

    if (data === 'adm_logs') {
        const recent = adminLogs.slice(-20).reverse();
        const txt = recent.map(l => `• [${moment(l.timestamp).format('MM-DD HH:mm')}] ${l.action} by ${l.adminId}`).join('\n') || 'No logs';
        bot.sendMessage(chatId, premiumText('📜 Admin Logs', `<code>${esc(txt)}</code>`, '📜'), { parse_mode: 'HTML' });
        answer();
        return;
    }

    if (data === 'adm_channels') {
        let txt = '📋 <b>Force-Join Channels:</b>\n\n';
        FORCE_JOIN_CHANNELS.forEach((ch, i) => { txt += `${i + 1}. ${ch.name}\n   ${ch.link}\n\n`; });
        txt += '\n<code>Edit FORCE_JOIN_CHANNELS in code</code>';
        bot.sendMessage(chatId, premiumText('📢 Channels', txt, '📢'), { parse_mode: 'HTML' });
        answer();
        return;
    }

    if (data === 'adm_list_templates') {
        let txt = `📦 <b>Total: ${Object.keys(templatesDB).length}</b>\n\n`;
        for (const [k, t] of Object.entries(templatesDB)) {
            txt += `• <code>${k}</code> — ${t.name} (${t.cat}, ${t.price}pts)\n`;
        }
        bot.sendMessage(chatId, premiumText('📦 Templates', txt, '🎨'), { parse_mode: 'HTML' });
        answer();
        return;
    }

    if (data === 'adm_list_coupons') {
        const keys = Object.keys(couponsDB);
        if (!keys.length) { bot.sendMessage(chatId, infoText('Coupons', 'No coupons'), { parse_mode: 'HTML' }); return answer(); }
        let txt = '';
        for (const k of keys) {
            const c = couponsDB[k];
            txt += `• <code>${k}</code> — +${c.reward}pts (${c.uses}/${c.max_uses})\n`;
        }
        bot.sendMessage(chatId, premiumText('🎟 Coupons', txt, '📜'), { parse_mode: 'HTML' });
        answer();
        return;
    }

    if (data === 'adm_coupon') {
        userStates[uid] = { action: 'adm_coupon_code' };
        bot.sendMessage(chatId, premiumText('🎟 Create Coupon', 'Send: <code>CODE REWARD MAX_USES</code>\nExample: <code>WELCOME 10 100</code>', '🎨'), { parse_mode: 'HTML' });
        answer();
        return;
    }

    if (data === 'adm_add_template') {
        userStates[uid] = { action: 'adm_template_name' };
        bot.sendMessage(chatId, premiumText('🎨 Add Template', 'Step 1: Send template name', '📦'), { parse_mode: 'HTML' });
        answer();
        return;
    }

    if (data === 'adm_set_video') {
        userStates[uid] = { action: 'adm_video' };
        bot.sendMessage(chatId, premiumText('🎥 Set Welcome Video', 'Send the video file:', '📹'), { parse_mode: 'HTML' });
        answer();
        return;
    }

    if (data === 'adm_clear_video') {
        settings.welcome_video = null; saveSettings();
        answer('Video cleared');
        return;
    }

    if (data === 'adm_broadcast') {
        userStates[uid] = { action: 'adm_broadcast' };
        bot.sendMessage(chatId, premiumText('📢 Broadcast', 'Send your message:', '📨'), { parse_mode: 'HTML' });
        answer();
        return;
    }

   if (data === 'adm_add_pts' || data === 'adm_sub_pts' || data === 'adm_set_pts') {
    const mode = data === 'adm_add_pts' ? 'add' : data === 'adm_sub_pts' ? 'sub' : 'set';
    userStates[uid] = { action: `adm_${mode}_pts_userid`, mode: data };
    const modeTxt = mode === 'add' ? 'Add' : mode === 'sub' ? 'Subtract' : 'Set';
    bot.sendMessage(chatId, premiumText(`💰 ${modeTxt} Points`, 'Send user ID:', '👤'), { parse_mode: 'HTML' });
    answer();
    return;
}

    if (data === 'adm_global_add') {
        userStates[uid] = { action: 'adm_global_add_amount' };
        bot.sendMessage(chatId, premiumText('🌍 Global Add Points', 'Send amount to add to ALL users:', '💎'), { parse_mode: 'HTML' });
        answer();
        return;
    }

    if (data === 'adm_ban') {
        userStates[uid] = { action: 'adm_ban_userid' };
        bot.sendMessage(chatId, premiumText('🚫 Ban User', 'Send user ID:', '👤'), { parse_mode: 'HTML' });
        answer();
        return;
    }

    if (data === 'adm_unban') {
        userStates[uid] = { action: 'adm_unban_userid' };
        bot.sendMessage(chatId, premiumText('✅ Unban User', 'Send user ID:', '👤'), { parse_mode: 'HTML' });
        answer();
        return;
    }

    if (data === 'adm_search') {
        userStates[uid] = { action: 'adm_search_query' };
        bot.sendMessage(chatId, premiumText('🔍 Search User', 'Send ID, username, or name:', '🔎'), { parse_mode: 'HTML' });
        answer();
        return;
    }

    if (data === 'adm_report') {
        userStates[uid] = { action: 'adm_report_uid' };
        bot.sendMessage(chatId, premiumText('📋 User Report', 'Send user ID:', '👤'), { parse_mode: 'HTML' });
        answer();
        return;
    }

    if (data === 'adm_impersonate') {
        userStates[uid] = { action: 'adm_impersonate_uid' };
        bot.sendMessage(chatId, premiumText('🎭 Impersonate', 'Send user ID to view as them:', '👤'), { parse_mode: 'HTML' });
        answer();
        return;
    }

    if (data === 'adm_limits') {
        userStates[uid] = { action: 'adm_limits_uid' };
        bot.sendMessage(chatId, premiumText('🔨 Set User Bot Limit', 'Send: <code>USER_ID LIMIT</code>\nExample: <code>123456 10</code>', '📊'), { parse_mode: 'HTML' });
        answer();
        return;
    }

    answer();
}

bot.on('text', async (msg) => {
    const chatId = msg.chat.id;
    const uid = String(msg.from.id);
    if (!isAdmin(uid)) return;
    const state = userStates[uid];
    if (!state || !state.action || !state.action.startsWith('adm_')) return;

    const txt = (msg.text || '').trim();
    delete userStates[uid];

    if (state.action === 'adm_add_pts_userid') {
        state.targetId = txt; state.action = 'adm_add_pts_amount';
        userStates[uid] = state;
        return bot.sendMessage(chatId, premiumText('💰 Amount', 'Enter points to add:', '💎'), { parse_mode: 'HTML' });
    }
    if (state.action === 'adm_add_pts_amount') {
        const amt = parseInt(txt);
        if (isNaN(amt) || amt <= 0) return bot.sendMessage(chatId, errorText('Invalid', 'Number required'), { parse_mode: 'HTML' });
        if (!addPoints(state.targetId, amt)) return bot.sendMessage(chatId, errorText('Failed', 'User not found'), { parse_mode: 'HTML' });
        adminLog('add_pts', uid, { target: state.targetId, amount: amt });
        bot.sendMessage(chatId, successText('Points Added', `+${amt} to ${state.targetId}\nNew: ${usersDB[state.targetId].points}`), { parse_mode: 'HTML' });
        try { bot.sendMessage(parseInt(state.targetId), premiumText('💰 ᴘᴏɪɴᴛs ᴀᴅᴅᴇᴅ', `+${amt} ᴘᴏɪɴᴛs ғʀᴏᴍ ᴀᴅᴍɪɴ`, '🎁'), { parse_mode: 'HTML' }); } catch {}
        return;
    }

    if (state.action === 'adm_sub_pts_userid') {
        state.targetId = txt; state.action = 'adm_sub_pts_amount';
        userStates[uid] = state;
        return bot.sendMessage(chatId, premiumText('💰 Amount', 'Enter points to subtract:', '💎'), { parse_mode: 'HTML' });
    }
    if (state.action === 'adm_sub_pts_amount') {
        const amt = parseInt(txt);
        if (isNaN(amt) || amt <= 0) return bot.sendMessage(chatId, errorText('Invalid', 'Number required'), { parse_mode: 'HTML' });
        if (!subtractPoints(state.targetId, amt)) return bot.sendMessage(chatId, errorText('Failed', 'User not found'), { parse_mode: 'HTML' });
        adminLog('sub_pts', uid, { target: state.targetId, amount: amt });
        bot.sendMessage(chatId, successText('Points Subtracted', `-${amt} from ${state.targetId}\nNew: ${usersDB[state.targetId].points}`), { parse_mode: 'HTML' });
        return;
    }

    if (state.action === 'adm_set_pts_userid') {
        state.targetId = txt; state.action = 'adm_set_pts_amount';
        userStates[uid] = state;
        return bot.sendMessage(chatId, premiumText('💰 Amount', 'Enter new points value:', '💎'), { parse_mode: 'HTML' });
    }
    if (state.action === 'adm_set_pts_amount') {
        const amt = parseInt(txt);
        if (isNaN(amt) || amt < 0) return bot.sendMessage(chatId, errorText('Invalid', 'Number required'), { parse_mode: 'HTML' });
        if (!setPoints(state.targetId, amt)) return bot.sendMessage(chatId, errorText('Failed', 'User not found'), { parse_mode: 'HTML' });
        adminLog('set_pts', uid, { target: state.targetId, amount: amt });
        bot.sendMessage(chatId, successText('Points Set', `${state.targetId} = ${amt}`), { parse_mode: 'HTML' });
        return;
    }

    if (state.action === 'adm_global_add_amount') {
        const amt = parseInt(txt);
        if (isNaN(amt) || amt <= 0) return bot.sendMessage(chatId, errorText('Invalid', 'Number required'), { parse_mode: 'HTML' });
        const n = globalAddPoints(amt);
        adminLog('global_add', uid, { amount: amt, users: n });
        bot.sendMessage(chatId, successText('Global Add Done', `+${amt} to ${n} users\nTotal: ${amt * n}`), { parse_mode: 'HTML' });
        return;
    }

    if (state.action === 'adm_ban_userid') {
        state.targetId = txt; state.action = 'adm_ban_reason';
        userStates[uid] = state;
        return bot.sendMessage(chatId, premiumText('📝 Reason', 'Enter ban reason:', '⚠️'), { parse_mode: 'HTML' });
    }
    if (state.action === 'adm_ban_reason') {
        if (!banUser(state.targetId, txt)) return bot.sendMessage(chatId, errorText('Failed', 'User not found'), { parse_mode: 'HTML' });
        adminLog('ban', uid, { target: state.targetId, reason: txt });
        bot.sendMessage(chatId, successText('User Banned', `${state.targetId}\nReason: ${esc(txt)}`), { parse_mode: 'HTML' });
        try { bot.sendMessage(parseInt(state.targetId), errorText('🚫 Banned', `Reason: ${esc(txt)}`), { parse_mode: 'HTML' }); } catch {}
        return;
    }

    if (state.action === 'adm_unban_userid') {
        if (!unbanUser(txt)) return bot.sendMessage(chatId, errorText('Failed', 'User not found'), { parse_mode: 'HTML' });
        adminLog('unban', uid, { target: txt });
        bot.sendMessage(chatId, successText('Unbanned', txt), { parse_mode: 'HTML' });
        try { bot.sendMessage(parseInt(txt), successText('Unbanned', 'You can use the bot again.'), { parse_mode: 'HTML' }); } catch {}
        return;
    }

    if (state.action === 'adm_search_query') {
        const res = searchUsers(txt);
        if (!res.length) return bot.sendMessage(chatId, infoText('No Results', `No users match "${esc(txt)}"`), { parse_mode: 'HTML' });
        let out = '';
        for (const u of res) {
            out += `👤 <code>${u.uid}</code> — ${esc(u.first_name || 'N/A')}${u.username ? ' (@' + esc(u.username) + ')' : ''}\n💰 ${u.points || 0} pts\n\n`;
        }
        bot.sendMessage(chatId, premiumText('🔍 Search Results', out.slice(0, 3500), '🔎'), { parse_mode: 'HTML' });
        return;
    }

    if (state.action === 'adm_report_uid') {
        const r = await generateUserReport(txt);
        bot.sendMessage(chatId, premiumText('📋 User Report', r, '📊'), { parse_mode: 'HTML' });
        return;
    }

    if (state.action === 'adm_impersonate_uid') {
        if (!usersDB[txt]) return bot.sendMessage(chatId, errorText('Not Found', 'Invalid user'), { parse_mode: 'HTML' });
        const u = usersDB[txt];
        const myBots = Object.values(runningProcesses).filter(p => p.userId === String(txt));
        bot.sendMessage(chatId, premiumText(`🎭 Viewing as ${txt}`,
            `👤 ${esc(u.first_name || 'N/A')}\n💰 Points: ${u.points || 0}\n🏆 Tier: ${getUserTier(txt)}\n📤 Deploys: ${u.total_deployments || 0}\n🤖 Active Bots: ${myBots.length}\n🚫 Banned: ${u.banned ? 'Yes' : 'No'}`,
            '👁'), { parse_mode: 'HTML' });
        return;
    }

    if (state.action === 'adm_limits_uid') {
        const parts = txt.split(/\s+/);
        if (parts.length !== 2) return bot.sendMessage(chatId, errorText('Format', 'USER_ID LIMIT'), { parse_mode: 'HTML' });
        const [targetUid, lim] = parts;
        const limit = parseInt(lim);
        if (isNaN(limit) || limit < 0) return bot.sendMessage(chatId, errorText('Invalid', 'Bad limit'), { parse_mode: 'HTML' });
        if (!setUserLimit(targetUid, limit)) return bot.sendMessage(chatId, errorText('Failed', 'User not found'), { parse_mode: 'HTML' });
        adminLog('set_limit', uid, { target: targetUid, limit });
        bot.sendMessage(chatId, successText('Limit Set', `${targetUid} → ${limit}`), { parse_mode: 'HTML' });
        return;
    }

    if (state.action === 'adm_coupon_code') {
        const parts = txt.split(/\s+/);
        if (parts.length !== 3) return bot.sendMessage(chatId, errorText('Format', 'CODE REWARD MAX'), { parse_mode: 'HTML' });
        const [code, reward, max] = parts;
        const r = parseInt(reward), m = parseInt(max);
        if (isNaN(r) || isNaN(m) || r <= 0 || m <= 0) return bot.sendMessage(chatId, errorText('Invalid', 'Bad numbers'), { parse_mode: 'HTML' });
        couponsDB[code.toUpperCase()] = { reward: r, max_uses: m, uses: 0, used_by: [], created: moment().format() };
        saveCoupons();
        adminLog('create_coupon', uid, { code: code.toUpperCase(), reward: r, max: m });
        bot.sendMessage(chatId, successText('Coupon Created', `Code: <code>${esc(code.toUpperCase())}</code>\nReward: ${r} pts\nMax Uses: ${m}`), { parse_mode: 'HTML' });
        return;
    }

    if (state.action === 'adm_template_name') {
        state.tplName = txt;
        state.action = 'adm_template_cat';
        userStates[uid] = state;
        return bot.sendMessage(chatId, premiumText('📁 Category', 'Send category name (e.g. Utility, Crypto):', '🎨'), { parse_mode: 'HTML' });
    }
    if (state.action === 'adm_template_cat') {
        state.tplCat = txt;
        state.action = 'adm_template_price';
        userStates[uid] = state;
        return bot.sendMessage(chatId, premiumText('💎 Price', 'Send price in points:', '💰'), { parse_mode: 'HTML' });
    }
    if (state.action === 'adm_template_price') {
        const p = parseInt(txt);
        if (isNaN(p) || p < 0) return bot.sendMessage(chatId, errorText('Invalid', 'Number required'), { parse_mode: 'HTML' });
        state.tplPrice = p;
        state.action = 'adm_template_desc';
        userStates[uid] = state;
        return bot.sendMessage(chatId, premiumText('📝 Description', 'Send description:', '✍️'), { parse_mode: 'HTML' });
    }
    if (state.action === 'adm_template_desc') {
        state.tplDesc = txt;
        state.action = 'adm_template_code';
        userStates[uid] = state;
        return bot.sendMessage(chatId, premiumText('💻 Code', 'Send the .js code as text (or upload as file):', '📄'), { parse_mode: 'HTML' });
    }
    if (state.action === 'adm_template_code') {
        const code = txt;
        const key = state.tplName.toLowerCase().replace(/[^\w]/g, '_') + '_' + Date.now();
        templatesDB[key] = {
            name: state.tplName,
            cat: state.tplCat,
            price: state.tplPrice,
            desc: state.tplDesc,
            requires_env: 'TOKEN',
            code
        };
        saveTemplates();
        adminLog('add_template', uid, { key, name: state.tplName });
        bot.sendMessage(chatId, successText('Template Added', `Key: <code>${key}</code>\nName: ${esc(state.tplName)}`), { parse_mode: 'HTML' });
        return;
    }

    if (state.action === 'adm_broadcast') {
        bot.sendMessage(chatId, infoText('📢 Sending...', 'Broadcasting now'), { parse_mode: 'HTML' });
        const r = await broadcastToAll(txt, uid);
        bot.sendMessage(chatId, successText('Broadcast Done', `✅ Sent: ${r.sent}\n❌ Failed: ${r.failed}`), { parse_mode: 'HTML' });
        return;
    }
});

// ─── Admin video upload ───

bot.on('video', async (msg) => {
    const chatId = msg.chat.id;
    const uid = String(msg.from.id);
    if (!isAdmin(uid)) return;
    const state = userStates[uid];
    if (!state || state.action !== 'adm_video') return;
    delete userStates[uid];
    settings.welcome_video = msg.video.file_id;
    saveSettings();
    adminLog('set_video', uid, {});
    bot.sendMessage(chatId, successText('Video Set', 'Welcome video updated!'), { parse_mode: 'HTML' });
});

// ─── Admin panel buttons ───

bot.onText(/✦ Aᴅᴍɪɴ Pᴀɴᴇʟ/, async (msg) => {
    const chatId = msg.chat.id;
    const uid = String(msg.from.id);
    if (!isAdmin(uid)) return;
    const s = getSystemStats();
    bot.sendMessage(chatId, premiumText('👑 Admin Panel',
        `👥 Users: ${s.totalUsers}\n🤖 Running: ${s.runningBots}\n🧠 RAM: ${s.memPct}%\n⚙️ Load: ${s.load1}\n💾 DB: ${s.dbSizeKB}KB`,
        '🔐'), { parse_mode: 'HTML', reply_markup: adminKeyboard() });
});

bot.onText(/✦ Aʟʟ Fɪʟᴇs/, async (msg) => {
    const chatId = msg.chat.id;
    const uid = String(msg.from.id);
    if (!isAdmin(uid)) return;
    let found = false;
    for (const [targetUid, data] of Object.entries(usersDB)) {
        for (const fName of (data.files || [])) {
            found = true;
            const fPath = path.join(DEPLOY_DIR, `${targetUid}_${fName}`);
            const abs = path.resolve(fPath);
            const info = runningProcesses[abs];
            const status = info && info.process.exitCode === null ? '🟢' : '🔴';
            bot.sendMessage(chatId, `👤 User: <code>${targetUid}</code>\n📄 File: ${esc(fName)} ${status}`,
                { parse_mode: 'HTML', reply_markup: adminFileActionsKeyboard(fName, targetUid) });
        }
    }
    if (!found) bot.sendMessage(chatId, infoText('No Files', 'No bots deployed yet.'), { parse_mode: 'HTML' });
});

// ─── /tag command ───

bot.onText(/\/tag (\S+) (.+)/, async (msg, match) => {
    const uid = String(msg.from.id);
    const fName = match[1];
    const tags = match[2].split(',').map(t => t.trim()).filter(Boolean);
    if (!usersDB[uid]?.files.includes(fName)) return;
    tagsDB[`${uid}_${fName}`] = tags;
    saveTags();
    bot.sendMessage(msg.chat.id, successText('Tags Saved', `Tags for ${esc(fName)}: ${tags.join(', ')}`), { parse_mode: 'HTML' });
});

// ─── /restart command (user manual restart) ───

bot.onText(/\/restart (\S+)/, async (msg, match) => {
    const uid = String(msg.from.id);
    const fName = match[1];
    if (!usersDB[uid]?.files.includes(fName)) return bot.sendMessage(msg.chat.id, errorText('Not Found', 'No such file'), { parse_mode: 'HTML' });
    const fPath = path.join(DEPLOY_DIR, `${uid}_${fName}`);
    stopBot(fPath);
    setTimeout(async () => {
        const r = await runUserFile(fPath, parseInt(uid), fName);
        bot.sendMessage(msg.chat.id, r.success ? successText('Restarted', esc(fName)) : errorText('Failed', r.status),
            { parse_mode: 'HTML' });
    }, 1500);
});

// ─── /github command ───

bot.onText(/\/github/, async (msg) => {
    const uid = String(msg.from.id);
    if (isBanned(uid) || isMaintBlocked(uid)) return;
    userStates[uid] = { action: 'github_url' };
    bot.sendMessage(msg.chat.id, premiumText('🐙 GitHub Deploy', 'Send public repo URL:\n<code>https://github.com/user/repo</code>', '📦'), { parse_mode: 'HTML' });
});

// ─── /help ───

bot.onText(/\/help/, async (msg) => {
    bot.sendMessage(msg.chat.id, premiumText('📖 Help',
        `<b>Commands:</b>\n/start — Main menu\n/github — Deploy from GitHub\n/restart &lt;file&gt; — Restart a bot\n/tag &lt;file&gt; tag1,tag2 — Tag a bot\n/help — This menu\n\n<b>User Buttons:</b>\n✦ Deploy JS — Upload .js/.zip\n✦ Templates — Buy pre-made bots\n✦ My Files — Manage your bots\n✦ Daily/Spin/Scratch — Earn points\n✦ Store — Buy upgrades\n✦ Quests — Complete for rewards\n✦ Coupons — Redeem codes\n✦ Gift — Send points`,
        '📖'), { parse_mode: 'HTML' });
});

// ─── Scheduled tasks ───

// Auto-backup every 6 hours
setInterval(async () => {
    try {
        const stamp = moment().format('YYYYMMDD_HHmmss');
        const tmp = path.join(BACKUP_DIR, `auto_${stamp}.json`);
        const full = { users: usersDB, settings, coupons: couponsDB, templates: templatesDB, exportedAt: moment().format() };
        fs.writeFileSync(tmp, JSON.stringify(full, null, 2));
        await bot.sendDocument(CHANNEL_ID, tmp, { caption: `💾 Auto-Backup ${stamp}` });
        fs.unlinkSync(tmp);
        log('info', 'auto-backup sent');
    } catch (e) { log('warn', 'auto-backup failed', e.message); }
}, 6 * 60 * 60 * 1000);

// Clean dead processes every 10 min
setInterval(() => { const n = cleanDeadProcesses(); if (n) log('info', `cleaned ${n} dead`); }, 10 * 60 * 1000);

// End auction check every minute
setInterval(() => {
    const a = auctionsDB.active;
    if (a && Date.now() > a.endsAt) {
        if (a.topBidder) {
            try {
                bot.sendMessage(parseInt(a.topBidder), premiumText('🏆 Auction Won', `You won <b>${a.item}</b> for ${a.currentBid} pts!`, '🎉'), { parse_mode: 'HTML' });
            } catch {}
        }
        auctionsDB.history.push(a);
        auctionsDB.active = null;
        saveAuctions();
    }
}, 60 * 1000);

// ─── Auto-init ───

(async () => {
    try {
        const me = await bot.getMe();
        settings.bot_username = me.username;
        saveSettings();
        log('info', `Bot started: @${me.username}`);
        console.log('╔══════════════╗');
        console.log('║ɴᴇx ᴛᴇᴄʜ ᴄʟᴏᴜᴅ ʜᴏsᴛ ║');
        console.log('╚══════════════╝');
        console.log(`🕐 sᴛᴀʀᴛᴇᴅ: ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
        console.log(`👤 ᴀᴅᴍɪɴ: ${ADMIN_ID}`);
        console.log(`👥 ᴜsᴇʀs: ${Object.keys(usersDB).length}`);
        console.log(`🤖 ʀᴜɴɴɪɴɢ ʙᴏᴛs: ${Object.keys(runningProcesses).length}`);
        console.log(`📁 ᴅᴀᴛᴀ ᴅɪʀ: ${BASE_DIR}`);
        console.log('✅ ʙᴏᴛ ɪs ʟɪᴠᴇ\n');

        try {
            await bot.sendMessage(ADMIN_ID,
                premiumText('🟢 ʙᴏᴛ sᴛᴀʀᴛᴇᴅ',
                    `🤖 @${me.username}\n👥 ᴜsᴇʀs: ${Object.keys(usersDB).length}\n🕐 ${moment().format('YYYY-MM-DD HH:mm:ss')}`,
                    '🚀'),
                { parse_mode: 'HTML' });
        } catch {}
    } catch (e) {
        console.error('❌ Startup failed:', e.message);
        process.exit(1);
    }
})();

process.on('uncaughtException', (e) => console.error('💥 uncaughtException:', e.message));
process.on('unhandledRejection', (e) => console.error('💥 unhandledRejection:', e?.message || e));
/* 𝕿𝖍𝖊 𝖊𝖓𝖉
𝖆𝖑𝖑 𝖗𝖎𝖌𝖍𝖙 𝖗𝖊𝖘𝖊𝖗𝖛𝖊𝖉 
𝖈𝖗𝖊𝖆𝖙𝖊𝖉 𝖇𝖞 N𝖊𝖝 T𝖊𝖈𝖍 I𝖓𝖈 𝖓𝖊𝖝𝖙 𝖌𝖊𝖓𝖊𝖗𝖆𝖙𝖎𝖔𝖓 𝖙𝖊𝖈𝖍 𝖎𝖓𝖓𝖔𝖛𝖆𝖙𝖎𝖔𝖓
*/
