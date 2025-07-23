# 婚礼在线选座系统 - 部署指南

## 生产环境部署步骤

### 1. 服务器环境准备
确保服务器已安装：
- Node.js (推荐 v18+)
- npm 或 yarn

### 2. 环境变量配置
在生产服务器上创建 `.env.production` 文件：

```bash
# Production Environment Configuration
NODE_ENV=production
APP_MODE=production
PRODUCTION_SERVER=74.48.115.131

# Invitation Code Configuration
ENABLE_INVITATION_CODE=true
INVITATION_CODE=5201314

# Super Admin Credentials
ADMIN_USERNAME=root
ADMIN_PASSWORD=root

# Wedding Details
GROOM_NAME=高成志
BRIDE_NAME=刘子悦
WEDDING_DATE=2025年10月2日
WEDDING_LOCATION=常州中吴宾馆中午XX厅

# Table and Seat Configuration
DEFAULT_SEATS_PER_TABLE=12
TABLES_PER_SIDE=11
TOTAL_TABLES=22
MAX_SEATS_PER_TABLE=16

# Phone Validation Configuration
PHONE_NUMBER_LENGTH=11

# Server Configuration (Backend)
PORT=3001

# API Base URL Configuration (Frontend)
API_BASE_URL=http://localhost:3001/api
PRODUCTION_API_BASE_URL=http://74.48.115.131:3001/api
```

### 3. 构建和部署

```bash
# 1. 安装依赖
npm install

# 2. 构建前端
npm run build

# 3. 启动生产服务器（确保NODE_ENV=production）
npm run server:prod

# 或者手动设置环境变量
NODE_ENV=production node server/server.js
```

### 4. 验证部署

#### 检查后端服务
```bash
curl http://74.48.115.131:3001/api/health
```
应该返回：
```json
{
  "success": true,
  "message": "Wedding invitation server is running",
  "timestamp": "2025-01-XX..."
}
```

#### 检查前端连接
打开浏览器访问前端页面，打开开发者工具查看 Console，应该看到：
```
API Base URL: http://74.48.115.131:3001/api
```

#### 检查数据
- 生产环境应该从空数据开始，不会有测试用户
- CSV文件位置：`server/data/guests.csv`
- 如果需要清空数据：删除 `server/data/` 目录下所有 CSV 文件，重启服务器

### 5. 问题排查

#### 前后端连接问题
- 检查 API Base URL 是否正确显示为生产地址
- 检查服务器防火墙是否开放 3001 端口
- 检查 CORS 配置是否允许前端域名访问

#### 数据同步问题
- 检查 CSV 文件是否存在：`ls -la server/data/`
- 检查文件权限：`chmod 755 server/data/`
- 重启服务器：`pm2 restart wedding-server` 或重新运行启动命令

#### 环境变量问题
- 确认 `NODE_ENV=production` 已设置
- 验证环境变量加载：在 server.js 中添加 `console.log('NODE_ENV:', process.env.NODE_ENV)`

### 6. 生产环境特性

- ✅ 不会自动插入测试数据
- ✅ 从空用户开始
- ✅ 邀请码验证启用
- ✅ 数据持久化到 CSV 文件
- ✅ 自动根据域名切换 API 地址

### 7. 服务管理（推荐使用 PM2）

```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start server/server.js --name wedding-server --env production

# 查看状态
pm2 status

# 查看日志
pm2 logs wedding-server

# 重启服务
pm2 restart wedding-server
```

### 8. 备份建议

定期备份 `server/data/` 目录下的所有 CSV 文件：
```bash
# 创建备份
tar -czf wedding-backup-$(date +%Y%m%d).tar.gz server/data/

# 恢复备份
tar -xzf wedding-backup-YYYYMMDD.tar.gz
```