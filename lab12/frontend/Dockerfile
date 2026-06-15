# =============================================================================
# Етап 1: build — збірка React застосунку
# =============================================================================
FROM node:lts-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# Vite збирає статичні файли у папку dist/
RUN npm run build

# =============================================================================
# Етап 2: production — Nginx роздає статику
# =============================================================================
FROM nginx:alpine AS production

# Копіюємо зібрані файли в директорію nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Копіюємо власну конфігурацію nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
