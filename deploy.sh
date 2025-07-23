#!/bin/bash

set -e

echo "开始部署..."

# 1. 前端构建
npm run build

# 2. 生成干净的CSV模板文件（基于生产配置）
echo "生成CSV模板文件..."
export NODE_ENV=production
node server/generate-templates.js

# 3. 创建部署目录
rm -rf build
mkdir build

# 4. 复制文件
cp -r dist/* build/
cp -r server build/
cp .env.production build/.env
cp package.json build/

# 5. 替换服务器CSV文件为干净的模板
echo "复制干净的CSV模板文件..."
mkdir -p build/server/data
cp server/templates/*.csv build/server/data/

# 6. 上传到服务器
scp -r build/* kounarushi@74.48.115.131:/home/kounarushi/wedding/

echo "部署完成"