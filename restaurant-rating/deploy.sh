#!/bin/bash

echo "=== 开始部署 ==="

# 1. 拉取最新代码
echo "1. 拉取最新代码..."
cd /home/ubuntu/restaurant-rating
git pull

# 2. 安装后端依赖
echo "2. 安装后端依赖..."
cd /home/ubuntu/restaurant-rating/restaurant-rating/backend
npm install --production

# 3. 安装前端依赖并构建
echo "3. 构建前端..."
cd /home/ubuntu/restaurant-rating/restaurant-rating/frontend
npm install
npm run build

# 4. 重启后端服务
echo "4. 重启后端服务..."
cd /home/ubuntu/restaurant-rating
pm2 restart restaurant-api

# 5. 配置Nginx
echo "5. 配置Nginx..."
sudo cp /home/ubuntu/restaurant-rating/nginx/default.conf /etc/nginx/sites-available/default
sudo nginx -t
sudo systemctl reload nginx

echo "=== 部署完成 ==="
