# allinone-komari

eooce/node-ws `all-in-one` 分支的开箱即用部署包。

## 包含什么

- **all-in-one 源码**（`src/` 目录，原样复制，`index.js` 一行没改）：
  - vless + trojan + shadowsocks 三协议节点
  - 哪吒 v1 探针
  - Telegram webproxy
- **komari-agent**：Docker 构建时自动下载最新版二进制，启动脚本里跟节点一起跑
- **start.sh**：双进程启动脚本

## 部署时要填的环境变量

| 变量 | 说明 |
|---|---|
| `UUID` | 节点 UUID |
| `DOMAIN` | 你的域名 |
| `PORT` | 监听端口（默认 3000） |
| `KOMARI_SERVER` | Komari 面板地址，如 `https://komari.qingsong.kdns.fr` |
| `KOMARI_TOKEN` | Komari 客户端 token（面板里拿） |
| `NEZHA_SERVER` / `NEZHA_KEY` | 可选，哪吒 v1 才填 |

`KOMARI_SERVER` 和 `KOMARI_TOKEN` 都填了才会启动 komari-agent，不填就只跑节点。

## 说明

- `index.js` 源码未做任何修改，Komari 是独立进程，不影响节点代码
- 上游 all-in-one 有更新时，把 `src/` 里的文件换成新版即可
