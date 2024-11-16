FROM node:18-alpine as build
WORKDIR /web_app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
WORKDIR /runtime
FROM node:18-alpine
COPY --from=build /web_app/.next/standalone ./
COPY --from=build  /web_app/.next/static ./.next/static
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
ENTRYPOINT ["node", "server.js"]