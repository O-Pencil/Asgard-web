FROM node:20-alpine AS builder
WORKDIR /app

ARG VITE_ASGARD_API_ORIGIN=""
ENV VITE_ASGARD_API_ORIGIN=$VITE_ASGARD_API_ORIGIN

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker-entrypoint.d/ /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/*.sh
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
