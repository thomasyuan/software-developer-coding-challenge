FROM node:alpine as builder

WORKDIR backend
COPY . .
RUN npm install --only=production

FROM node:alpine


WORKDIR backend
COPY --from=builder /backend .
EXPOSE 8000
ENTRYPOINT  ["node", "index.js"]
