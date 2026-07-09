# Build VUE project
FROM node:12.18.1 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Build server
FROM nginx:1.28.3 AS prod-stage
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libcap2=1:2.75-10+deb13u1 \
        libgnutls30t64=3.8.9-3+deb13u4 \
        libgssapi-krb5-2=1.21.3-5+deb13u1 \
        libk5crypto3=1.21.3-5+deb13u1 \
        libkrb5-3=1.21.3-5+deb13u1 \
        libkrb5support0=1.21.3-5+deb13u1 \
        libnghttp2-14=1.64.0-1.1+deb13u1 \
        libssh2-1t64=1.11.1-1+deb13u1 \
        libssl3t64=3.5.5-1~deb13u2 \
        libtiff6=4.7.0-3+deb13u2 \
        openssl=3.5.5-1~deb13u2 \
        openssl-provider-legacy=3.5.5-1~deb13u2 && \
    rm -rf /var/lib/apt/lists/*

COPY --from=build /app/dist/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
