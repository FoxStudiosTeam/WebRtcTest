FROM node:19-alpine AS build
WORKDIR /web_app
COPY web/package*.json ./
COPY web/tsconfig.json ./tsconfig.json
COPY web/next.config.ts ./next.config.ts
RUN npm install
COPY ./web ./
#ENTRYPOINT ["sleep", "10000"]
RUN npm run build
WORKDIR /runtime
FROM node:19-alpine
COPY --from=build /web_app/.next/standalone ./
COPY --from=build  /web_app/.next/static ./.next/static
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
ENTRYPOINT ["node", "server.js"]