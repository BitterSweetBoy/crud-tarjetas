FROM node:22-alpine as build

WORKDIR /app

# Copiar solo archivos de dependencias
COPY package*.json ./

# Usar npm install en lugar de npm ci
RUN npm install --legacy-peer-deps

# Copiar código fuente
COPY . .

# Build de producción
RUN npm run build

# Etapa de producción
FROM nginx:alpine

COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]