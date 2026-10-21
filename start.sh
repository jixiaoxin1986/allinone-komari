#!/bin/bash
# 双进程启动：节点 (all-in-one) + Komari 监控
# Komari 配置走环境变量，源码一行不改

# 1. 启动 Komari agent（如果配置了 SERVER 和 TOKEN）
if [ -n "$KOMARI_SERVER" ] && [ -n "$KOMARI_TOKEN" ]; then
  echo "[start] launching komari-agent -> $KOMARI_SERVER"
  # KOMARI_TOKEN 是面板里该条目的固定 token，用 --token 参数（重启不产生重复条目）
  komari-agent -e "$KOMARI_SERVER" --token "$KOMARI_TOKEN" &
else
  echo "[start] KOMARI_SERVER/KOMARI_TOKEN not set, skipping komari-agent"
fi

# 2. 启动 TG 推送脚本（后台，延迟执行）
if [ -n "$BOT_TOKEN" ] && [ -n "$CHAT_ID" ]; then
  echo "[start] launching tg-notify.js"
  node tg-notify.js &
else
  echo "[start] BOT_TOKEN/CHAT_ID not set, skipping tg-notify"
fi

# 3. 启动节点主程序（前台，保持容器运行）
echo "[start] launching node index.js"
exec node index.js
