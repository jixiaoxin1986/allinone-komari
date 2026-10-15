FROM node:20-alpine3.20

WORKDIR /app

# all-in-one 源码（原样复制，不做任何修改）
COPY src/index.js src/package.json ./

# 安装依赖 + 下载 komari-agent 二进制
RUN apk update && apk add --no-cache bash openssl curl && \
    npm install && \
    curl -sL -o /usr/local/bin/komari-agent \
      https://github.com/komari-monitor/komari-agent/releases/latest/download/komari-agent-linux-amd64 && \
    chmod +x /usr/local/bin/komari-agent index.js

COPY start.sh tg-notify.js /app/
RUN chmod +x /app/start.sh

EXPOSE 3000

CMD ["/app/start.sh"]
