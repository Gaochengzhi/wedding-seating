# 婚礼邀请函与在线选座系统

一个优雅的婚礼邀请系统，支持在线选座功能。系统分为邀请函展示和座位选择两个主要模块。

## 🌟 功能特性

- **优雅的婚礼邀请函**: 精美动画邀请页面，包含新人照片和婚礼详情
- **在线座位选择**: 交互式圆桌布局，实时座位管理
- **管理员功能**: 完整的宾客管理系统，支持拖拽操作
- **电话验证**: 安全的宾客身份验证系统
- **响应式设计**: 移动端友好的界面设计
- **实时数据**: 基于CSV的数据持久化，自动同步

## 🚀 技术架构

- **前端**: React 19 + Vite
- **UI组件**: Material-UI (MUI) + Tailwind CSS
- **后端**: Express.js + Node.js
- **数据存储**: CSV文件 + 自动备份
- **状态管理**: React Hooks
- **环境配置**: .env配置文件

## 📁 项目结构

```
wedding_invitor/
├── src/                    # 前端源码
│   ├── components/         # 组件目录
│   │   ├── admin/          # 管理员组件
│   │   ├── guest/          # 宾客注册组件
│   │   ├── ui/             # 通用UI组件
│   │   ├── SeatSelection.jsx    # 选座主页面
│   │   └── WelcomePage.jsx      # 欢迎页面
│   ├── hooks/              # 自定义React钩子
│   ├── utils/              # 工具函数
│   └── assets/             # 图片和SVG文件
├── server/                 # 后端服务器
│   ├── server.js           # Express服务器
│   ├── config.js           # 服务器配置
│   └── data/               # CSV数据文件
└── dist/                   # 生产构建文件
```

## 🛠️ 安装与设置

### 前置条件
- Node.js 18+ 和 npm
- Git

### 1. 克隆项目
```bash
git clone <your-repo-url>
cd wedding_invitor
```

### 2. 安装依赖
```bash
npm install
```

### 3. 环境配置
复制示例环境文件：
```bash
cp example.env .env
```

编辑 `.env` 文件配置：
```env
# 应用配置
VITE_APP_MODE=development
VITE_INVITATION_CODE=5201314
VITE_ADMIN_USERNAME=root
VITE_ADMIN_PASSWORD=root

# 服务器配置
VITE_API_BASE_URL=http://localhost:3001/api
VITE_PRODUCTION_SERVER=your-server-ip

# 资源路径
VITE_COUPLE_PATH=./src/assets/couple.svg
VITE_LEFT_FLOWER_PATH=./src/assets/left_flower.svg
VITE_RIGHT_FLOWER_PATH=./src/assets/right_flower.svg
VITE_WEDDING_INVITATION_TITLE_PATH=./src/assets/wedding_invitaion_titile_logo.svg
VITE_DINNING_ICON_PATH=./src/assets/dinning_icon.svg

# 桌子配置
VITE_TOTAL_TABLES=22
VITE_TABLES_PER_SIDE=11
VITE_MAX_SEATS_PER_TABLE=16
VITE_TABLE_RADIUS=65
VITE_TABLE_CENTER_SIZE=96
```

### 4. 开发模式
同时运行前后端：
```bash
npm run dev:full
```

或分别运行：
```bash
# 终端1 - 后端服务器
npm run server

# 终端2 - 前端开发
npm run dev
```

应用程序访问地址：
- 前端: `http://localhost:5173`
- 后端API: `http://localhost:3001`

## 🏗️ 生产部署

### 1. 构建前端
```bash
npm run build
```

### 2. 生产服务器结构
```
production-server/
├── dist/                   # 前端构建文件
├── server/                 # 后端文件
│   ├── server.js
│   ├── config.js
│   └── data/               # CSV数据文件
├── .env                    # 生产环境配置
├── package.json
└── node_modules/
```

### 3. 生产部署步骤

#### 步骤1: 准备部署文件
```bash
# 需要上传到生产服务器的文件：
- dist/ (前端构建输出)
- server/ (后端代码)
- .env (生产环境配置)
- package.json
```

#### 步骤2: 服务器设置
```bash
# 在生产服务器上执行
npm install --production

# 启动后端服务
cd server
node server.js
```

#### 步骤3: Web服务器配置 (Nginx)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }

    # API代理到Express服务器
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 步骤4: 进程管理 (PM2)
```bash
# 全局安装PM2
npm install -g pm2

# 启动应用程序
pm2 start server/server.js --name wedding-api

# 开机自启动
pm2 startup
pm2 save
```

#### 步骤5: 数据目录权限
```bash
# 确保CSV数据目录有写入权限
chmod 755 server/data/
chmod 644 server/data/*.csv
```

## 🎯 使用指南

### 宾客操作流程
1. **欢迎页面**: 查看婚礼邀请函，包含新人照片和婚礼详情
2. **邀请码验证**: 输入邀请码（开发模式下自动填充）
3. **座位选择**: 在交互式圆桌上选择可用座位
4. **宾客注册**: 填写姓名、性别、电话号码等必填信息和可选详情
5. **电话验证**: 通过电话号码验证来编辑或删除座位

### 管理员功能
1. **管理员登录**: 用户名 `root`，密码 `root`
2. **拖拽操作**: 通过拖拽在座位间移动宾客
3. **桌子管理**: 添加/删除桌子，添加桌子备注
4. **宾客管理**: 在数据表格中查看所有宾客信息
5. **关系管理**: 管理宾客关系分类

## 🔧 API接口

### 宾客管理
- `GET /api/guests` - 获取所有宾客
- `POST /api/guests` - 保存/更新宾客
- `DELETE /api/guests/:seatId/:tableId` - 删除指定宾客
- `DELETE /api/guests` - 清空所有数据

### 桌子管理
- `GET /api/tables` - 获取所有桌子
- `POST /api/tables` - 创建新桌子
- `DELETE /api/tables/:tableId` - 删除桌子
- `POST /api/tables/:tableId/notes` - 更新桌子备注

### 系统接口
- `GET /api/health` - 健康检查
- `GET /api/relationships` - 获取关系分类

## 🔒 安全特性

- 电话号码验证系统保护宾客操作
- 管理员身份验证系统
- 数据验证和清洗
- 自动数据备份系统
- 基于环境的配置管理

## 🐛 开发说明

### 环境检测
- **开发环境** (localhost): 自动填充邀请码，直接访问
- **生产环境**: 需要输入正确的邀请码

### 数据管理
- 所有数据存储在 `server/data/` 的CSV文件中
- 自动备份系统保护数据安全
- 前后端实时数据同步

### 响应式设计
- 移动端优化界面
- 触摸友好的拖拽操作
- 适配不同屏幕尺寸的自适应布局

## 🎨 座位布局说明

### T台布局设计
```
左侧11桌    [T台]    右侧11桌
   1桌                1桌
   2桌     主舞台      2桌  
   3桌      ♥        3桌
   ...      台        ...
  11桌               11桌
```

### 圆桌座位排列 (每桌12座位，最多可扩展16座位)
```
    [1] [2] [3] [4]
[12]                [5]
[11]      桌号       [6]  
[10]               [7]
    [9] [8] [7] [6]
```

### 颜色编码
- 🔵 浅蓝色：男性宾客
- 🔴 浅红色：女性宾客
- ⚪ 灰色：空座位（显示"可选"）

## 📊 宾客关系分类

系统支持以下宾客关系类型：
- 男方同学/同事
- 女方同学/同事
- 男方爸爸亲友
- 男方妈妈亲友
- 女方爸爸亲友
- 女方妈妈亲友
- 男方爸爸同事
- 女方爸爸同事

## 📱 移动端支持

- 完全响应式设计
- 触摸优化的拖拽功能
- 移动端友好的表单界面
- 自适应的桌子布局

## 🔧 故障排除

### 常见问题

1. **拖拽功能不工作**
   - 确保在管理员模式下操作
   - 检查浏览器是否支持HTML5拖拽API

2. **数据不同步**
   - 检查后端服务器是否正常运行
   - 确认API请求没有被防火墙阻止

3. **CSV文件权限问题**
   - 确保 `server/data/` 目录有写入权限
   - 检查文件所有权设置

4. **环境变量未生效**
   - 确认 `.env` 文件在项目根目录
   - 重启开发服务器

## 📝 许可证

此项目为私人婚礼项目，版权所有。

## 🤝 贡献

这是一个私人婚礼项目，不接受外部贡献。

---

如需部署支持或技术问题，请查阅文档中的故障排除部分。