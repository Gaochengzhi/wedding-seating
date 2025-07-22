# 婚礼在线选座系统 - 开发文档

## 项目概述
一个优雅的婚礼请帖系统，支持在线选座功能。系统分为邀请函展示和座位选择两个主要模块。

## 技术栈
- **Framework**: React 19 + Vite (考虑迁移到 Next.js)
- **UI Components**: Material-UI (MUI) + Tailwind CSS
- **State Management**: React useState (后期可扩展到 Context/Redux)
- **Environment**: .env 配置文件管理
- **Data Storage**: CSV文件管理 (需要后端支持)

## CSV数据管理挑战
当前纯前端架构的局限：
1. 浏览器无法直接写入本地文件系统
2. CSV文件需要用户手动下载/上传
3. 无法实现自动持久化存储
4. 多用户访问时数据同步困难

### 解决方案选项：

#### 方案1: 迁移到Next.js (推荐)
- 利用Next.js API routes处理CSV文件读写
- 前后端一体化开发
- 可以直接在服务器端操作文件系统
- 支持实时数据持久化

#### 方案2: React+Vite + Express后端 (已实现) ✅
- 轻量级Express服务器处理CSV文件
- 自动持久化存储，无需手动导入导出
- 前后端分离架构，易于部署
- API接口：
  - `GET /api/guests` - 获取所有宾客
  - `POST /api/guests` - 保存/更新宾客
  - `DELETE /api/guests/:seatId/:tableId` - 删除指定宾客
  - `DELETE /api/guests` - 清空所有数据
  - `GET /api/health` - 健康检查

#### 方案3: 使用浏览器本地存储 (已移除)
- ~~localStorage存储(已移除)~~
- ~~手动CSV导入导出(已移除)~~
- 改为实时API调用

## 系统架构设计

### 1. 环境配置
```
VITE_APP_MODE=development|production
VITE_PRODUCTION_SERVER=74.48.115.131
VITE_INVITATION_CODE=5201314
VITE_ADMIN_USERNAME=root
VITE_ADMIN_PASSWORD=root
```

### 2. 页面流程
```
邀请函页面 -> 邀请码验证 -> 座位选择页面
     ↓           ↓              ↓
  婚礼信息    测试模式跳过    T台布局展示
  新郎新娘    生产模式验证    22桌圆桌布局
  时间地点      5201314      宾客管理功能
```

### 3. 数据结构设计

#### 座位数据结构
```javascript
// 单个座位
{
  id: string,
  tableId: string,
  name: string,
  gender: 'male' | 'female',
  phone: string,
  notes: string,
  accommodation: boolean,
  relationship: 'groom_classmate' | 'bride_family' | etc.
}

// 餐桌结构  
{
  id: string,
  number: number,
  maxCapacity: 12,
  currentCount: number,
  side: 'left' | 'right',
  position: { x: number, y: number },
  notes: string,
  seats: Seat[]
}
```

#### 宾客关系分类
- 男方同学/同事
- 女方同学/同事  
- 男方爸爸亲友
- 男方妈妈亲友
- 女方爸爸亲友
- 女方妈妈亲友
- 男方爸爸同事
- 女方爸爸同事

### 4. 功能模块

#### 邀请码验证逻辑
- **测试模式** (localhost): 自动填充邀请码，直接进入
- **生产模式** (74.48.115.131): 必须输入正确邀请码 "5201314"

#### 座位布局设计
- **长廊式布局**: 中间T台，两边各11桌
- **圆桌显示**: 显示占用情况 "3/12" 
- **颜色编码**:
  - 浅蓝色: 男性宾客
  - 浅红色: 女性宾客  
  - 灰色: 空座位(显示"可选")

#### 用户交互流程
1. **添加宾客**: 点击灰色座位或"+"号
2. **注册表单**: 姓名、性别、电话(必填) + 备注、住宿、关系(可选)
3. **编辑模式**: 点击已有头像，需补全信息才能操作
4. **管理功能**: 超级用户可以移动、备注、增删改查

### 5. 开发进度

#### 已完成 ✅
- [x] 项目初始化和依赖安装
- [x] Material-UI 和 Tailwind CSS 配置
- [x] 环境配置文件设置
- [x] 婚礼信息展示页面
- [x] 邀请码输入验证组件

#### 进行中 🔄  
- [ ] 座位选择UI布局（T台+22桌圆桌）
- [ ] 座位状态管理和数据结构
- [ ] 宾客注册表单组件

#### 待开发 📋
- [ ] 编辑删除功能
- [ ] 超级用户管理界面
- [ ] 数据持久化（LocalStorage/后端API）
- [ ] 响应式布局优化
- [ ] 错误处理和用户体验优化

### 6. 核心逻辑实现思路

#### 座位管理状态
```javascript
const [tables, setTables] = useState(initialTableData)
const [selectedSeat, setSelectedSeat] = useState(null)
const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
const [guestData, setGuestData] = useState({})
```

#### 座位操作逻辑（详细业务逻辑）
1. **点击灰色空座位**: 
   - 显示"可选"文字
   - 点击后弹出宾客注册表单
   - 必填：姓名、性别、电话号码
   - 可选：备注、是否安排住宿、关系分类

2. **点击桌子的+号**: 
   - 自动选择该桌第一个空座位
   - 弹出宾客注册表单

3. **点击已占座位头像**: 
   - 显示宾客姓名首字母
   - 颜色：浅蓝色(男)、浅红色(女)
   - 点击后进入编辑/删除模式
   - 要求补全姓名和电话号码才能操作

4. **超级用户模式**:
   - 用户名: root, 密码: root
   - 可以给桌子添加备注
   - 可以移动宾客到其他座位
   - 可以批量增删改查操作

#### Express后端架构
```javascript
// 服务器端文件结构
server/
  ├── server.js          // Express主服务器
  └── data/
      └── guests.csv     // CSV数据文件
```

#### API调用流程
1. **页面加载**: 调用`GET /api/guests`加载所有宾客
2. **添加宾客**: 调用`POST /api/guests`保存新宾客
3. **编辑宾客**: 调用`POST /api/guests`更新宾客信息
4. **删除宾客**: 调用`DELETE /api/guests/:seatId/:tableId`
5. **超级用户登录**: 调用`POST /api/admin/login`
6. **桌子备注**: 调用`POST /api/tables/:tableId/notes`
7. **移动宾客**: 调用`POST /api/guests/move`

#### 座位布局规范
```
T台布局：
左侧11桌    [T台]    右侧11桌
   1桌                1桌
   2桌     主舞台      2桌  
   3桌      ♥        3桌
   ...      台        ...
  11桌               11桌

每桌座位排列(圆桌12座位):
    [1] [2] [3] [4]
[12]                [5]
[11]      桌号       [6]  
[10]               [7]
    [9] [8] [7] [6]
```

#### UI状态管理
```javascript
// 主要状态
const [tables, setTables] = useState(initializeTables()) // 22桌数据
const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false)
const [selectedSeat, setSelectedSeat] = useState(null) // 当前选中座位
const [guestData, setGuestData] = useState({}) // 表单数据
const [isAdminMode, setIsAdminMode] = useState(false) // 管理员模式
const [adminLoginOpen, setAdminLoginOpen] = useState(false) // 管理员登录窗口

// 数据同步流程
1. 组件加载 -> loadGuestDataFromServer() -> 更新tables状态
2. 用户操作 -> API调用 -> 更新本地状态 -> UI重新渲染
3. 数据持久化 -> CSV文件自动保存
```

#### 数据验证规则
- 姓名: 必填，2-10个字符
- 性别: 必选 (male/female)
- 电话: 必填，11位数字
- 关系分类: 必选 (从10个选项中选择)
- 住宿需求: 布尔值，默认false
- 备注: 可选，支持多行文本

## 开发注意事项

1. **环境区分**: 确保测试和生产环境正确切换
2. **数据安全**: 敏感信息不提交到git仓库  
3. **用户体验**: 操作流程简单直观，错误提示友好
4. **响应式设计**: 支持移动端访问
5. **性能优化**: 大量座位数据的渲染优化

## 后续扩展计划

1. **后端API**: 数据持久化和多用户同步
2. **实时更新**: WebSocket 实现实时座位状态同步
3. **导出功能**: 宾客名单Excel导出
4. **统计面板**: 宾客分析和统计报表
5. **消息通知**: 座位变更通知功能