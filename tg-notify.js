#!/usr/bin/env node
// TG bot 推送节点订阅信息（独立脚本，不修改 index.js 源码）
// 等待主程序启动后，从本地获取订阅内容并通过 Telegram bot 发送

const http = require('http');

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
      sub = await fetchSub();
      if (sub) break;
    } catch (e) { /* retry */ }
    await new Promise(r => setTimeout(r, 5000));
  }

  if (!sub) {
    console.log('[tg-notify] failed to fetch subscription, skipping');
    return;
  }

  try {
    const escapedName = NAME.replace(/[_*\[\]()~`>#+=|{}.!-]/g, '\\$&');
    const message = `**${escapedName}节点推送**\n\`\`\`${sub}\`\`\``;
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const params = new URLSearchParams({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'MarkdownV2'
    });
    await fetch(`${url}?${params}`, { method: 'POST' });
    console.log('[tg-notify] Telegram message sent successfully');
  } catch (error) {
    console.error('[tg-notify] Failed to send Telegram message:', error.message);
  }
}

function fetchSub() {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:${PORT}/${SUB_PATH}`, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.setTimeout(5000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

sendTelegram();
