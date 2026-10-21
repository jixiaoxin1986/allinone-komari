FROM node:20-alpine3.20

WORKDIR /app

# UDP 版节点源码（xray-core，SOCKS udp:true；Komari 走固定 token，env 注入）
COPY src/index.js src/package.json ./

RUN apk update && apk add --no-cache bash openssl curl && \
    npm install && \
    chmod +x index.js

COPY start.sh /app/
RUN chmod +x /app/start.sh

EXPOSE 3000

CMD ["/app/start.sh"]
