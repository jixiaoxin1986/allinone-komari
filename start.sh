#!/bin/bash
# UDP 版节点：单进程启动，xray/哪吒/Komari/TG 推送都由 index.js 自己管理
exec node index.js
