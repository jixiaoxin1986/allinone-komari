#!/usr/bin/env node
// TG bot 推送节点订阅信息（独立脚本，不修改 index.js 源码）
// 等待主程序启动后，从本地获取订阅内容并通过 Telegram bot 发送
// 推送两条：一条普通节点订阅，一条 TG 代理链接

const http = require('http');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const CHAT_ID = process.env.CHAT_ID || '';
const NAME = process.env.NAME || 'allinone';
const SUB_PATH = process.env.SUB_PATH || '860238';
const PORT = process.env.PORT || 3000;

async function sendTelegram() {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.log('[tg-notify] BOT_TOKEN or CHAT_ID not set, skipping');
    return;
  }

  // 等待主程序启动（最多等 60 秒）
  let sub = null;
  for (let i = 0; i < 12; i++) {
    try {
      sub = await fetchPath(`/${SUB_PATH}`);
      if (sub) break;
    } catch (e) { /* retry */ }
    await new Promise(r => setTimeout(r, 5000));
  }

  if (!sub) {
    console.log('[tg-notify] failed to fetch subscription, skipping');
    return;
  }

  // 去重：内容没变就不重复推送
  const hash = crypto.createHash('md5').update(sub).digest('hex');
  const hashFile = path.join('/tmp', 'tg-notify-last.hash');
  try {
    const lastHash = fs.readFileSync(hashFile, 'utf8').trim();
    if (lastHash === hash) {
      console.log('[tg-notify] subscription unchanged, skipping duplicate push');
      return;
    }
  } catch (e) { /* first run, no hash file */ }

  try {
    // 第一条：普通节点订阅
    await sendMessage(`${NAME}节点推送\n<pre>${sub}</pre>`);

    // 第二条：TG 代理链接
    try {
      const tgInfo = await fetchPath(`/${SUB_PATH}-tg`);
      if (tgInfo) {
        // 提取 t.me 链接
        const match = tgInfo.match(/https:\/\/t\.me\/webproxy\?[^\s]+/);
        const tgLink = match ? match[0] : tgInfo.trim();
        await sendMessage(`${NAME} TG代理\n${tgLink}`);
      }
    } catch (e) {
      console.log('[tg-notify] failed to fetch TG link:', e.message);
    }

    fs.writeFileSync(hashFile, hash);
    console.log('[tg-notify] Telegram messages sent successfully');
  } catch (error) {
    console.error('[tg-notify] Failed to send Telegram message:', error.message);
  }
}

async function sendMessage(text) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const params = new URLSearchParams({
    chat_id: CHAT_ID,
    text: text,
    parse_mode: 'HTML'
  });
  await fetch(`${url}?${params}`, { method: 'POST' });
}

function fetchPath(urlPath) {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:${PORT}${urlPath}`, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.setTimeout(5000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

sendTelegram();
