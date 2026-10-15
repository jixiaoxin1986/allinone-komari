#!/bin/bash
# 双进程启动：节点 (all-in-one) + Komari 监控
# Komari 配置走环境变量，源码一行不改

# 1. 启动 Komari agent（如果配置了 SERVER 和 TOKEN）
if [ -n "$KOMARI_SERVER" ] && [ -n "$KOMARI_TOKEN" ]; then
  echo "[start] launching komari-agent -> $KOMARI_SERVER"
  komari-agent -s "$KOMARI_SERVER" -t "$KOMARI_TOKEN" &
else
  echo "[start] KOMARI_SERVER/KOMARI_TOKEN not set, skipping komari-agent"
fi

# 2. 启动节点主程序（前台，保持容器运行）
echo "[start] launching node index.js"
exec node index.js
