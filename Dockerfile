FROM nginx
# COPY ./cert/4862839_staging.jhtinfo.net.pem /etc/nginx/cert/4862839_staging.jhtinfo.net.pem
# COPY ./cert/4862839_staging.jhtinfo.net.key /etc/nginx/cert/4862839_staging.jhtinfo.net.key
# COPY nginx.production.conf /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY ./dist /app
WORKDIR /app
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# 构建版本
# FROM node:12.18.3
# COPY ./ /app
# WORKDIR /app
# RUN npm install && npm run build:stage

# FROM nginx
# RUN mkdir /app
# COPY --from=0 /app/dist /app
# COPY nginx.conf /etc/nginx/nginx.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
